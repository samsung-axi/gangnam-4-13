# scrape_other_info.py

from dotenv import load_dotenv
import urllib.parse
from bs4 import BeautifulSoup
import json
import requests
import os
from datetime import datetime
import time
from typing import Optional
from threading import Event


def load_categories_from_file(filepath="categories.json"):
    """
    지정된 JSON 파일에서 스크래핑할 카테고리 목록을 로드합니다.
    파일이 없거나 오류가 발생하면 기본 카테고리 목록을 반환합니다.
    """
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                categories = json.load(f)
            print(f"'{filepath}' 파일에서 카테고리 목록을 성공적으로 로드했습니다.")
            return categories
        except json.JSONDecodeError as e:
            print(
                f"경고: '{filepath}' 파일 파싱 오류: {e}. 기본 카테고리 목록을 사용합니다."
            )
        except Exception as e:
            print(
                f"경고: '{filepath}' 파일 로드 중 예상치 못한 오류: {e}. 기본 카테고리 목록을 사용합니다."
            )
    else:
        print(
            f"경고: '{filepath}' 파일을 찾을 수 없습니다. 기본 카테고리 목록을 사용합니다."
        )

    return {
        "과일": "6000213114",
    }


def scrape_emart_category_page(html_content, category_name):
    """
    제공된 이마트몰 카테고리 HTML 콘텐츠에서 상품 정보를 스크랩합니다.
    (ID/가격을 제외한 나머지 정보만 추출)
    """
    soup = BeautifulSoup(html_content, "html.parser")
    products_data = []

    product_list_ul = soup.select_one("#ty_thmb_view > ul")
    product_items = []
    if product_list_ul:
        product_items = product_list_ul.find_all("li")

    for item in product_items:
        id = ""
        product_name = ""
        product_address = ""
        image_url = ""
        last_updated = datetime.now().isoformat()

        brand_span = item.select_one("div.mnemitem_tit > span.mnemitem_goods_brand")
        title_span = item.select_one("div.mnemitem_tit > span.mnemitem_goods_tit")
        product_name_parts = []
        if brand_span:
            product_name_parts.append(f"[{brand_span.get_text(strip=True)}]")
        if title_span:
            product_name_parts.append(title_span.get_text(strip=True))
        product_name = " ".join(product_name_parts).strip()

        link_tag = item.select_one("div > a")
        if link_tag and "href" in link_tag.attrs:
            raw_url = link_tag["href"]
            if raw_url.startswith("//"):
                product_address = "https:" + raw_url
            elif raw_url.startswith("http"):
                product_address = raw_url
            else:
                product_address = "https://emart.ssg.com" + raw_url
        else:
            link_tag_alt = item.select_one("div.mnemitem_thmb_v2 > a")
            if link_tag_alt and "href" in link_tag_alt.attrs:
                raw_url_alt = link_tag_alt["href"]
                if raw_url_alt.startswith("//"):
                    product_address = "https:" + raw_url_alt
                elif raw_url_alt.startswith("http"):
                    product_address = raw_url_alt
                else:
                    product_address = "https://emart.ssg.com" + raw_url_alt

        if product_address:
            parsed_url = urllib.parse.urlparse(product_address)
            parsed_query = urllib.parse.parse_qs(parsed_url.query)
            item_id_list = parsed_query.get("itemId")
            if item_id_list:
                id = item_id_list[0]

        img_tag = item.select_one("div.mnemitem_thmb_v2 > a > div > img")
        if img_tag:
            raw_image_url = ""
            if "data-src" in img_tag.attrs:
                raw_image_url = img_tag["data-src"]
            elif "src" in img_tag.attrs:
                raw_image_url = img_tag["src"]
            if raw_image_url:
                if raw_image_url.startswith("//"):
                    image_url = "https:" + raw_image_url
                elif raw_image_url.startswith("http"):
                    image_url = raw_image_url
                else:
                    image_url = "https://emart.ssg.com" + raw_image_url

        products_data.append(
            {
                "id": id,
                "category": category_name,
                "product_name": product_name,
                "product_address": product_address,
                "image_url": image_url,
                "last_updated": last_updated,
            }
        )

    return products_data


