from plantuml import PlantUML
import os

# PlantUML 서버 (로컬에 설치했거나 클라우드 사용 가능)
plantuml_server = "http://www.plantuml.com/plantuml/png/"

# PlantUML 코드 작성
uml_code = """
@startuml
actor User
participant "Frontend/Backend" as FB
participant "Middle Server (FastAPI)" as MS
participant "Model Server (OpenAI, Gorani, LangGorani)" as MSV

User -> FB: 번역 요청 전송
FB -> FB: 요청 처리 수행
FB -> MS: 중간계층 서버 전달
MS -> MSV: 번역 요청 (선택된 모델)

alt OpenAI 번역 선택
    MSV -> MSV: OpenAI 번역 수행
    MSV -> MSV: 용어 사전 적용
    MSV -> MS: 번역 완료
else Gorani 번역 선택
    MSV -> MSV: Gorani 모델 입력 수행
    MSV -> MSV: 용어 사전 적용
    MSV -> MS: 번역 완료
else LangGorani 번역 선택
    MSV -> MSV: LangGorani 모델 입력 수행
    MSV -> MSV: 용어 사전 적용
    MSV -> MSV: OpenAI 검증 수행
    alt 검증 성공
        MSV -> MS: 번역 완료
    else 검증 실패
        MSV -> MSV: OpenAI 번역 수행
        MSV -> MS: 번역 완료
    end
end

MS -> FB: 번역 결과 전달
FB -> User: 번역 결과 반환
@enduml
"""

# PlantUML 객체 생성
plantuml = PlantUML(plantuml_server)

# 다이어그램 생성 및 저장
output_path =  "C:\\Users\\201\\Desktop\\Gorani1\\sequence_diagram.png"
plantuml.processes(uml_code)

print(f"시퀀스 다이어그램이 {output_path}로 저장되었습니다!")
