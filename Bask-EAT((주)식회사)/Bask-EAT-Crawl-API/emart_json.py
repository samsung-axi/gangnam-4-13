# scrape_all_products.py
from dotenv import load_dotenv
import urllib.parse
from bs4 import BeautifulSoup
import json
import os
import re
import time
from datetime import datetime
from typing import Optional, Dict, List, Any
from threading import Event

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


# -------------------------------
# 설정 / 상수
# -------------------------------
DEFAULT_CATEGORIES: Dict[str, str] = {
    "Fruits": "6000213114",
    "Vegetables": "6000213167",
    "Rice_Grains_Nuts": "6000215152",
    "Meat_Eggs": "6000215194",
    "Seafood_DriedSeafood": "6000213469",
    "Milk_Dairy": "6000213534",
    "MealKits_ConvenienceFood": "6000213247",
    "Kimchi_SideDishes_Deli": "6000213299",
    "Water_Beverages_Alcohol": "6000213424",
    "Coffee_Beans_Tea": "6000215245",
    "Noodles_CannedGoods": "6000213319",
    "Seasoning_Oil": "6000215286",
    "Snacks_Treats": "6000213362",
    "Bakery_Jam": "6000213412",
}

HEADERS_BASE = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
}


# -------------------------------
# 유틸
# -------------------------------
def load_categories_from_file(filepath: str = "categories.json") -> Dict[str, str]:
    """categories.json 있으면 로드, 없으면 기본 카테고리 반환."""
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, dict):
                fixed = {str(k): str(v) for k, v in data.items()}
                print(f"[info] Loaded categories from '{filepath}': {len(fixed)} keys")
                return fixed
            else:
                print(
                    f"[warn] '{filepath}' is not an object. Using default categories."
                )
        except Exception as e:
            print(f"[warn] read '{filepath}' failed ({e}). Using default.")
    else:
        print(f"[warn] '{filepath}' not found. Using default categories.")
    return DEFAULT_CATEGORIES.copy()


def _should_stop(ev: Optional[Event]) -> bool:
    return bool(ev and ev.is_set())


def _sleep_with_cancel(total_sec: float, ev: Optional[Event], tick: float = 0.1):
    """긴 sleep을 잘게 쪼개 cancel 체크."""
    if total_sec <= 0:
        return
    remain = total_sec
    step = max(0.01, min(tick, total_sec))
    while remain > 0:
        if _should_stop(ev):
            break
        t = min(step, remain)
        time.sleep(t)
        remain -= t


def _build_session() -> requests.Session:
    """지수 백오프/재시도 설정된 requests.Session."""
    session = requests.Session()
    retry = Retry(
        total=5,
        read=5,
        connect=5,
        status=5,
        backoff_factor=0.6,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("GET", "HEAD"),
        raise_on_status=False,
        respect_retry_after_header=True,
    )
    adapter = HTTPAdapter(max_retries=retry, pool_connections=20, pool_maxsize=50)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update(HEADERS_BASE)
    return session


def _parse_price(text: str) -> str:
    """'12,340원' -> '12340'"""
    if not text:
        return ""
    return re.sub(r"[^\d]", "", text)


def _extract_item_id_from_url(url: str) -> str:
    """상품 상세 URL의 itemId 파싱."""
    try:
        parsed = urllib.parse.urlparse(url)
        q = urllib.parse.parse_qs(parsed.query)
        item_id_list = q.get("itemId")
        if item_id_list:
            return item_id_list[0]
    except Exception:
        pass
    return ""


def _absolutize_url(raw: str) -> str:
    if not raw:
        return ""
    if raw.startswith("//"):
        return "https:" + raw
    if raw.startswith("http"):
        return raw
    return "https://emart.ssg.com" + raw


