#%%
import pandas as pd

file='등급별 평균 및 표준편차.xlsx'

#%%
# 방법 1: MultiIndex 컬럼으로 처리
def load_with_multiindex(file_path):
    """
    MultiIndex 컬럼으로 데이터를 로드하는 방법
    """
    # header=[0,1]로 두 행을 모두 헤더로 사용
    dataframe1 = pd.read_excel(file_path, header=[0, 1], index_col=0)
    
    # 컬럼명 정리 (NaN 값들을 적절히 처리)
    dataframe1.columns = pd.MultiIndex.from_tuples([
        (col[0] if pd.notna(col[0]) else '', col[1] if pd.notna(col[1]) else '')
        for col in dataframe1.columns
    ])
    
    return dataframe1

#%%
df_multiindex = load_with_multiindex(file)
df_multiindex

#%%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
import os
warnings.filterwarnings('ignore')

# 한글 폰트 설정
plt.rcParams['font.family'] = ['DejaVu Sans', 'Malgun Gothic']
plt.rcParams['axes.unicode_minus'] = False

#%%
class MultivariateRejectionSampler:
    def __init__(self, df_multiindex):
        """
        MultiIndex DataFrame을 입력받아 초기화
        리젝션 샘플링을 사용한 다변량 정규분포 기반 데이터 생성
        """
        self.df = df_multiindex
        self.financial_metrics = [
            '매출액', '영업이익', '당기순이익', '총자산', '총부채', 
            '자본총계', '자본금', '영업활동현금흐름', '이자발생부채'
        ]
        # 양수만 가능한 지표들
        self.positive_only_metrics = ['매출액', '총자산', '자본금', '자본총계']
        
        # 기본 상관관계 행렬
        self.default_correlation = self._create_default_correlation_matrix()
    
    def _create_default_correlation_matrix(self):
        """재무지표 간의 현실적인 상관관계 행렬 생성"""
        metrics = self.financial_metrics
        n = len(metrics)
        corr_matrix = np.eye(n)
        
        correlations = {
            ('매출액', '영업이익'): 0.85,
            ('매출액', '당기순이익'): 0.75,
            ('매출액', '총자산'): 0.70,
            ('매출액', '영업활동현금흐름'): 0.65,
            ('영업이익', '당기순이익'): 0.90,
            ('영업이익', '영업활동현금흐름'): 0.70,
            ('당기순이익', '영업활동현금흐름'): 0.60,
            ('총자산', '총부채'): 0.80,
            ('총자산', '자본총계'): 0.60,
            ('총자산', '이자발생부채'): 0.70,
            ('총부채', '이자발생부채'): 0.85,
            ('자본총계', '자본금'): 0.40,
        }
        
        for (metric1, metric2), corr_val in correlations.items():
            if metric1 in metrics and metric2 in metrics:
                idx1 = metrics.index(metric1)
                idx2 = metrics.index(metric2)
                corr_matrix[idx1, idx2] = corr_val
                corr_matrix[idx2, idx1] = corr_val
        
        return corr_matrix
    
    def _ensure_positive_definite(self, matrix):
        """행렬이 양정치(positive definite)가 되도록 조정"""
        eigenvals, eigenvecs = np.linalg.eigh(matrix)
        eigenvals = np.maximum(eigenvals, 1e-8)
        matrix_fixed = eigenvecs @ np.diag(eigenvals) @ eigenvecs.T
        return matrix_fixed
    
    def _create_covariance_matrix(self, means, stds, correlation_matrix):
        """평균, 표준편차, 상관관계 행렬로부터 공분산 행렬 생성"""
        std_matrix = np.diag(stds)
        covariance_matrix = std_matrix @ correlation_matrix @ std_matrix
        covariance_matrix = self._ensure_positive_definite(covariance_matrix)
        return covariance_matrix
    
    def _validate_financial_ratios(self, data_dict):
        """재무비율 검증"""
        issues = []
        
        # ROA 검증: -50% ~ 50%
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
    
    def _apply_financial_constraints(self, data_dict):
        """재무지표 간의 회계적 제약조건 적용"""
        # 자본총계 = 총자산 - 총부채
        if all(key in data_dict for key in ['총자산', '총부채', '자본총계']):
            calculated_equity = data_dict['총자산'] - data_dict['총부채']
            data_dict['자본총계'] = (data_dict['자본총계'] + calculated_equity) / 2
        
        # 영업이익은 매출액의 -50% ~ 50% 범위
        if '매출액' in data_dict and '영업이익' in data_dict:
            max_operating_income = data_dict['매출액'] * 0.5
            min_operating_income = data_dict['매출액'] * -0.5
            data_dict['영업이익'] = np.clip(data_dict['영업이익'], 
                                       min_operating_income, max_operating_income)
        
        # 당기순이익은 영업이익보다 작거나 같아야 함
        if '영업이익' in data_dict and '당기순이익' in data_dict:
            if data_dict['영업이익'] > 0:
                data_dict['당기순이익'] = min(data_dict['당기순이익'], 
                                        data_dict['영업이익'] * 1.5)
        
        # 양수만 가능한 지표들 처리
        for metric in self.positive_only_metrics:
            if metric in data_dict:
                data_dict[metric] = max(data_dict[metric], 0.1)
        
        # 자본금은 자본총계보다 작아야 함
        if '자본금' in data_dict and '자본총계' in data_dict:
            if data_dict['자본총계'] > 0:
                data_dict['자본금'] = min(data_dict['자본금'], data_dict['자본총계'])
        
        return data_dict
    
    def _check_percentile_bounds(self, value, mean, std, percentile_range):
        """값이 퍼센타일 범위 내에 있는지 확인"""
        lower_z = stats.norm.ppf(percentile_range[0] / 100.0)
        upper_z = stats.norm.ppf(percentile_range[1] / 100.0)
        lower_bound = mean + lower_z * std
        upper_bound = mean + upper_z * std
        return lower_bound <= value <= upper_bound
    
    def generate_company_data(self, credit_grade, company_name=None, seed=None, 
                            max_attempts=1000, percentile_range=(5, 95)):
        """리젝션 샘플링을 사용한 기업 데이터 생성"""
        if seed is not None:
            np.random.seed(seed)
        
        if credit_grade not in self.df.index:
            raise ValueError(f"신용등급 '{credit_grade}'이 데이터에 없습니다.")
        
        # 해당 등급의 통계 데이터 가져오기
        grade_data = self.df.loc[credit_grade]
        
        # 평균과 표준편차 추출
        means = []
        stds = []
        valid_metrics = []
        
        for metric in self.financial_metrics:
            try:
                mean_val = grade_data[(metric, 'mean(평균)')]
                std_val = grade_data[(metric, 'std(표준편차)')]
                
                if not (pd.isna(mean_val) or pd.isna(std_val)):
                    means.append(mean_val)
                    stds.append(std_val)
                    valid_metrics.append(metric)
            except KeyError:
                try:
                    mean_val = grade_data[(metric, 'mean')]
                    std_val = grade_data[(metric, 'std')]
                    
                    if not (pd.isna(mean_val) or pd.isna(std_val)):
                        means.append(mean_val)
                        stds.append(std_val)
                        valid_metrics.append(metric)
                except KeyError:
                    continue
        
        if len(valid_metrics) < 2:
            raise ValueError(f"유효한 지표가 너무 적습니다: {len(valid_metrics)}개")
        
        means = np.array(means)
        stds = np.array(stds)
        
        # 상관관계 행렬 계산
        correlation_matrix = self.default_correlation.copy()
        if len(valid_metrics) != len(self.financial_metrics):
            valid_indices = [self.financial_metrics.index(metric) for metric in valid_metrics]
            correlation_matrix = correlation_matrix[np.ix_(valid_indices, valid_indices)]
        
        # 공분산 행렬 생성
        covariance_matrix = self._create_covariance_matrix(means, stds, correlation_matrix)
        
        # 리젝션 샘플링
        for attempt in range(max_attempts):
            # 다변량 정규분포에서 샘플 생성
            sample = np.random.multivariate_normal(mean=means, cov=covariance_matrix)
            
            # 딕셔너리로 변환
            data_dict = dict(zip(valid_metrics, sample))
            
            # 퍼센타일 범위 검증
            is_valid = True
            for i, metric in enumerate(valid_metrics):
                if not self._check_percentile_bounds(sample[i], means[i], stds[i], percentile_range):
                    is_valid = False
                    break
            
            if not is_valid:
                continue
            
            # 제약조건 적용
            data_dict = self._apply_financial_constraints(data_dict)
            
            # 재무비율 검증
            is_valid, issues = self._validate_financial_ratios(data_dict)
            
            if is_valid:
                # 누락된 지표는 NaN으로 설정
                for metric in self.financial_metrics:
                    if metric not in data_dict:
                        data_dict[metric] = np.nan
                
                # Series로 변환
                company_data = pd.Series(data_dict)
                company_data.name = company_name or f"Generated_Company_{credit_grade}"
                return company_data
            
            if attempt == max_attempts - 1:
                print(f"Warning: 최대 시도 횟수({max_attempts})에 도달했습니다.")
                return None
    
    def generate_multiple_companies(self, credit_grade, num_companies=10, 
                                  name_prefix="Company", include_credit_grade=True,
                                  percentile_range=(5, 95)):
        """동일한 신용등급으로 여러 기업 데이터 생성"""
        companies = []
        successful_generations = 0
        max_attempts = num_companies * 10  # 실패 대비해서 더 많이 시도
        
        for i in range(max_attempts):
            if successful_generations >= num_companies:
                break
                
            company_name = f"{name_prefix}_{credit_grade}_{successful_generations+1:02d}"
            company_data = self.generate_company_data(
                credit_grade, company_name, seed=i,
                percentile_range=percentile_range
            )
            
            if company_data is not None:
                companies.append(company_data)
                successful_generations += 1
        
        if len(companies) == 0:
            raise Exception(f"{credit_grade} 등급 기업 생성에 완전히 실패했습니다.")
        
        # DataFrame으로 변환
        result_df = pd.DataFrame(companies)
        
        if include_credit_grade:
            result_df['신용등급'] = credit_grade
            cols = ['신용등급'] + [col for col in result_df.columns if col != '신용등급']
            result_df = result_df[cols]
        
        return result_df
    
    def generate_companies_all_grades(self, num_per_grade=10, name_prefix="Company",
                                    percentile_range=(5, 95)):
        """모든 신용등급에 대해 기업 데이터 생성"""
        all_companies = []
        
        for grade in self.df.index:
            try:
                print(f"{grade} 등급 기업 생성 중...")
                grade_companies = self.generate_multiple_companies(
                    grade, num_per_grade, name_prefix,
                    include_credit_grade=True,
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
    
    def save_to_csv(self, data, filename, folder_path="generated_data"):
        """생성된 데이터를 CSV 파일로 저장"""
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        
        file_path = os.path.join(folder_path, f"{filename}.csv")
        
        if isinstance(data, pd.Series):
            data.to_csv(file_path, encoding='utf-8-sig')
        else:
            data.to_csv(file_path, index=False, encoding='utf-8-sig')
        
        print(f"데이터가 저장되었습니다: {file_path}")
        return file_path
    
    def plot_distribution_comparison(self, credit_grade, num_samples=1000, save_samples=False,
                                   filename=None, percentile_range=(5, 95)):
        """원본 통계와 생성된 데이터의 분포 비교 시각화"""
        samples = self.generate_multiple_companies(
            credit_grade, num_samples, "Sample",
            percentile_range=percentile_range
        )
        
        if save_samples:
            if filename is None:
                filename = f"distribution_samples_{credit_grade}_{num_samples}_p{percentile_range[0]}-{percentile_range[1]}"
            saved_path = self.save_to_csv(samples, filename)
            print(f"분포 샘플 데이터 저장 완료: {saved_path}")
        
        key_metrics = ['매출액', '영업이익', '당기순이익', '총자산']
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.flatten()
        
        for i, metric in enumerate(key_metrics):
            if i < len(axes):
                ax = axes[i]
                
                original_mean = None
                original_std = None
                
                if (metric, 'mean(평균)') in self.df.columns:
                    original_mean = self.df.loc[credit_grade, (metric, 'mean(평균)')]
                    original_std = self.df.loc[credit_grade, (metric, 'std(표준편차)')]
                elif (metric, 'mean') in self.df.columns:
                    original_mean = self.df.loc[credit_grade, (metric, 'mean')]
                    original_std = self.df.loc[credit_grade, (metric, 'std')]
                
                if not (pd.isna(original_mean) or pd.isna(original_std)):
                    generated_values = samples[metric].dropna()
                    ax.hist(generated_values, bins=50, alpha=0.7, density=True,
                           color='skyblue', label=f'Generated Data ({percentile_range[0]}-{percentile_range[1]}%)')
                    
                    from scipy.stats import truncnorm
                    
                    lower_z = stats.norm.ppf(percentile_range[0] / 100.0)
                    upper_z = stats.norm.ppf(percentile_range[1] / 100.0)
                    lower_bound = original_mean + lower_z * original_std
                    upper_bound = original_mean + upper_z * original_std
                    
                    if metric in self.positive_only_metrics:
                        lower_bound = max(0.1, lower_bound)
                    
                    x = np.linspace(lower_bound, upper_bound, 100)
                    a = (lower_bound - original_mean) / original_std
                    b = (upper_bound - original_mean) / original_std
                    truncated_dist = truncnorm.pdf(x, a, b, loc=original_mean, scale=original_std)
                    ax.plot(x, truncated_dist, 'r-', linewidth=2, label='Truncated Normal')
                    
                    x_full = np.linspace(generated_values.min() * 0.8, generated_values.max() * 1.2, 100)
                    original_dist = stats.norm.pdf(x_full, original_mean, original_std)
                    ax.plot(x_full, original_dist, 'g--', linewidth=1, alpha=0.5, label='Original Normal')
                    
                    ax.axvline(original_mean, color='red', linestyle='--',
                              label=f'Mean: {original_mean:.0f}')
                    
                    ax.axvline(lower_bound, color='orange', linestyle=':', alpha=0.7,
                              label=f'{percentile_range[0]}% bound')
                    ax.axvline(upper_bound, color='orange', linestyle=':', alpha=0.7,
                              label=f'{percentile_range[1]}% bound')
                    
                    ax.set_title(f'{metric} Distribution ({credit_grade} Grade)\nTruncated {percentile_range[0]}-{percentile_range[1]}%')
                    ax.set_xlabel('Value')
                    ax.set_ylabel('Density')
                    ax.legend(fontsize=8)
                    ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()
        
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
    
#%%
generator = MultivariateRejectionSampler(df_multiindex)

# 3. 여러 기업 생성
companies = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=100,
    percentile_range=(10, 90)
)

