import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.stats import gaussian_kde
import warnings
import os

warnings.filterwarnings('ignore')

# 한글 폰트 설정
plt.rcParams['font.family'] = ['DejaVu Sans', 'Malgun Gothic']
plt.rcParams['axes.unicode_minus'] = False

class BootstrapPerturbationGenerator:
    def __init__(self, actual_data_path):
        """
        Bootstrap + Perturbation 기반 데이터 생성기 초기화
        
        Parameters:
        - actual_data_path: 실제 기업 데이터가 있는 CSV 파일 경로
        """
        # 실제 데이터 로드
        self.actual_data = pd.read_csv(actual_data_path)
        
        # 재무지표 목록
        self.financial_metrics = [
            '매출액', '영업이익', '당기순이익', '총자산', '총부채', 
            '자본총계', '자본금', '영업활동현금흐름', '이자발생부채'
        ]
        
        # 양수만 가능한 지표들
        self.positive_only_metrics = ['매출액', '총자산', '자본금', '자본총계']
        
        # 각 등급별 데이터 저장
        self.grade_data = {}
        for grade in self.actual_data['등급'].unique():
            self.grade_data[grade] = self.actual_data[self.actual_data['등급'] == grade]
    
    def _apply_financial_constraints(self, data_dict):
        """
        재무지표 간의 회계적 제약조건 적용
        """
        # 제약조건 1: 자본총계 = 총자산 - 총부채
        if all(key in data_dict for key in ['총자산', '총부채', '자본총계']):
            calculated_equity = data_dict['총자산'] - data_dict['총부채']
            data_dict['자본총계'] = (data_dict['자본총계'] + calculated_equity) / 2
        
        # 제약조건 2: 영업이익은 매출액의 -50% ~ 50% 범위
        if '매출액' in data_dict and '영업이익' in data_dict:
            max_operating_income = data_dict['매출액'] * 0.5
            min_operating_income = data_dict['매출액'] * -0.5
            data_dict['영업이익'] = np.clip(data_dict['영업이익'], 
                                       min_operating_income, max_operating_income)
        
        # 제약조건 3: 당기순이익은 영업이익보다 작거나 같아야 함
        if '영업이익' in data_dict and '당기순이익' in data_dict:
            if data_dict['영업이익'] > 0:
                data_dict['당기순이익'] = min(data_dict['당기순이익'], 
                                        data_dict['영업이익'] * 1.5)
        
        # 제약조건 4: 양수만 가능한 지표들 처리
        for metric in self.positive_only_metrics:
            if metric in data_dict:
                data_dict[metric] = max(data_dict[metric], 0.1)
        
        # 제약조건 5: 자본금은 자본총계보다 작아야 함
        if '자본금' in data_dict and '자본총계' in data_dict:
            if data_dict['자본총계'] > 0:
                data_dict['자본금'] = min(data_dict['자본금'], data_dict['자본총계'])
        
        return data_dict
    
    def _validate_financial_ratios(self, data_dict):
        """
        재무비율 검증
        """
        issues = []
        # ROA (자산수익률) 검증: -50% ~ 50%
        if '당기순이익' in data_dict and '총자산' in data_dict and data_dict['총자산'] > 0:
            roa = data_dict['당기순이익'] / data_dict['총자산']
            if abs(roa) > 0.5:
                issues.append(f"ROA가 비현실적: {roa:.2%}")
        
        # 부채비율 검증: 0% ~ 500%
        if '총부채' in data_dict and '자본총계' in data_dict and data_dict['자본총계'] > 0:
            debt_ratio = data_dict['총부채'] / data_dict['자본총계']
            if debt_ratio > 5.0 or debt_ratio < 0:
                issues.append(f"부채비율이 비현실적: {debt_ratio:.2f}")
        
        # 영업이익률 검증: -100% ~ 100%
        if '영업이익' in data_dict and '매출액' in data_dict and data_dict['매출액'] > 0:
            operating_margin = data_dict['영업이익'] / data_dict['매출액']
            if abs(operating_margin) > 1.0:
                issues.append(f"영업이익률이 비현실적: {operating_margin:.2%}")
        
        return len(issues) == 0, issues
    
    def generate_company_data(self, credit_grade, company_name=None, seed=None, 
                            perturbation_scale=0.1, percentile_range=None):
        """
        Bootstrap + Perturbation을 사용하여 기업 데이터 생성
        
        Parameters:
        - credit_grade: 신용등급
        - company_name: 생성할 기업명
        - seed: 랜덤 시드
        - perturbation_scale: 변동 폭 (기본값: 0.1 = 10%)
        - percentile_range: 퍼센타일 범위 (예: (5, 95))
        """
        if seed is not None:
            np.random.seed(seed)
        
        if credit_grade not in self.grade_data:
            raise ValueError(f"신용등급 '{credit_grade}'에 대한 데이터가 없습니다.")
        
        # 해당 등급의 데이터
        grade_data = self.grade_data[credit_grade]
        
        # 랜덤하게 기업 선택 (Bootstrap)
        company_idx = np.random.randint(0, len(grade_data))
        company_data = grade_data.iloc[company_idx].copy()
        
        # Perturbation 적용
        data_dict = {}
        for metric in self.financial_metrics:
            if metric in company_data and pd.notna(company_data[metric]):
                # 원본 값
                original_value = company_data[metric]
                
                # Perturbation 적용
                if metric in self.positive_only_metrics:
                    # 양수 지표는 로그 스케일로 변동
                    log_value = np.log1p(original_value)
                    perturbed_log = log_value * (1 + np.random.normal(0, perturbation_scale))
                    value = np.expm1(perturbed_log)
                else:
                    # 다른 지표는 선형 스케일로 변동
                    value = original_value * (1 + np.random.normal(0, perturbation_scale))
                
                data_dict[metric] = value
        
        # 퍼센타일 범위 적용
        if percentile_range is not None:
            for metric in data_dict:
                if metric in grade_data.columns:
                    values = grade_data[metric].dropna()
                    if len(values) > 0:
                        lower_bound = np.percentile(values, percentile_range[0])
                        upper_bound = np.percentile(values, percentile_range[1])
                        data_dict[metric] = np.clip(data_dict[metric], lower_bound, upper_bound)
        
        # 제약조건 적용
        data_dict = self._apply_financial_constraints(data_dict)
        
        # 재무비율 검증
        is_valid, issues = self._validate_financial_ratios(data_dict)
        if not is_valid:
            print(f"Warning: 재무비율 검증 실패: {issues}")
        
        # 누락된 지표는 NaN으로 설정
        for metric in self.financial_metrics:
            if metric not in data_dict:
                data_dict[metric] = np.nan
        
        # Series로 변환
        company_data = pd.Series(data_dict)
        company_data.name = company_name or f"Generated_Company_{credit_grade}"
        
        return company_data
    
    def generate_multiple_companies(self, credit_grade, num_companies=10, 
                                  name_prefix="Company", include_credit_grade=True,
                                  perturbation_scale=0.1, percentile_range=None):
        """
        동일한 신용등급으로 여러 기업 데이터 생성
        """
        companies = []
        
        for i in range(num_companies):
            try:
                company_name = f"{name_prefix}_{credit_grade}_{i+1:02d}"
                company_data = self.generate_company_data(
                    credit_grade, company_name, seed=i,
                    perturbation_scale=perturbation_scale,
                    percentile_range=percentile_range
                )
                companies.append(company_data)
            except Exception as e:
                print(f"기업 {i+1} 생성 실패: {e}")
                continue
        
        if len(companies) == 0:
            raise Exception(f"{credit_grade} 등급 기업 생성에 완전히 실패했습니다.")
        
        # DataFrame으로 변환
        result_df = pd.DataFrame(companies)
        
        # 신용등급 컬럼 추가
        if include_credit_grade:
            result_df['신용등급'] = credit_grade
            cols = ['신용등급'] + [col for col in result_df.columns if col != '신용등급']
            result_df = result_df[cols]
        
        return result_df
    
    def generate_companies_all_grades(self, num_per_grade=10, name_prefix="Company",
                                    perturbation_scale=0.1, percentile_range=None):
        """
        모든 신용등급에 대해 기업 데이터 생성
        """
        all_companies = []
        
        for grade in self.actual_data['등급'].unique():
            try:
                print(f"{grade} 등급 기업 생성 중...")
                grade_companies = self.generate_multiple_companies(
                    grade, num_per_grade, name_prefix,
                    include_credit_grade=True,
                    perturbation_scale=perturbation_scale,
                    percentile_range=percentile_range
                )
                all_companies.append(grade_companies)
                print(f"{grade} 등급: {len(grade_companies)}개 기업 생성 완료")
            except Exception as e:
                print(f"{grade} 등급 생성 중 오류: {e}")
        
        if all_companies:
            result_df = pd.concat(all_companies, ignore_index=True)
            return result_df
        else:
            return pd.DataFrame()
    
    def plot_distribution_comparison(self, credit_grade, num_samples=1000, 
                                   save_samples=False, filename=None,
                                   perturbation_scale=0.1, percentile_range=None):
        """
        원본 데이터와 생성된 데이터의 분포 비교 시각화
        """
        # 여러 샘플 생성
        samples = self.generate_multiple_companies(
            credit_grade, num_samples, "Sample",
            perturbation_scale=perturbation_scale,
            percentile_range=percentile_range
        )
        
        # 샘플 데이터 저장 (선택사항)
        if save_samples:
            if filename is None:
                filename = f"distribution_samples_{credit_grade}_{num_samples}"
                if percentile_range:
                    filename += f"_p{percentile_range[0]}-{percentile_range[1]}"
            
            # CSV로 저장
            saved_path = self.save_to_csv(samples, filename)
            print(f"분포 샘플 데이터 저장 완료: {saved_path}")
        
        # 주요 지표들만 선택해서 시각화
        key_metrics = ['매출액', '영업이익', '당기순이익', '총자산']
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.flatten()
        
        # 원본 데이터
        original_data = self.actual_data[self.actual_data['등급'] == credit_grade]
        
        for i, metric in enumerate(key_metrics):
            if i < len(axes):
                ax = axes[i]
                
                if metric in original_data.columns:
                    # 원본 데이터 히스토그램
                    original_values = original_data[metric].dropna()
                    ax.hist(original_values, bins=50, alpha=0.3, density=True,
                           color='gray', label='Original Data')
                    
                    # 생성된 데이터 히스토그램
                    generated_values = samples[metric].dropna()
                    ax.hist(generated_values, bins=50, alpha=0.7, density=True,
                           color='skyblue', label='Generated Data')
                    
                    # KDE 곡선
                    if len(original_values) > 1:
                        original_kde = gaussian_kde(original_values)
                        x_range = np.linspace(min(original_values.min(), generated_values.min()),
                                            max(original_values.max(), generated_values.max()), 100)
                        ax.plot(x_range, original_kde(x_range), 'r-', linewidth=2,
                               label='Original KDE')
                    
                    if len(generated_values) > 1:
                        generated_kde = gaussian_kde(generated_values)
                        ax.plot(x_range, generated_kde(x_range), 'b--', linewidth=2,
                               label='Generated KDE')
                    
                    ax.set_title(f'{metric} Distribution ({credit_grade} Grade)')
                    ax.set_xlabel('Value')
                    ax.set_ylabel('Density')
                    ax.legend(fontsize=8)
                    ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()
        
        # 통계 요약
        print(f"\n=== {credit_grade} 등급 분포 데이터 통계 요약 ===")
        for metric in key_metrics:
            if metric in original_data.columns:
                original_mean = original_data[metric].mean()
                original_std = original_data[metric].std()
                generated_mean = samples[metric].mean()
                generated_std = samples[metric].std()
                
                print(f"\n{metric}:")
                print(f"  원본    - 평균: {original_mean:>10.0f}, 표준편차: {original_std:>10.0f}")
                print(f"  생성됨  - 평균: {generated_mean:>10.0f}, 표준편차: {generated_std:>10.0f}")
                
                # 상대적 차이 (%)
                mean_rel_diff = abs(generated_mean - original_mean) / abs(original_mean) * 100
                std_rel_diff = abs(generated_std - original_std) / abs(original_std) * 100
                print(f"  상대차이 - 평균: {mean_rel_diff:>9.1f}%, 표준편차: {std_rel_diff:>9.1f}%")
        
        return samples
    
    def save_to_csv(self, data, filename, folder_path="generated_data"):
        """
        생성된 데이터를 CSV 파일로 저장
        """
        # 폴더가 없으면 생성
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        
        # 파일 경로 생성
        file_path = os.path.join(folder_path, f"{filename}.csv")
        
        # CSV로 저장
        if isinstance(data, pd.Series):
            data.to_csv(file_path, encoding='utf-8-sig')
        else:
            data.to_csv(file_path, index=False, encoding='utf-8-sig')
        
        print(f"데이터가 저장되었습니다: {file_path}")
        return file_path