def scrape_emart_category_page(
    html_content: str, category_name: str
) -> List[Dict[str, Any]]:
    """카테고리 HTML에서 상품 정보 추출."""
    soup = BeautifulSoup(html_content, "html.parser")
    out: List[Dict[str, Any]] = []

    ul = soup.select_one("#ty_thmb_view > ul")
    product_items = ul.find_all("li") if ul else []

    for item in product_items:
        last_updated = datetime.now().isoformat()

        brand = item.select_one("div.mnemitem_tit > span.mnemitem_goods_brand")
        title = item.select_one("div.mnemitem_tit > span.mnemitem_goods_tit")
        parts: List[str] = []
        if brand:
            b = brand.get_text(strip=True)
            if b:
                parts.append(f"[{b}]")
        if title:
            t = title.get_text(strip=True)
            if t:
                parts.append(t)
        product_name = " ".join(parts).strip()

        product_address = ""
        link_tag = item.select_one("div > a")
        if link_tag and link_tag.has_attr("href"):
            product_address = _absolutize_url(link_tag["href"])
        if not product_address:
            link_tag_alt = item.select_one("div.mnemitem_thmb_v2 > a")
            if link_tag_alt and link_tag_alt.has_attr("href"):
                product_address = _absolutize_url(link_tag_alt["href"])

        pid = _extract_item_id_from_url(product_address)

        selling_price = ""
        sp1 = item.select_one("div.mnemitem_pricewrap_v2 div.new_price em")
        sp2 = item.select_one("div.mnemitem_pricewrap_v2 > div:nth-child(2) > div > em")
        if sp1:
            selling_price = _parse_price(sp1.get_text(" ", strip=True))
        elif sp2:
            selling_price = _parse_price(sp2.get_text(" ", strip=True))

        original_price = ""
        op1 = item.select_one("div.mnemitem_pricewrap_v2 div.ty_oldpr del em")
        op2 = item.select_one("div.mnemitem_pricewrap_v2 > div:nth-child(1) > div > em")
        if op1:
            original_price = _parse_price(op1.get_text(" ", strip=True))
        elif op2:
            original_price = _parse_price(op2.get_text(" ", strip=True))

        image_url = ""
        img = item.select_one("div.mnemitem_thmb_v2 img")
        if img:
            raw = img.get("data-src") or img.get("data-original") or img.get("src")
            image_url = _absolutize_url(raw or "")

        quantity = ""
        q = item.select_one("div.mnemitem_pricewrap_v2 > div.unit_price")
        if q:
            quantity = q.get_text(" ", strip=True)

        out_of_stock = ""
        sold_out_tag = item.select_one("div.mnemitem_thmb_v2 > div.mnemitem_soldout")
        if sold_out_tag:
            out_of_stock = "Y"

        out.append(
            {
                "id": pid,
                "category": category_name,
                "product_name": product_name,
                "product_address": product_address,
                "original_price": original_price,
                "selling_price": selling_price,
                "image_url": image_url,
                "quantity": quantity,
                "out_of_stock": out_of_stock,
                "last_updated": last_updated,
            }
        )
    return out


def _has_next_page_by_dom(html: str) -> Optional[bool]:
    """
    DOM에서 '다음' 페이지 존재 추정:
      - True/False 확정 시 bool 반환
      - 판단 불가 시 None
    """
    try:
        soup = BeautifulSoup(html, "html.parser")
        nav = soup.select_one(".cm_paginate, .paginate, .com_paginate, .srg_pagination")
        if not nav:
            return None
        for a in nav.find_all("a"):
            txt = (a.get_text() or "").strip()
            if txt in ("다음", ">", "›", "Next"):
                if "disabled" in (a.get("class") or []):
                    return False
                href = a.get("href") or ""
                return bool(href and href != "#")
        return None
    except Exception:
        return None


