필요한 패키지 설치:

1. Conda 가상환경 생성 및 활성화
$ conda create -n positalk python=3.12
$ conda activate positalk

2. 패키지 설치
$ pip install -r requirements.txt

3. 서버 실행
$ fastapi dev main.py

* 참고: 가상환경 비활성화
$ conda deactivate