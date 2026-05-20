#!/usr/bin/env node

// ── ENV 로딩: scripts/firebase/firebase.env → 프로젝트 루트/firebase.env → CWD/firebase.env
const path = require('path');
const fs = require('fs');
try {
    const dotenv = require('dotenv');
    dotenv.config({ path: path.resolve(__dirname, 'firebase.env') });
    dotenv.config({ path: path.resolve(__dirname, '../../firebase.env') });
    dotenv.config(); // CWD
} catch (_) {}

const admin = require('firebase-admin');
const minimist = require('minimist');

function readJsonFileSync(p) {
    const norm = path.normalize(p);
    if (!fs.existsSync(norm)) return null;
    const txt = fs.readFileSync(norm, 'utf8');
    return JSON.parse(txt);
}

function loadServiceAccount(argv) {
    // 우선순위: --key > GOOGLE_APPLICATION_CREDENTIALS_JSON > GOOGLE_APPLICATION_CREDENTIALS_BASE64 > GOOGLE_APPLICATION_CREDENTIALS(file) > 프로젝트루트 fallback
    const viaArg = argv.key || argv.k;

    const inlineJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (inlineJson && inlineJson.trim()) {
        const sa = JSON.parse(inlineJson);
        if (!sa.project_id) throw new Error('inline JSON에 project_id 없음');
        return { source: 'JSON_INLINE', sa };
    }

    const inlineB64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
    if (inlineB64 && inlineB64.trim()) {
        const sa = JSON.parse(Buffer.from(inlineB64, 'base64').toString('utf8'));
        if (!sa.project_id) throw new Error('base64 JSON에 project_id 없음');
        return { source: 'JSON_BASE64', sa };
    }

    const hinted = viaArg || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const fallback = path.resolve(__dirname, '../../service-account.json');
    const candidate = (hinted && hinted.trim()) || fallback;

    const sa = readJsonFileSync(candidate);
    if (!sa) {
        throw new Error(
            `서비스 계정 키 JSON을 찾을 수 없습니다.\n` +
            ` - --key 인자: ${viaArg || '(unset)'}\n` +
            ` - .env GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || '(unset)'}\n` +
            ` - .env *_JSON / *_BASE64: ${inlineJson ? 'set' : 'unset'} / ${inlineB64 ? 'set' : 'unset'}\n` +
            ` - 기본 경로(프로젝트 루트): ${fallback}\n` +
            ` - 현재 시도: ${candidate}\n`
        );
    }
    if (!sa.project_id) throw new Error('service-account.json에 project_id 없음');
    return { source: 'FILE', path: candidate, sa };
}

async function resolveUid(argv) {
    if (argv.uid) return String(argv.uid);
    if (argv.u) return String(argv.u);
    if (argv.email) {
        const user = await admin.auth().getUserByEmail(String(argv.email));
        return user.uid;
    }
    if (process.env.FIREBASE_ADMIN_UID) return process.env.FIREBASE_ADMIN_UID;
    throw new Error('대상 사용자 지정 필요: --uid <UID> 또는 --email <EMAIL> 또는 .env의 FIREBASE_ADMIN_UID');
}

async function main() {
    const argv = minimist(process.argv.slice(2));

    // 서비스 계정 로드 + 초기화
    const loaded = loadServiceAccount(argv);
    const sa = loaded.sa;
    admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: sa.project_id,
    });
    console.log(`[ADMIN SDK] project_id=${sa.project_id} client_email=${sa.client_email} source=${loaded.source}${loaded.path ? ` path=${loaded.path}` : ''}`);

    // 대상 사용자
    const uid = await resolveUid(argv);
    console.log(`[TARGET] uid=${uid}${argv.email ? ` (email=${argv.email})` : ''}`);

    // 조회 모드
    if (argv.show) {
        const user = await admin.auth().getUser(uid);
        console.log('UID:', user.uid);
        console.log('email:', user.email);
        console.log('customClaims:', user.customClaims || {});
        return;
    }

    // 초기화(unset)
    if (argv.unset) {
        await admin.auth().setCustomUserClaims(uid, null);
        if (argv.revoke || argv.r) await admin.auth().revokeRefreshTokens(uid);
        console.log(`✅ Cleared custom claims${argv.revoke ? ' & revoked refresh tokens' : ''} for ${uid}`);
        return;
    }

    // 설정할 클레임 구성
    const newClaims = {};
    if (typeof argv.admin !== 'undefined') newClaims.admin = String(argv.admin).toLowerCase() === 'true';
    if (argv.roles) {
        newClaims.roles = String(argv.roles).split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Object.keys(newClaims).length === 0) {
        throw new Error('설정할 클레임이 없습니다. --roles ADMIN 또는 --admin true, 또는 --unset/--show 사용');
    }

    // 병합 여부
    let claimsToSet = newClaims;
    if (argv.merge) {
        const user = await admin.auth().getUser(uid);
        claimsToSet = { ...(user.customClaims || {}), ...newClaims };
    }

    // 드라이런
    if (argv['dry-run'] || argv.dry) {
        console.log('🧪 DRY-RUN: setCustomUserClaims(미실행) →', claimsToSet);
        return;
    }

    // 실제 반영
    await admin.auth().setCustomUserClaims(uid, claimsToSet);
    if (argv.revoke || argv.r) await admin.auth().revokeRefreshTokens(uid);

    console.log('✅ setCustomUserClaims for', uid, '→', claimsToSet);

    // 확인 출력
    const refreshed = await admin.auth().getUser(uid);
    console.log('🔎 current customClaims:', refreshed.customClaims || {});
}

main().catch(err => {
    // Firebase 권한/키/시계 문제 디버깅 힌트
    console.error('❌ Error:', err?.message || err);
    if (String(err).includes('permission') || String(err).includes('PERMISSION_DENIED')) {
        console.error('   ↳ 서비스 계정에 roles/firebaseauth.admin, roles/serviceusage.serviceUsageConsumer 권한이 있는지 확인하세요.');
    }
    if (String(err).includes('invalid_grant')) {
        console.error('   ↳ 키가 취소되었거나 서버 시계가 맞지 않을 수 있습니다. 새 키 발급 또는 시간 동기화(w32tm /resync) 후 재시도 하세요.');
    }
    process.exit(1);
});