# -------------------------------
# 메인 러너
# -------------------------------
def run_scraper(stop_event: Optional[Event] = None):
    """
    .env 설정
      EMART_START_PAGE=1
      EMART_END_PAGE=            # 빈 값/0/음수면 '끝까지'
      EMART_PAGE_CAP=500         # 최대 페이지 상한(무한 루프 방지)
      EMART_PAGE_DELAY_SEC=2.0   # 페이지 간 요청 딜레이(초)
      EMART_EMPTY_PAGE_STOP=2    # 연속 빈 페이지 N회면 조기 종료
      EMART_PARTIAL_SAVE_EVERY=0 # n페이지마다 중간 저장(0=비활성)
    """
    load_dotenv(override=True)

    categories = load_categories_from_file()

    # --- 범위/상한 ---
    try:
        start_page = int(os.environ.get("EMART_START_PAGE", "1"))
    except Exception:
        start_page = 1
    if start_page < 1:
        start_page = 1

    end_page_raw = (os.environ.get("EMART_END_PAGE", "") or "").strip()
    end_page: Optional[int]
    try:
        if end_page_raw == "":
            end_page = None
        else:
            v = int(end_page_raw)
            end_page = None if v <= 0 else v
    except Exception:
        end_page = None  # 파싱 실패 시 끝까지

    try:
        page_cap = max(1, int(os.environ.get("EMART_PAGE_CAP", "500")))
    except Exception:
        page_cap = 500

    try:
        page_delay = float(os.environ.get("EMART_PAGE_DELAY_SEC", "2.0"))
    except Exception:
        page_delay = 2.0

    try:
        empty_page_stop = int(os.environ.get("EMART_EMPTY_PAGE_STOP", "2"))
    except Exception:
        empty_page_stop = 2

    try:
        partial_save_every = int(os.environ.get("EMART_PARTIAL_SAVE_EVERY", "0"))
    except Exception:
        partial_save_every = 0

    print(
        f"[env] START={start_page}, END={end_page if end_page is not None else '∞'}, "
        f"CAP={page_cap}, DELAY={page_delay}s, EMPTY_STOP={empty_page_stop}, PARTIAL_EVERY={partial_save_every}"
    )

    session = _build_session()
    os.makedirs("result_json", exist_ok=True)

    for category_name, disp_ctg_id in categories.items():
        if _should_stop(stop_event):
            print("[cancel] 중단 요청 감지: 카테고리 루프 시작 전 종료")
            return

        print(f"\n===== 카테고리 시작: {category_name}({disp_ctg_id}) =====")
        collected: List[Dict[str, Any]] = []
        seen_ids: set[str] = set()
        consecutive_empty = 0

        try:
            page_num = start_page
            visited_pages = 0

            while True:
                if _should_stop(stop_event):
                    print("[cancel] 중단 요청 감지: 페이지 루프 종료")
                    break

                # 종료 조건 1) end_page 지정
                if end_page is not None and page_num > end_page:
                    print(f"[info] end_page={end_page} 도달 → 종료")
                    break

                # 종료 조건 2) 안전 상한
                if visited_pages >= page_cap:
                    print(f"[warn] page_cap={page_cap} 도달 → 무한 루프 방지 종료")
                    break

                page_url = f"https://emart.ssg.com/disp/category.ssg?dispCtgId={disp_ctg_id}&page={page_num}"
                print(f"--- {category_name} p{page_num}: GET {page_url}")

                if _should_stop(stop_event):
                    print("[cancel] 요청 전 종료")
                    break

                resp = session.get(page_url, timeout=15)
                if resp.status_code in (403, 429):
                    print(f"[warn] status={resp.status_code} for {page_url}")
                resp.raise_for_status()
                html = resp.text

                if _should_stop(stop_event):
                    print("[cancel] 파싱 전 종료")
                    break

                items = scrape_emart_category_page(html, category_name)

                # dedupe by id
                new_items = []
                for it in items:
                    pid = it.get("id", "")
                    key = f"{pid}:{it.get('product_address','')}"
                    if pid and pid in seen_ids:
                        continue
                    if pid:
                        seen_ids.add(pid)
                    new_items.append(it)

                collected.extend(new_items)
                print(
                    f"--- {category_name} p{page_num}: +{len(new_items)}개, 누적 {len(collected)}개"
                )

                # 종료 로직 A) 연속 빈 페이지 감지
                if len(new_items) == 0:
                    consecutive_empty += 1
                    if empty_page_stop > 0 and consecutive_empty >= empty_page_stop:
                        print(
                            f"[info] {category_name}: 연속 {consecutive_empty}페이지 0건 → 조기 종료"
                        )
                        break
                else:
                    consecutive_empty = 0

                # 종료 로직 B) DOM에서 다음 페이지 없음으로 확정되면 종료
                has_next = _has_next_page_by_dom(html)
                if has_next is False:
                    print(f"[info] {category_name}: DOM상 다음 페이지 없음 → 종료")
                    break
                # True면 계속, None이면 빈 페이지 감지에 맡김

                # 중간 저장(선택)
                visited_pages += 1
                if partial_save_every > 0 and visited_pages % partial_save_every == 0:
                    out_path = f"result_json/{category_name}.json"
                    with open(out_path, "w", encoding="utf-8") as f:
                        json.dump(collected, f, ensure_ascii=False, indent=4)
                    print(f"[save] 중간 저장: {out_path} ({len(collected)}건)")

                page_num += 1
                _sleep_with_cancel(page_delay, stop_event)

            # 최종 저장(부분이라도)
            out_path = f"result_json/{category_name}.json"
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(collected, f, ensure_ascii=False, indent=4)

            if _should_stop(stop_event):
                print(f"[cancel] '{category_name}' 부분 저장 후 중단 → {out_path}")
                return

            print(
                f"[done] {category_name} 저장 완료 → {out_path} (총 {len(collected)}건)"
            )

        except requests.exceptions.RequestException as e:
            print(f"[error] '{category_name}' 연결/HTTP 오류: {e}")
        except Exception as e:
            print(f"[error] '{category_name}' 스크래핑 오류: {e}")

    print("\n===== 모든 카테고리 스크래핑 완료 =====")


if __name__ == "__main__":
    run_scraper()
