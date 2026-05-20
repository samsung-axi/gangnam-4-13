# main.py  (OPS 서버)
import os
import uvicorn
import json
from contextlib import asynccontextmanager
from urllib.parse import urlparse
from threading import Event
from datetime import datetime
from typing import Dict
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_RUNNING, STATE_PAUSED, STATE_STOPPED
from apscheduler.triggers.cron import CronTrigger
from zoneinfo import ZoneInfo

from update_old_products import scan_old_to_product

# === 경로 고정된 .env ===
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

# 업로드/스크래핑 함수 (각 run_*/upload_* 함수는 Optional[Event] = None 지원한다고 가정)
from firebase_uploader import (
    upload_all_products_to_firebase,
    upload_id_price_to_firebase,
    upload_other_info_to_firebase,
)
from emart_json import run_scraper as run_all_scraper
from emart_price_json import run_scraper as run_price_scraper
from emart_non_price_json import run_scraper as run_non_price_scraper
from emart_image import run_emart_image

# === 전역 취소 이벤트 ===
CANCEL_EVENT = Event()

# === 공통 타임존 ===
KST = ZoneInfo("Asia/Seoul")


# ---------------------------
# 유틸
# ---------------------------
def _read_env_as_dict(path: str | Path) -> Dict[str, str]:
    p = Path(path)
    d: Dict[str, str] = {}
    if p.exists():
        with p.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                d[k] = v
    return d


def _is_http_url(url: str) -> bool:
    try:
        u = urlparse(url)
        return u.scheme in ("http", "https") and bool(u.netloc)
    except Exception:
        return False


def _strip_quotes(v: str) -> str:
    v = v.strip()
    if (v.startswith('"') and v.endswith('"')) or (
        v.startswith("'") and v.endswith("'")
    ):
        return v[1:-1]
    return v


ENV_KEYS = [
    "EMART_START_PAGE",
    "EMART_END_PAGE",
    "EMART_PAGE_CAP",
    "EMART_PAGE_DELAY_SEC",
    "EMART_EMPTY_PAGE_STOP",
    "EMART_PARTIAL_SAVE_EVERY",
    "EMB_SERVER",
    "EMB_ENDPOINT",
    "EMB_METHOD",
    "EMB_VERIFY_SSL",
    "ALL_HOUR",
    "ALL_MINUTE",
    "PRICE_HOUR",
    "PRICE_MINUTE",
    "OLD_HOUR",
    "OLD_MINUTE",
]


# ---------------------------
# 스케줄러 잡 함수
# ---------------------------
def scheduler_all():
    """전체 상품 스크래핑 후 업로드"""
    try:
        if CANCEL_EVENT.is_set():
            print("===== 정기 작업 SKIP: CANCEL_EVENT set =====")
            return
        print("===== 정기 작업 시작: 모든 상품 스크래핑 =====")
        run_all_scraper(CANCEL_EVENT)
        if CANCEL_EVENT.is_set():
            print("===== 취소 감지: 업로드 단계 생략 =====")
            return
        print("===== 스크래핑 완료. 파이어베이스 업로드 시작 =====")
        upload_all_products_to_firebase(CANCEL_EVENT)
        print("===== 모든 정기 작업 완료 =====")
    except Exception as e:
        print(f"정기 작업(전체) 오류: {e}")


def scheduler_price():
    """가격 정보 스크래핑 후 업로드"""
    try:
        if CANCEL_EVENT.is_set():
            print("===== 정기 작업 SKIP: CANCEL_EVENT set =====")
            return
        print("===== 정기 작업 시작: 상품 가격 스크래핑 =====")
        run_price_scraper(CANCEL_EVENT)
        if CANCEL_EVENT.is_set():
            print("===== 취소 감지: 업로드 단계 생략 =====")
            return
        print("===== 스크래핑 완료. 가격 업로드 시작 =====")
        upload_id_price_to_firebase(CANCEL_EVENT)
        print("===== 모든 정기 작업 완료 =====")
    except Exception as e:
        print(f"정기 작업(가격) 오류: {e}")


