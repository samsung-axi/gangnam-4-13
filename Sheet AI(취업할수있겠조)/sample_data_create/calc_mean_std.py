import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from IPython.display import display
import matplotlib.font_manager as fm
#%%
# 한글 폰트 설정
plt.rcParams['font.family'] = 'Malgun Gothic'  # 윈도우의 경우
plt.rcParams['axes.unicode_minus'] = False  # 마이너스 기호 깨짐 방지

# Excel 파일 읽기
file_path = '1조_목업데이터 작업_대기업의 사본.xlsx'
df = pd.read_excel(file_path)

# 데이터 확인
print("데이터 샘플:")
display(df.head())

# 데이터 정보 확인
print("\n데이터 정보:")
print(f"행 수: {df.shape[0]}, 열 수: {df.shape[1]}")
print("\n컬럼 목록:")
print(df.columns.tolist())

#%%
# 등급별 점수 매핑
grade_scores = {
    'AAA': 100,
    'AA+': 98,
    'AA': 96,
    'AA-': 94,
    'A+': 92,
    'A': 90,
    'A-': 88,
    'BBB+': 86,
    'BBB': 84,
    'BBB-': 82,
    'BB+': 80,
    'BB': 78,
    'BB-': 76,
    'B+': 74,
    'B': 72,
    'B-': 70,
    'CCC+': 68,
    'CCC': 66,
    'CCC-': 64,
    'CC': 62,
    'C': 60,
    'D': 0
}

# 등급점수 컬럼 추가
df['등급점수'] = df['등급'].map(grade_scores)

# 숫자형 컬럼만 선택 (등급점수 제외)
numeric_cols = df.select_dtypes(include=[np.number]).columns
numeric_cols = [col for col in numeric_cols if col not in ['등급', '등급점수']]

# 등급별 통계 계산
grouped_stats = df.groupby('등급')[numeric_cols].agg(['mean', 'std'])

# 등급점수로 정렬된 인덱스 생성
sorted_grades = sorted(df['등급'].unique(), key=lambda x: grade_scores.get(x, 0), reverse=True)
sorted_grouped_stats = grouped_stats.reindex(sorted_grades)

# 결과 출력
print("\n등급별 평균 및 표준편차:")
display(sorted_grouped_stats)

# Excel 파일로 저장
sorted_grouped_stats.to_excel('등급별 평균 및 표준편차.xlsx')

# 각 등급별 데이터 수 확인
grade_counts = df['등급'].value_counts()
sorted_grade_counts = pd.Series(
    [grade_counts.get(grade, 0) for grade in sorted_grades],
    index=sorted_grades,
    name='데이터 개수'
)

print("\n등급별 데이터 수:")
display(sorted_grade_counts)

#%%
# 시각화 - 등급별 주요 변수 평균값 비교
plt.figure(figsize=(15, 8))

# 처음 5개 컬럼만 시각화 (너무 많으면 복잡해짐)
for i, col in enumerate(numeric_cols[:5]):
    plt.subplot(2, 3, i + 1)
    sns.barplot(x='등급', y=col, data=df)
    plt.title(f'등급별 {col} 평균')
    plt.xticks(rotation=45)

plt.tight_layout()
plt.show()

