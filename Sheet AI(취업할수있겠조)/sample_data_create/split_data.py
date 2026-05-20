#%%
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# 데이터 읽기
df = pd.read_csv('generated_data/datas/all_grades_companies_data.csv')

# 전체 데이터 크기 확인
print(f"전체 데이터 크기: {len(df)}")

# 먼저 학습+검증 세트와 테스트 세트로 분할 (90:10)
train_val_df, test_df = train_test_split(df, test_size=0.1, random_state=42)

# 학습+검증 세트를 다시 학습 세트와 검증 세트로 분할 (80:20)
train_df, val_df = train_test_split(train_val_df, test_size=(100/45000), random_state=42)

# 각 세트의 크기 출력
print(f"학습 세트 크기: {len(train_df)}")
print(f"검증 세트 크기: {len(val_df)}")
print(f"테스트 세트 크기: {len(test_df)}")

# 각 세트를 CSV 파일로 저장
train_df.to_csv('generated_data/all_grades_companies_train.csv', index=False)
val_df.to_csv('generated_data/all_grades_companies_validation.csv', index=False)
test_df.to_csv('generated_data/all_grades_companies_test.csv', index=False)

print("데이터 분할이 완료되었습니다.") 
# %%