def scheduler_old():
    """오래된 작업 스크래핑 후 업로드 or 삭제"""
    try:
        if CANCEL_EVENT.is_set():
            print("===== 정기 작업 SKIP: CANCEL_EVENT set =====")
            return
        print("===== 정기 작업 시작: 상품 가격 스크래핑 =====")
        scan_old_to_product(CANCEL_EVENT)
        print("===== 모든 정기 작업 완료 =====")
    except Exception as e:
        print(f"정기 작업(가격) 오류: {e}")


# ---------------------------
# lifespan: 스케줄러 일원화
# ---------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    sched = BackgroundScheduler(timezone=KST)

    # .env 직접 읽어서 기본값 결정
    env = _read_env_as_dict(ENV_PATH)
    # ALL: 기본 3:00 (빈값이면 기본 적용)
    ALL_HOUR = env.get("ALL_HOUR", "").strip() or "3"
    ALL_MINUTE = env.get("ALL_MINUTE", "").strip() or "30"
    # PRICE: 기본 *:30 (빈값이면 '*'와 '30'로 해석)
    PRICE_HOUR = env.get("PRICE_HOUR", "").strip() or "1-2,5-23"
    PRICE_MINUTE = env.get("PRICE_MINUTE", "").strip() or "30"
    # OLD: 기본 3:00 (빈값이면 기본 적용)
    OLD_HOUR = env.get("OLD_HOUR", "").strip() or "4"
    OLD_MINUTE = env.get("OLD_MINUTE", "").strip() or "30"

    # 전체 스크랩 + 업로드
    sched.add_job(
        scheduler_all,
        "cron",
        id="job_all",  # 프론트와의 계약: 고정 ID
        hour=ALL_HOUR,
        minute=ALL_MINUTE,
        second=0,  # 통일
        replace_existing=True,
        coalesce=True,
        max_instances=1,
        misfire_grace_time=120,
    )
    # 가격 스크랩 + 업로드
    sched.add_job(
        scheduler_price,
        "cron",
        id="job_price",  # 프론트와의 계약: 고정 ID
        hour=PRICE_HOUR,
        minute=PRICE_MINUTE,
        second=0,  # 통일
        replace_existing=True,
        coalesce=True,
        max_instances=1,
        misfire_grace_time=120,
    )
    # 오래된 상품 스크랩 or 삭제
    sched.add_job(
        scheduler_old,
        "cron",
        id="job_old",  # 프론트와의 계약: 고정 ID
        hour=OLD_HOUR,
        minute=OLD_MINUTE,
        second=0,  # 통일
        replace_existing=True,
        coalesce=True,
        max_instances=1,
        misfire_grace_time=120,
    )

    sched.start()
    app.state.scheduler = sched
    print(
        f"스케줄러 시작: all({ALL_HOUR}:{ALL_MINUTE}), price({PRICE_HOUR}:{PRICE_MINUTE}), old({OLD_HOUR}:{OLD_MINUTE})"
    )
    try:
        yield
    finally:
        sched.shutdown()
        print("스케줄러 종료")


app = FastAPI(lifespan=lifespan)