# ========= 협조적 취소 유틸 =========
def _should_stop(ev: Optional[Event]) -> bool:
    return bool(ev and ev.is_set())


def _sleep_with_cancel(total_sec: float, ev: Optional[Event], tick: float = 0.1):
    """
    긴 sleep을 잘게 쪼개 cancel 체크.
    """
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


def run_scraper(stop_event: Optional[Event] = None):
    """
    가격 외의 정보만 스크래핑하여 result_non_price_json/<카테고리>.json 저장.
    stop_event가 set되면 가능한 빠르게 중단(협조적 취소)하며,
    중단 시점까지의 데이터는 부분 저장.
    """
    load_dotenv(override=True)
    categories_to_scrape = load_categories_from_file()
    start_page = int(os.environ.get("EMART_START_PAGE", 1))
    end_page = int(os.environ.get("EMART_END_PAGE", 5))

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/91.0.4472.124 Safari/537.36"
        )
    }

    for category_name, disp_ctg_id in categories_to_scrape.items():
        if _should_stop(stop_event):
            print("중단 요청 감지: 카테고리 루프 시작 전 종료")
            return

        print(f"\n===== '{category_name}' 카테고리 스크래핑 시작 =====")
        all_scraped_products_for_category = []

        try:
            for page_num in range(start_page, end_page + 1):
                if _should_stop(stop_event):
                    print("중단 요청 감지: 페이지 루프 종료")
                    break

                page_url = f"https://emart.ssg.com/disp/category.ssg?dispCtgId={disp_ctg_id}&page={page_num}"
                print(
                    f"--- {category_name} - {page_num} 페이지 스크래핑 시작: {page_url} ---"
                )

                # 요청 전 체크
                if _should_stop(stop_event):
                    print("중단 요청 감지: 요청 전 종료")
                    break

                response = requests.get(page_url, headers=headers, timeout=15)
                response.raise_for_status()
                html_content = response.text

                # 파싱 전 체크
                if _should_stop(stop_event):
                    print("중단 요청 감지: 파싱 전 종료")
                    break

                scraped_products_on_page = scrape_emart_category_page(
                    html_content, category_name
                )

                # 필요한 필드만 취득
                other_info_data = []
                for product in scraped_products_on_page:
                    other_info_data.append(
                        {
                            "id": product.get("id"),
                            "category": product.get("category"),
                            "product_name": product.get("product_name"),
                            "product_address": product.get("product_address"),
                            "image_url": product.get("image_url"),
                            "last_updated": product.get("last_updated"),
                        }
                    )
                all_scraped_products_for_category.extend(other_info_data)

                print(
                    f"--- {category_name} - {page_num} 페이지 스크래핑 완료. {len(other_info_data)}개의 상품 추출. ---"
                )

                # 페이지 간 딜레이 (취소 가능)
                _sleep_with_cancel(2.0, stop_event)

            # 부분이라도 저장
            output_dir = "result_non_price_json"
            output_file = os.path.join(output_dir, f"{category_name}.json")
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(
                    all_scraped_products_for_category, f, ensure_ascii=False, indent=4
                )

            if _should_stop(stop_event):
                print(
                    f"⚠ '{category_name}' 카테고리: 중단 요청으로 부분 저장 완료 → {output_file}"
                )
                return

            print(
                f"\n'{category_name}' 카테고리 스크래핑 완료. 데이터 저장 → '{output_file}'"
            )
            print(
                f"총 {len(all_scraped_products_for_category)}개의 '{category_name}' 상품이 스크랩되었습니다."
            )

        except requests.exceptions.RequestException as e:
            print(f"'{category_name}' 카테고리 웹사이트 연결 오류: {e}")
        except Exception as e:
            print(f"'{category_name}' 카테고리 스크래핑 중 예상치 못한 오류: {e}")

    print("\n===== 모든 카테고리 스크래핑 프로세스 완료 =====")


if __name__ == "__main__":
    run_scraper()
