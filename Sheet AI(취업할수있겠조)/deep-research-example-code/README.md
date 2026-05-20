# 심층분석 예제 코드

이 프로젝트는 LangChain과 LangGraph를 활용하여 특정 주제에 대한 자동 연구 보고서를 생성하는 딥러닝 기반 에이전트를 구현합니다.

## 프로젝트 개요

이 에이전트는 사용자가 제공한 주제에 대해 다음과 같은 작업을 자동으로 수행합니다:

1. 주제 분석 및 섹션 계획 수립
2. 각 섹션에 필요한 웹 검색 쿼리 생성
3. 웹 검색을 통한 정보 수집 (Tavily API 활용)
4. 수집된 정보를 바탕으로 각 섹션 작성
5. 최종 보고서 컴파일 및 마크다운 형식으로 저장

## 주요 기능

- **섹션 계획**: 주제에 맞는 보고서 구조를 자동으로 계획
- **지능형 검색**: 각 섹션에 필요한 정보를 수집하기 위한 최적의 검색 쿼리 생성
- **병렬 처리**: 여러 섹션의 연구를 효율적으로 처리
- **마크다운 출력**: 결과물을 마크다운 형식으로 저장하여 쉽게 활용 가능
- **그래프 시각화**: LangGraph를 활용한 에이전트 워크플로우 시각화

## 기술 스택

- **Python**: 주 프로그래밍 언어
- **LangChain**: LLM 기반 애플리케이션 개발 프레임워크
- **LangGraph**: 에이전트 워크플로우 구성 및 시각화
- **Claude 3.5 Haiku**: 텍스트 생성 및 구조화 출력을 위한 LLM
- **Tavily API**: 웹 검색 기능 제공
- **Jupyter Notebook**: 대화형 개발 및 실행 환경

## 설치 방법

1. 저장소 클론
```bash
git clone <repository-url>
cd deep-learning-example-code
```

2. 가상환경 생성 및 활성화
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. 의존성 설치
```bash
pip install -r requirements.txt
```

4. 환경 변수 설정
```bash
# .env.example 파일을 .env로 복사하고 API 키 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 API 키 입력
```

## 사용 방법

### Python 스크립트로 실행

```python
from custom_deep_research import run_research_sync

# 동기적으로 연구 실행 (파일 저장 포함)
run_research_sync("인공지능의 윤리적 문제", save_file=True, show_output=True)
```

### Jupyter Notebook에서 실행

```python
from custom_deep_research import run_research_agent

# 비동기적으로 연구 실행
await run_research_agent("인공지능의 윤리적 문제", display_result=True, save_to_file=True)
```

### 그래프 시각화

```python
from custom_deep_research import show_graph_now

# 에이전트 워크플로우 시각화
show_graph_now()
```

## 프로젝트 구조

- `custom_deep_research.py`: 메인 파이썬 모듈
- `custom_deep_research.ipynb`: 주피터 노트북 예제
- `requirements.txt`: 필요한 패키지 목록
- `.env.example`: 환경 변수 예제 파일
- `reports/`: 생성된 보고서가 저장되는 디렉토리

## API 키 설정

이 프로젝트는 다음 API 키가 필요합니다:

1. **Anthropic API 키**: Claude 3.5 Haiku 모델 사용
2. **Tavily API 키**: 웹 검색 기능 사용

`.env.example` 파일은 프로젝트에 필요한 환경 변수의 템플릿을 제공합니다. 이 파일에는 다음과 같은 API 키와 설정이 포함되어 있습니다:

- **ANTHROPIC_API_KEY**: Claude 모델 사용을 위한 API 키
- **TAVILY_API_KEY**: 웹 검색 기능을 위한 API 키
- **OPENAI_API_KEY**: OpenAI 모델로 전환할 경우 사용하는 API 키
- **PERPLEXITY_API_KEY**: Perplexity AI 모델 사용을 위한 API 키
- **GROQ_API_KEY**: Groq API 사용을 위한 키
- **LINKUP_API_KEY**: LinkUp 검색 엔진 사용을 위한 키
- **LANGCHAIN_TRACING_V2**: LangSmith 로깅 활성화 설정
- **LANGCHAIN_ENDPOINT**: LangSmith API 엔드포인트
- **LANGCHAIN_API_KEY**: LangSmith API 키
- **LANGCHAIN_PROJECT**: LangSmith 프로젝트명

이 파일을 `.env`로 복사한 후 필요한 API 키를 입력하여 사용하세요.

```
cp .env.example .env
# 그 후 .env 파일을 편집하여 필요한 API 키 입력
```
