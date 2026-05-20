def calculate_sum(a, b):
    """두 숫자의 합을 반환합니다."""
    return a + b


def greet_user(name):
    """사용자에게 인사말을 반환합니다."""
    return f"안녕하세요, {name}님!"


def send_email(to, subject, body):
    """이메일을 보내는 기능을 시뮬레이션합니다."""
    return f"이메일을 {to}에게 전송했습니다.\n제목: {subject}\n내용: {body}"


def fetch_weather(location, date):
    """특정 위치와 날짜의 날씨 정보를 반환합니다."""
    return f"{date}의 {location} 날씨는 맑음입니다."


def convert_currency(amount, from_currency, to_currency):
    """통화를 변환하여 반환합니다."""
    # 단순히 예시로 1:1 비율로 변환
    return f"{amount} {from_currency}는 {amount} {to_currency}로 변환되었습니다."


def book_flight(origin, destination, departure_date, return_date):
    """항공편 예약을 시뮬레이션합니다."""
    return f"{origin}에서 {destination}로 가는 항공편이 {departure_date}에 예약되었습니다.\n돌아오는 날짜: {return_date}"
