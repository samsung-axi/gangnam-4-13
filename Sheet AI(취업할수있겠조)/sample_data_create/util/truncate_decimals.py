import pandas as pd


def truncate_decimals(df, decimal_places=0):
    """
    숫자형 컬럼의 소수점을 처리합니다.
    
    Args:
        df (pd.DataFrame): 처리할 데이터프레임
        decimal_places (int): 남길 소수점 자릿수 (0: 모두 버림, 1: 첫째자리까지)
    
    Returns:
        pd.DataFrame: 처리된 데이터프레임
    """
    numeric_columns = df.select_dtypes(include=['float64']).columns
    
    if decimal_places == 0:
        # 소수점 모두 버리기
        df[numeric_columns] = df[numeric_columns].astype(int)
    else:
        # 지정된 소수점 자릿수까지 반올림
        df[numeric_columns] = df[numeric_columns].round(decimal_places)
    
    return df

def truncate_decimals_file(file_path: str, output_path: str, decimal_places=0):
    """
    CSV 파일의 소수점을 처리합니다.
    
    Args:
        file_path (str): 입력 파일 경로
        output_path (str): 출력 파일 경로
        decimal_places (int): 남길 소수점 자릿수 (0: 모두 버림, 1: 첫째자리까지)
    """
    df = pd.read_csv(file_path)
    df = truncate_decimals(df, decimal_places)
    df.to_csv(output_path, index=False)
    print(f"소수점이 처리된 파일이 {output_path}에 저장되었습니다. (소수점 자릿수: {decimal_places})")

if __name__ == "__main__":
    file_path = '../generated_data/all_grades_companies_multivariate_derived.csv'
    output_path = '../generated_data/all_grades_companies_multivariate_derived_truncated.csv'
    
    # 사용자 입력 받기
    while True:
        try:
            choice = input("소수점 처리 방식을 선택하세요 (0: 모두 버림, 1: 첫째자리까지): ")
            decimal_places = int(choice)
            if decimal_places in [0, 1]:
                break
            else:
                print("0 또는 1만 입력 가능합니다.")
        except ValueError:
            print("숫자를 입력해주세요.")
    
    truncate_decimals_file(file_path, output_path, decimal_places)