# (선택) CORS
allow_origins = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173")
allow_origins_list = [o.strip() for o in allow_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# 라우트
# ---------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


CATEGORIES_PATH = BASE_DIR / "categories.json"


@app.get("/categories")
async def get_categories():
    """프론트 초기 로드/리프레시에 저장된 categories.json을 반환"""
    try:
        if not CATEGORIES_PATH.exists():
            return {}
        with CATEGORIES_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
            if not isinstance(data, dict):
                raise ValueError("categories.json must be an object")
            for k, v in data.items():
                if not isinstance(v, str):
                    raise ValueError(f"invalid id for key '{k}'")
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read categories: {e}")


@app.post("/save_categories")
async def save_categories(request: Request):
    try:
        data = await request.json()
        with CATEGORIES_PATH.open("w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        return {"status": "success", "path": str(CATEGORIES_PATH), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save categories: {e}")


@app.delete("/delete_categories")
async def delete_categories():
    try:
        if CATEGORIES_PATH.exists():
            CATEGORIES_PATH.unlink()
            return {"status": "success", "message": "categories.json deleted"}
        return {"status": "success", "message": "categories.json not found (noop)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to delete: {e}")


# ---------------------------
# ✅ .env 읽기/저장 (프론트 연동)
# ---------------------------
@app.get("/env")
async def get_env():
    """현재 .env를 JSON으로 반환 (빈 값은 빈 문자열)"""
    env = _read_env_as_dict(ENV_PATH)
    out = {}
    for k in ENV_KEYS:
        out[k] = _strip_quotes(env.get(k, ""))
    return out


@app.post("/save_env")
async def save_env(request: Request):
    """
    일부만 보내도 됨. 보낸 키만 업데이트.
    """
    data = await request.json()
    env_dict = _read_env_as_dict(ENV_PATH)

    cur_sp = env_dict.get("EMART_START_PAGE", "1")

    # --- EMART_START_PAGE ---
    if "EMART_START_PAGE" in data:
        sp_raw = str(data.get("EMART_START_PAGE", "")).strip()
        try:
            sp = int(sp_raw)
            if sp < 1:
                raise ValueError
        except Exception:
            raise HTTPException(
                400, detail="EMART_START_PAGE는 1 이상의 정수여야 합니다."
            )
        env_dict["EMART_START_PAGE"] = str(sp)
        cur_sp = str(sp)
    else:
        try:
            sp = int(cur_sp)
        except Exception:
            sp = 1

    # --- EMART_END_PAGE ---
    if "EMART_END_PAGE" in data:
        ep_raw = str(data.get("EMART_END_PAGE", "")).strip()
        if ep_raw == "":
            env_dict["EMART_END_PAGE"] = ""
        else:
            try:
                ep = int(ep_raw)
                if ep < sp:
                    raise ValueError
            except Exception:
                raise HTTPException(
                    400,
                    detail="EMART_END_PAGE는 빈 문자열(끝까지) 또는 시작 페이지 이상 정수여야 합니다.",
                )
            env_dict["EMART_END_PAGE"] = str(ep)

    # --- EMB_SERVER (옵션) ---
    if "EMB_SERVER" in data:
        server_url = str(data.get("EMB_SERVER", "")).strip()
        if server_url and not _is_http_url(server_url):
            raise HTTPException(400, detail="EMB_SERVER는 http/https URL이어야 합니다.")
        env_dict["EMB_SERVER"] = f'"{server_url}"' if server_url else ""

    # --- 기타 키(있으면 문자열로 반영) ---
    for k in [
        "EMART_PAGE_CAP",
        "EMART_PAGE_DELAY_SEC",
        "EMART_EMPTY_PAGE_STOP",
        "EMART_PARTIAL_SAVE_EVERY",
        "EMB_ENDPOINT",
        "EMB_METHOD",
        "EMB_VERIFY_SSL",
        "ALL_HOUR",
        "ALL_MINUTE",
        "PRICE_HOUR",
        "PRICE_MINUTE",
        "OLD_HOUR",
        "OLD_MINUTE",
    ]:
        if k in data:
            env_dict[k] = str(data[k]).strip()

    with ENV_PATH.open("w", encoding="utf-8") as f:
        for k, v in env_dict.items():
            if v == "":
                f.write(f"{k}=\n")
            else:
                f.write(f"{k}={v}\n")

    return {"status": "success"}


# ---- 수동 실행(취소 이벤트 전달) ----
@app.post("/run_json")
async def run_all_products():
    try:
        CANCEL_EVENT.clear()
        run_all_scraper(CANCEL_EVENT)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/run_price_json")
async def run_id_price():
    try:
        CANCEL_EVENT.clear()
        run_price_scraper(CANCEL_EVENT)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/run_non_price_json")
async def run_other_info():
    try:
        CANCEL_EVENT.clear()
        run_non_price_scraper(CANCEL_EVENT)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/run_image")
async def run_image():
    try:
        run_emart_image()
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ---- 업로드(취소 이벤트 전달) ----
@app.post("/run_firebase_all")
async def run_firebase_all():
    try:
        CANCEL_EVENT.clear()
        return upload_all_products_to_firebase(CANCEL_EVENT)
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/run_firebase_price")
async def run_firebase_price():
    try:
        CANCEL_EVENT.clear()
        return upload_id_price_to_firebase(CANCEL_EVENT)
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/run_firebase_other")
async def run_firebase_other():
    try:
        CANCEL_EVENT.clear()
        return upload_other_info_to_firebase(CANCEL_EVENT)
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ---- 스케줄러 on/off/status ----
@app.post("/scheduler/on")
async def resume_scheduler(request: Request):
    try:
        sched = request.app.state.scheduler
        sched.resume()
        return {
            "status": "success",
            "message": "스케줄러가 다시 시작되었습니다.",
            "running": True,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/scheduler/off")
async def pause_scheduler(request: Request):
    try:
        sched = request.app.state.scheduler
        sched.pause()
        return {
            "status": "success",
            "message": "스케줄러가 일시정지되었습니다.",
            "running": False,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/scheduler/status")
async def scheduler_status(request: Request):
    try:
        sched = request.app.state.scheduler
        state = getattr(sched, "state", None)
        return {
            "status": "success",
            "running": state == STATE_RUNNING,
            "paused": state == STATE_PAUSED,
            "stopped": state == STATE_STOPPED,
            "state": state,
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ---- 작업 취소/재개 ----
@app.post("/tasks/stop")
async def tasks_stop():
    try:
        CANCEL_EVENT.set()
        return {"status": "success", "message": "작업 중단 신호 전파됨"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.post("/tasks/start")
async def tasks_start():
    try:
        CANCEL_EVENT.clear()
        return {"status": "success", "message": "작업 중단 신호 해제됨"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/tasks/status")
async def tasks_status():
    try:
        return {"status": "success", "cancelled": CANCEL_EVENT.is_set()}
    except Exception as e:
        return {"status": "error", "error": str(e)}


# ---------------------------
# Cron 읽기/표시 유틸
# ---------------------------
def _cron_of(job):
    if job is None:
        return {}
    t = getattr(job, "trigger", None)
    if not isinstance(t, CronTrigger):
        return {}
    return {
        "type": "cron",
        "second": str(t.fields[0]),
        "minute": str(t.fields[1]),
        "hour": str(t.fields[2]),
    }


def _current_cron(job):
    """현재 잡의 Cron 값을 문자열로 추출 (reschedule 시 기본값 초기화 방지용)."""
    if job is None:
        return {"second": "0", "minute": "*", "hour": "*"}
    t = getattr(job, "trigger", None)
    if isinstance(t, CronTrigger):
        return {
            "second": str(t.fields[0]),
            "minute": str(t.fields[1]),
            "hour": str(t.fields[2]),
        }
    return {"second": "0", "minute": "*", "hour": "*"}


@app.get("/scheduler/config")
async def get_scheduler_config(request: Request):
    sched = request.app.state.scheduler
    all_job = sched.get_job("job_all")
    price_job = sched.get_job("job_price")
    old_job = sched.get_job("job_old")
    return {
        "status": "success",
        "timezone": "Asia/Seoul",
        "all": {
            **_cron_of(all_job),
            "next_run_time": (
                all_job.next_run_time.isoformat()
                if all_job and all_job.next_run_time
                else None
            ),
        },
        "price": {
            **_cron_of(price_job),
            "next_run_time": (
                price_job.next_run_time.isoformat()
                if price_job and price_job.next_run_time
                else None
            ),
        },
        "old": {
            **_cron_of(old_job),
            "next_run_time": (
                old_job.next_run_time.isoformat()
                if old_job and old_job.next_run_time
                else None
            ),
        },
    }


def _validate_cron_field(v, name: str, rng=None):
    if v is None:
        return None
    if isinstance(v, int):
        if rng and not (rng[0] <= v <= rng[1]):
            raise HTTPException(400, detail=f"{name} 범위 오류")
        return v
    s = str(v).strip()
    if not s:
        return None
    return s  # '*/10', '0,30', '*' 등 허용


@app.post("/scheduler/config")
async def set_scheduler_config(request: Request):
    body = await request.json()
    sched = request.app.state.scheduler
    persist = bool(body.get("persist", True))

    updates: list[tuple[str, dict]] = []

    # --- all ---
    if "all" in body:
        a = body["all"] or {}
        upd = {}
        if "hour" in a:
            h = _validate_cron_field(a.get("hour"), "hour", (0, 23))
            if h is not None:
                upd["hour"] = h
        if "minute" in a:
            m = _validate_cron_field(a.get("minute"), "minute", (0, 59))
            if m is not None:
                upd["minute"] = m
        if upd:
            updates.append(("job_all", upd))

    # --- price ---
    if "price" in body:
        p = body["price"] or {}
        upd = {}
        if "hour" in p:
            h = _validate_cron_field(p.get("hour"), "hour", (0, 23))
            if h is not None:
                upd["hour"] = h
        if "minute" in p:
            m = _validate_cron_field(p.get("minute"), "minute", (0, 59))
            if m is not None:
                upd["minute"] = m
        if upd:
            updates.append(("job_price", upd))

    # --- old ---
    if "old" in body:
        p = body["old"] or {}
        upd = {}
        if "hour" in p:
            h = _validate_cron_field(p.get("hour"), "hour", (0, 23))
            if h is not None:
                upd["hour"] = h
        if "minute" in p:
            m = _validate_cron_field(p.get("minute"), "minute", (0, 59))
            if m is not None:
                upd["minute"] = m
        if upd:
            updates.append(("job_old", upd))

    # 실제로 변경된 잡만 반영 & persist 대상으로 기록
    effective: dict[str, dict] = {}
    for job_id, fields in updates:
        job = sched.get_job(job_id)
        base = _current_cron(job)  # 기존 cron 확보
        base.update({k: str(v) for k, v in fields.items()})  # 변경분 덮어쓰기
        base["second"] = "0"

        target_func = None
        if job_id == "job_all":
            target_func = scheduler_all
        elif job_id == "job_price":
            target_func = scheduler_price
        elif job_id == "job_old":
            target_func = scheduler_old  # 'old' 작업을 위한 함수

        if job:
            sched.reschedule_job(
                job_id,
                trigger="cron",
                timezone=KST,
                hour=base["hour"],
                minute=base["minute"],
                second=base["second"],
            )
        else:
            sched.add_job(
                target_func,
                "cron",
                id=job_id,
                timezone=KST,
                hour=base["hour"],
                minute=base["minute"],
                second=base["second"],
                replace_existing=True,
                coalesce=True,
                max_instances=1,
                misfire_grace_time=120,
            )

        effective[job_id] = base  # persist용

    # 변경된 잡만 .env 반영 ( '*' 는 빈문자열로 저장 )
    if persist and effective:
        env_dict = _read_env_as_dict(ENV_PATH)

        def _to_env(v: str) -> str:
            return "" if str(v).strip() == "*" else str(v)

        for job_id, merged in effective.items():
            # 'job_old'를 처리하기 위해 이 부분을 수정합니다.
            if job_id == "job_all":
                prefix = "ALL"
            elif job_id == "job_price":
                prefix = "PRICE"
            elif job_id == "job_old":
                prefix = "OLD"
            else:
                # 예상치 못한 job_id는 건너뛰기
                continue
            env_dict[f"{prefix}_HOUR"] = _to_env(merged["hour"])
            env_dict[f"{prefix}_MINUTE"] = _to_env(merged["minute"])

        with ENV_PATH.open("w", encoding="utf-8") as f:
            for k, v in env_dict.items():
                f.write(f"{k}={v}\n")

    return await get_scheduler_config(request)


@app.post("/scheduler/run-now")
async def scheduler_run_now(
    request: Request, which: str = Query("all", pattern="^(all|price|old)$")
):
    sched = request.app.state.scheduler
    if which == "all":
        job_id = "job_all"
    elif which == "price":
        job_id = "job_price"
    else: # which == "old"
        job_id = "job_old"
    job = sched.get_job(job_id)
    if not job:
        raise HTTPException(404, "job not found")
    # 즉시 트리거
    job.modify(next_run_time=datetime.now(KST))
    sched.wakeup()
    return {"status": "success"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8420, reload=True)
