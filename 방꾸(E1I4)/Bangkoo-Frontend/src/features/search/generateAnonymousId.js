export function getAnonymousId() {
    let id = localStorage.getItem('anonymousId');
    if (!id) {
        // 없으면 새로 UUID 생성
        id = crypto.randomUUID(); // 브라우저 내장 UUID 생성
        localStorage.setItem('anonymousId', id); // 브라우저 내장 UUID 생성기
    }
    return `anonymous-${id}`;
}
