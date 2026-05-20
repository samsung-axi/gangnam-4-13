#%%
import pandas as pd
import os

# 합칠 CSV 파일들의 경로
csv_files = [
    'generated_data/datas/all_grades_companies (1).csv',
    'generated_data/datas/all_grades_companies (2).csv',
    'generated_data/datas/all_grades_companies.csv',
    'generated_data/datas/all_grades_companies1.csv',
    'generated_data/datas/all_grades_companies_multivariate_1.csv'
]

# 결과를 저장할 리스트
dfs = []

# 각 CSV 파일 읽기
for file in csv_files:
    if os.path.exists(file):
        df = pd.read_csv(file)
        dfs.append(df)
        print(f"{file} 파일 읽기 완료: {len(df)} 행")
    else:
        print(f"경고: {file} 파일을 찾을 수 없습니다.")

# 모든 데이터프레임 합치기
if dfs:
    merged_df = pd.concat(dfs, ignore_index=True)
    print(f"\n총 {len(merged_df)} 행이 병합되었습니다.")
    print("병합 후 컬럼:", merged_df.columns.tolist())
    
    # 결과 저장
    output_file = 'generated_data/datas/all_grades_companies_data.csv'
    
    print("\n1. 파생변수 추가 전")
    from util.add_derived_variables import add_derived_variables
    merged_df = add_derived_variables(merged_df)
    print("파생변수 추가 후 컬럼:", merged_df.columns.tolist())
    
    print("\n2. 소수점 자리수 조정 전")
    from util.truncate_decimals import truncate_decimals
    merged_df = truncate_decimals(merged_df,1)
    print("소수점 자리수 조정 후 컬럼:", merged_df.columns.tolist())
    
    print("\n3. 컬럼명 변환 전")
    from util.translate_columns import translate_columns
    merged_df = translate_columns(merged_df)
    if merged_df is None:
        print("컬럼명 변환 실패")
    else:
        print("컬럼명 변환 후 컬럼:", merged_df.columns.tolist())
        merged_df.to_csv(output_file, index=False)
        print(f"\n병합된 데이터가 {output_file}에 저장되었습니다.")
else:
    print("병합할 데이터가 없습니다.")
# %%
from split_data import split_data
split_data(output_file)
# %%
