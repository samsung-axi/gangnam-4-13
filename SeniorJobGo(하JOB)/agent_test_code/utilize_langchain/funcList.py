import os
import subprocess

def calculate_sum(a, b):
    """두 숫자의 합을 계산하여 반환합니다."""
    print(a + b)


def greet_user(name):
    """사용자에게 인사말을 출력합니다."""
    print(f"안녕하세요, {name}님!")


def send_email(to, subject, body):
    """이메일을 보내는 기능을 시뮬레이션합니다."""
    print(f"이메일을 {to}에게 전송했습니다. 제목: {subject} 내용: {body}")


def fetch_weather(location, date):
    """특정 위치와 날짜의 날씨 정보를 출력합니다."""
    print(f"{date}의 {location} 날씨는 맑음입니다.")


def convert_currency(amount, from_currency, to_currency):
    """통화를 변환하여 결과를 출력합니다."""
    print(f"{amount} {from_currency}는 {amount} {to_currency}로 변환되었습니다.")


def book_flight(origin, destination, departure_date, return_date):
    """항공편 예약을 시뮬레이션합니다."""
    print(f"{origin}에서 {destination}로 가는 항공편이 {departure_date}에 예약되었습니다. 돌아오는 날짜: {return_date}")

def open_program(program_name):
    """주어진 프로그램 이름에 따라 프로그램을 실행합니다."""
    # 프로그램 이름 매핑
    program_map = {
        "메모장": "notepad.exe",
        "그림판": "mspaint.exe"
    }
    
    # 매핑된 프로그램 이름 가져오기, 없으면 원래 이름 사용
    executable = program_map.get(program_name, program_name)
    
    try:
        subprocess.run([executable], check=True)
        print("프로그램을 실행했습니다.")
    except Exception as e:
        print(f"{program_name}을(를) 열 수 없습니다: {str(e)}")