generator.save_to_csv(companies, "multivariate_generated_companies")


# 4. 분포 비교 및 시각화
# samples = generator.plot_distribution_comparison(
#     credit_grade='AAA',
#     num_samples=1000,
#     save_samples=True,
#     percentile_range=(10, 90)
# )

#%%
# 모든 등급의 기업 생성 예시
generator = MultivariateRejectionSampler(df_multiindex)

# 모든 등급에 대해 각각 10개의 기업 생성
all_companies = generator.generate_companies_all_grades(
    num_per_grade=10,
    name_prefix="Company",
    percentile_range=(5, 95)  # 10-90 퍼센타일 범위로 제한
)

generator.save_to_csv(all_companies, "all_grades_companies_multivariate_10")


from util.add_derived_variables import add_derived_variables
all_companies=add_derived_variables(all_companies)

# # 생성된 데이터 저장
generator.save_to_csv(all_companies, "all_grades_companies_multivariate_derived")


#%%
"""
# 사용 가능한 다른 예시들:

# 1. 특정 등급의 기업만 생성
aaa_companies = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=100,
    percentile_range=(10, 90)
)

# 2. 단일 기업 생성
single_company = generator.generate_company_data(
    credit_grade='AAA',
    percentile_range=(10, 90)
)

# 3. 특정 등급의 분포만 시각화
samples = generator.plot_distribution_comparison(
    credit_grade='AAA',
    num_samples=1000,
    save_samples=True,
    percentile_range=(10, 90)
)
"""