# 사용 예시
if __name__ == "__main__":
    # 1. 데이터 로드 및 생성기 초기화
    generator = BootstrapPerturbationGenerator('fakedata1.csv')
    
    # 2. 특정 등급의 분포 분석
    samples = generator.plot_distribution_comparison(
        credit_grade='AAA',
        num_samples=100,
        save_samples=True,
        filename='AAA_distribution_samples',
        perturbation_scale=0.1,  # 10% 변동
        percentile_range=(5, 95)
    )
    
    # 3. 모든 등급의 기업 생성
    all_companies = generator.generate_companies_all_grades(
        num_per_grade=10,
        perturbation_scale=0.1,
        percentile_range=(5, 95)
    )
    
    # 4. 생성된 데이터 저장
    generator.save_to_csv(all_companies, "bootstrap_generated_companies")

"""
Bootstrap + Perturbation 데이터 생성기 사용 예제

1. 기본 사용법:
```python
from generate_random_data_bootstrap import BootstrapPerturbationGenerator

# 생성기 초기화
generator = BootstrapPerturbationGenerator('fakedata1.csv')

# 단일 기업 생성
company_data = generator.generate_company_data(
    credit_grade='AAA',
    company_name='Test_Company',
    perturbation_scale=0.1,  # 10% 변동
    percentile_range=(5, 95)
)

# 여러 기업 생성
companies = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=10,
    perturbation_scale=0.1
)
```

2. 다른 생성기와 함께 사용:
```python
from generate_random_data_bootstrap import BootstrapPerturbationGenerator
from generate_random_data_copula_empirical import EmpiricalCopulaGenerator

# 두 생성기 초기화
bootstrap_generator = BootstrapPerturbationGenerator('fakedata1.csv')
copula_generator = EmpiricalCopulaGenerator('fakedata1.csv')

# 각각의 방식으로 데이터 생성
bootstrap_data = bootstrap_generator.generate_multiple_companies('AAA', 5)
copula_data = copula_generator.generate_multiple_companies('AAA', 5)

# 데이터 합치기
combined_data = pd.concat([bootstrap_data, copula_data], ignore_index=True)
```

3. 분포 분석 및 시각화:
```python
# 특정 등급의 분포 분석
samples = generator.plot_distribution_comparison(
    credit_grade='AAA',
    num_samples=100,
    save_samples=True,
    filename='AAA_distribution_samples',
    perturbation_scale=0.1,
    percentile_range=(5, 95)
)
```

4. 모든 등급 데이터 생성:
```python
# 모든 등급의 기업 생성
all_companies = generator.generate_companies_all_grades(
    num_per_grade=10,
    perturbation_scale=0.1,
    percentile_range=(5, 95)
)

# CSV로 저장
generator.save_to_csv(all_companies, "bootstrap_generated_companies")
```

5. 파라미터 조정:
```python
# 변동 폭 조정 (더 큰 변동)
companies_high_variance = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=10,
    perturbation_scale=0.2  # 20% 변동
)

# 변동 폭 조정 (더 작은 변동)
companies_low_variance = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=10,
    perturbation_scale=0.05  # 5% 변동
)
```

6. 재사용 가능한 함수로 만들기:
```python
def generate_company_data_with_bootstrap(credit_grade, num_companies, perturbation_scale=0.1):
    generator = BootstrapPerturbationGenerator('fakedata1.csv')
    return generator.generate_multiple_companies(
        credit_grade=credit_grade,
        num_companies=num_companies,
        perturbation_scale=perturbation_scale
    )

# 사용
aaa_companies = generate_company_data_with_bootstrap('AAA', 10, 0.1)
```

주요 파라미터 설명:
- perturbation_scale: 데이터 변동 폭 (기본값: 0.1 = 10%)
- percentile_range: 퍼센타일 범위 (예: (5, 95))
- num_companies: 생성할 기업 수
- credit_grade: 신용등급 (예: 'AAA', 'AA', 'A' 등)
"""