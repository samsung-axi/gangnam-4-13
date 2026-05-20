import pandas as pd

# 컬럼 매핑 딕셔너리 정의
column_mapping = {
    '신용등급': 'credit_rating',
    '매출액': 'revenue',
    '영업이익': 'operating_profit',
    '당기순이익': 'net_income',
    '총자산': 'total_assets',
    '총부채': 'total_liabilities',
    '자본총계': 'total_equity',
    '자본금': 'capital',
    '영업활동현금흐름': 'operating_cash_flow',
    '이자발생부채': 'interest_bearing_debt',
    '부채비율': 'debt_ratio',
    'ROA': 'ROA',
    'ROE': 'ROE',
    '매출총자산회전율': 'asset_turnover_ratio',
    '이자총자산비율': 'interest_to_assets_ratio',
    '이자매출비율': 'interest_to_revenue_ratio',
    '현금흐름대비이자': 'cash_flow_to_interest',
    '이자대비현금흐름': 'interest_to_cash_flow',
    '로그총자산': 'log_total_assets',
    '로그총부채': 'log_total_liabilities'
}

def translate_columns(df):
    if df is None:
        print("경고: 입력 데이터프레임이 None입니다.")
        return None
        
    print("변환 전 컬럼:", df.columns.tolist())
    try:
        # 컬럼명 변경
        df = df.rename(columns=column_mapping)
        print("변환 후 컬럼:", df.columns.tolist())
        return df
    except Exception as e:
        print(f"컬럼 변환 중 오류 발생: {str(e)}")
        return df

def translate_columns_file(file_path: str, output_path: str):
    df = pd.read_csv(file_path)
    df = translate_columns(df)
    if df is not None:
        df.to_csv(output_path, index=False)
        print(f"컬럼명이 영어로 변환되어 {output_path}에 저장되었습니다.")
    else:
        print("컬럼 변환 실패")

if __name__ == "__main__":
    file_path = '../generated_data/all_grades_companies_multivariate_derived.csv'
    output_path = '../generated_data/all_grades_companies_multivariate_derived_english.csv'
    translate_columns_file(file_path, output_path)
