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

# 한글 폰트 설정 (matplotlib에서 한글 표시용)
plt.rcParams['font.family'] = ['DejaVu Sans', 'Malgun Gothic']
plt.rcParams['axes.unicode_minus'] = False

#%%



class MultivariateCompanyDataGenerator:
    def __init__(self, df_multiindex):
        """
        MultiIndex DataFrame을 입력받아 초기화
        상관관계를 고려한 다변량 정규분포 기반 데이터 생성
        """
        self.df = df_multiindex
        self.financial_metrics = [
            '매출액', '영업이익', '당기순이익', '총자산', '총부채', 
            '자본총계', '자본금', '영업활동현금흐름', '이자발생부채'
        ]
        # 양수만 가능한 지표들
        self.positive_only_metrics = ['매출액', '총자산', '자본금', '자본총계']
        
        # 기본 상관관계 행렬 (실제 데이터가 없을 때 사용할 현실적인 상관관계)
        self.default_correlation = self._create_default_correlation_matrix()
        
    def _create_default_correlation_matrix(self):
        """
        재무지표 간의 현실적인 상관관계 행렬 생성
        """
        metrics = self.financial_metrics
        n = len(metrics)
        corr_matrix = np.eye(n)  # 단위행렬로 시작
        
        # 현실적인 상관관계 설정
        # 실제 데이터의 피어슨 상관계수를 구하여 넣어줄 필요 있음
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
        
        # 상관관계 행렬 채우기
        for (metric1, metric2), corr_val in correlations.items():
            if metric1 in metrics and metric2 in metrics:
                idx1 = metrics.index(metric1)
                idx2 = metrics.index(metric2)
                corr_matrix[idx1, idx2] = corr_val
                corr_matrix[idx2, idx1] = corr_val
        
        return corr_matrix
    
    def _calculate_correlation_matrix(self, credit_grade, original_data=None):
        """
        특정 신용등급의 상관관계 행렬 계산
        원본 데이터가 있으면 사용하고, 없으면 기본값 사용
        """
        if original_data is not None:
            # 실제 데이터에서 상관관계 계산
            grade_data = original_data[original_data['신용등급'] == credit_grade]
            if len(grade_data) > 10:  # 충분한 데이터가 있을 때만
                correlation_matrix = grade_data[self.financial_metrics].corr().values
                # NaN 값 처리
                correlation_matrix = np.nan_to_num(correlation_matrix, nan=0.0)
                # 대각선을 1로 설정
                np.fill_diagonal(correlation_matrix, 1.0)
                return correlation_matrix
        
        # 기본 상관관계 행렬 사용
        return self.default_correlation.copy()
    
    def _ensure_positive_definite(self, matrix):
        """
        행렬이 양정치(positive definite)가 되도록 조정
        다변량 정규분포에서 공분산 행렬은 반드시 양정치여야 함
        """
        # 고유값 분해
        eigenvals, eigenvecs = np.linalg.eigh(matrix)
        
        # 음수 고유값을 작은 양수로 조정
        eigenvals = np.maximum(eigenvals, 1e-8)
        
        # 행렬 재구성
        matrix_fixed = eigenvecs @ np.diag(eigenvals) @ eigenvecs.T
        
        return matrix_fixed
    
    def _create_covariance_matrix(self, means, stds, correlation_matrix):
        """
        평균, 표준편차, 상관관계 행렬로부터 공분산 행렬 생성
        """
        # 표준편차 대각행렬
        std_matrix = np.diag(stds)
        
        # 공분산 행렬 = D * R * D (D: 표준편차 행렬, R: 상관관계 행렬)
        covariance_matrix = std_matrix @ correlation_matrix @ std_matrix
        
        # 양정치 보장
        covariance_matrix = self._ensure_positive_definite(covariance_matrix)
        
        return covariance_matrix
    
    def _apply_financial_constraints(self, data_dict):
        """
        재무지표 간의 회계적 제약조건 적용
        """
        # 제약조건 1: 자본총계 = 총자산 - 총부채
        if all(key in data_dict for key in ['총자산', '총부채', '자본총계']):
            calculated_equity = data_dict['총자산'] - data_dict['총부채']
            # 원래 값과 계산된 값의 평균 사용 (완전히 대체하지 않고 조정)
            data_dict['자본총계'] = (data_dict['자본총계'] + calculated_equity) / 2
        
        # 제약조건 2: 영업이익은 매출액의 -50% ~ 50% 범위
        if '매출액' in data_dict and '영업이익' in data_dict:
            max_operating_income = data_dict['매출액'] * 0.5
            min_operating_income = data_dict['매출액'] * -0.5
            data_dict['영업이익'] = np.clip(data_dict['영업이익'], 
                                       min_operating_income, max_operating_income)
        
        # 제약조건 3: 당기순이익은 영업이익보다 작거나 같아야 함 (일반적으로)
        if '영업이익' in data_dict and '당기순이익' in data_dict:
            if data_dict['영업이익'] > 0:
                # 영업이익이 양수일 때, 당기순이익은 영업이익의 150% 이하
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

    def _apply_percentile_range(self, data_dict, means, stds, percentile_range):
        """
        지정된 퍼센타일 범위 내로 데이터 조정
        """
        for metric, value in data_dict.items():
            if metric in self.financial_metrics:
                idx = self.financial_metrics.index(metric)
                mean = means[idx]
                std = stds[idx]
                
                # 퍼센타일 범위 계산
                lower_z = stats.norm.ppf(percentile_range[0] / 100.0)
                upper_z = stats.norm.ppf(percentile_range[1] / 100.0)
                lower_bound = mean + lower_z * std
                upper_bound = mean + upper_z * std
                
                # 양수만 가능한 지표는 하한값 조정
                if metric in self.positive_only_metrics:
                    lower_bound = max(0.1, lower_bound)
                
                # 값이 범위를 벗어나면 가장 가까운 경계값으로 조정
                data_dict[metric] = np.clip(value, lower_bound, upper_bound)
        
        return data_dict

    def generate_company_data(self, credit_grade, company_name=None, seed=None, 
                            max_attempts=100, original_data=None, percentile_range=None):
        """
        다변량 정규분포와 제약조건을 사용한 기업 데이터 생성
        
        Parameters:
        - credit_grade: 신용등급
        - company_name: 생성할 기업명
        - seed: 랜덤 시드
        - max_attempts: 최대 시도 횟수
        - original_data: 상관관계 계산용 원본 데이터 (선택사항)
        - percentile_range: 퍼센타일 범위 (예: (5, 95))
        """
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
                # df_multiindex 구조에 맞게 수정: (metric, 'mean(평균)') 형태
                mean_val = grade_data[(metric, 'mean(평균)')]
                std_val = grade_data[(metric, 'std(표준편차)')]
                
                if not (pd.isna(mean_val) or pd.isna(std_val)):
                    means.append(mean_val)
                    stds.append(std_val)
                    valid_metrics.append(metric)
            except KeyError:
                # 다른 가능한 컬럼명 패턴도 시도
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
        correlation_matrix = self._calculate_correlation_matrix(credit_grade, original_data)
        
        # 유효한 지표에 맞게 상관관계 행렬 조정
        if len(valid_metrics) != len(self.financial_metrics):
            valid_indices = [self.financial_metrics.index(metric) for metric in valid_metrics]
            correlation_matrix = correlation_matrix[np.ix_(valid_indices, valid_indices)]
        
        # 공분산 행렬 생성
        covariance_matrix = self._create_covariance_matrix(means, stds, correlation_matrix)
        
        # 다변량 정규분포에서 샘플링 (여러 번 시도)
        for attempt in range(max_attempts):
            try:
                # 다변량 정규분포에서 샘플 생성
                sample = np.random.multivariate_normal(mean=means, cov=covariance_matrix)
                
                # 딕셔너리로 변환
                data_dict = dict(zip(valid_metrics, sample))
                
                # 퍼센타일 범위 적용 (지정된 경우)
                if percentile_range is not None:
                    data_dict = self._apply_percentile_range(data_dict, means, stds, percentile_range)
                
                # 제약조건 적용
                data_dict = self._apply_financial_constraints(data_dict)
                
                # 재무비율 검증
                is_valid, issues = self._validate_financial_ratios(data_dict)
                
                if is_valid:
                    # 성공적으로 생성됨
                    break
                elif attempt == max_attempts - 1:
                    # 마지막 시도에서도 실패하면 경고만 출력하고 사용
                    print(f"Warning: 재무비율 검증 실패 (시도 {max_attempts}회): {issues}")
                    
            except Exception as e:
                if attempt == max_attempts - 1:
                    raise Exception(f"데이터 생성 실패 (시도 {max_attempts}회): {e}")
                continue
        
        # 누락된 지표는 NaN으로 설정
        for metric in self.financial_metrics:
            if metric not in data_dict:
                data_dict[metric] = np.nan
        
        # Series로 변환
        company_data = pd.Series(data_dict)
        company_data.name = company_name or f"Generated_Company_{credit_grade}"
        
        return company_data
    
    def generate_multiple_companies(self, credit_grade, num_companies=10, 
                                  name_prefix="Company", original_data=None, 
                                  include_credit_grade=True, percentile_range=None):
        """
        동일한 신용등급으로 여러 기업 데이터 생성
        """
        companies = []
        successful_generations = 0
        
        for i in range(num_companies * 2):  # 실패 대비해서 더 많이 시도
            try:
                company_name = f"{name_prefix}_{credit_grade}_{successful_generations+1:02d}"
                company_data = self.generate_company_data(
                    credit_grade, company_name, seed=i, 
                    original_data=original_data,
                    percentile_range=percentile_range
                )
                companies.append(company_data)
                successful_generations += 1
                
                if successful_generations >= num_companies:
                    break
                    
            except Exception as e:
                print(f"기업 {i+1} 생성 실패: {e}")
                continue
        
        if len(companies) == 0:
            raise Exception(f"{credit_grade} 등급 기업 생성에 완전히 실패했습니다.")
        
        # DataFrame으로 변환
        result_df = pd.DataFrame(companies)
        
        # 수정: 신용등급 컬럼 추가 옵션
        if include_credit_grade:
            result_df['신용등급'] = credit_grade
            # 신용등급 컬럼을 맨 앞으로 이동
            cols = ['신용등급'] + [col for col in result_df.columns if col != '신용등급']
            result_df = result_df[cols]
        
        return result_df
    
    def generate_companies_all_grades(self, num_per_grade=10, name_prefix="Company", 
                                    original_data=None, percentile_range=None):
        """
        모든 신용등급에 대해 기업 데이터 생성
        """
        all_companies = []
        
        for grade in self.df.index:
            try:
                print(f"{grade} 등급 기업 생성 중...")
                grade_companies = self.generate_multiple_companies(
                    grade, num_per_grade, name_prefix, original_data, 
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
    
    def analyze_correlations(self, generated_data, credit_grade=None):
        """
        생성된 데이터의 상관관계 분석
        """
        if credit_grade:
            # 수정: 신용등급 컬럼이 있는지 확인
            if '신용등급' in generated_data.columns:
                data_subset = generated_data[generated_data['신용등급'] == credit_grade]
                title_suffix = f" ({credit_grade} 등급)"
            else:
                # 신용등급 컬럼이 없으면 전체 데이터 사용하고 경고 출력
                print(f"Warning: '신용등급' 컬럼이 없어서 전체 데이터로 분석합니다.")
                data_subset = generated_data
                title_suffix = f" (전체 데이터 - {credit_grade} 등급으로 생성됨)"
        else:
            data_subset = generated_data
            title_suffix = " (전체)"
        
        # 상관관계 행렬 계산
        correlation_matrix = data_subset[self.financial_metrics].corr()
        
        # 히트맵 그리기
        plt.figure(figsize=(12, 10))
        plt.imshow(correlation_matrix, cmap='coolwarm', aspect='auto', vmin=-1, vmax=1)
        plt.colorbar(label='Correlation Coefficient')
        plt.title(f'재무지표 상관관계 행렬{title_suffix}')
        
        # 축 레이블 설정
        plt.xticks(range(len(self.financial_metrics)), self.financial_metrics, rotation=45)
        plt.yticks(range(len(self.financial_metrics)), self.financial_metrics)
        
        # 상관계수 텍스트 표시
        for i in range(len(self.financial_metrics)):
            for j in range(len(self.financial_metrics)):
                plt.text(j, i, f'{correlation_matrix.iloc[i, j]:.2f}', 
                        ha='center', va='center', fontsize=8)
        
        plt.tight_layout()
        plt.show()
        
        return correlation_matrix
    
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

    def compare_statistics(self, original_stats, generated_data, credit_grade):
        """
        원본 통계와 생성된 데이터의 통계 비교
        
        Parameters:
        - original_stats: 원본 통계 데이터 (MultiIndex DataFrame)
        - generated_data: 생성된 기업 데이터 (DataFrame)
        - credit_grade: 비교할 신용등급
        """
        print(f"\n=== {credit_grade} 등급 통계 비교 ===")
        
        # 신용등급 컬럼이 있는지 확인
        if '신용등급' in generated_data.columns:
            grade_data = generated_data[generated_data['신용등급'] == credit_grade]
        else:
            # 신용등급 컬럼이 없으면 전체 데이터를 해당 등급으로 간주
            grade_data = generated_data
            print(f"Warning: '신용등급' 컬럼이 없어서 전체 데이터를 {credit_grade} 등급으로 간주합니다.")
        
        print(f"생성된 데이터: {len(grade_data)}개 기업\n")
        
        # 각 재무지표별로 통계 비교
        for metric in self.financial_metrics:
            if metric in grade_data.columns:
                try:
                    # 원본 데이터에서 평균과 표준편차 추출
                    original_mean = None
                    original_std = None
                    
                    # 패턴 1: (metric, 'mean(평균)')
                    if (metric, 'mean(평균)') in original_stats.columns:
                        original_mean = original_stats.loc[credit_grade, (metric, 'mean(평균)')]
                        original_std = original_stats.loc[credit_grade, (metric, 'std(표준편차)')]
                    # 패턴 2: (metric, 'mean')
                    elif (metric, 'mean') in original_stats.columns:
                        original_mean = original_stats.loc[credit_grade, (metric, 'mean')]
                        original_std = original_stats.loc[credit_grade, (metric, 'std')]
                    
                    if original_mean is not None and not pd.isna(original_mean):
                        # 생성된 데이터의 통계 계산
                        generated_mean = grade_data[metric].mean()
                        generated_std = grade_data[metric].std()
                        
                        # 결과 출력
                        print(f"{metric}:")
                        print(f"  원본    - 평균: {original_mean:>15,.0f}, 표준편차: {original_std:>15,.0f}")
                        print(f"  생성됨  - 평균: {generated_mean:>15,.0f}, 표준편차: {generated_std:>15,.0f}")
                        
                        # 차이 계산 및 출력
                        mean_diff = abs(generated_mean - original_mean)
                        std_diff = abs(generated_std - original_std)
                        
                        # 상대적 차이 (%)
                        mean_rel_diff = (mean_diff / abs(original_mean)) * 100 if original_mean != 0 else 0
                        std_rel_diff = (std_diff / abs(original_std)) * 100 if original_std != 0 else 0
                        
                        print(f"  절대차이 - 평균: {mean_diff:>15,.0f}, 표준편차: {std_diff:>15,.0f}")
                        print(f"  상대차이 - 평균: {mean_rel_diff:>14.1f}%, 표준편차: {std_rel_diff:>14.1f}%")
                        print()
                    else:
                        print(f"{metric}: 원본 데이터에서 찾을 수 없음")
                        
                except Exception as e:
                    print(f"{metric}: 처리 중 오류 발생 - {e}")
                    continue

    def plot_distribution_comparison(self, credit_grade, num_samples=1000, save_samples=False, 
                                   filename=None, percentile_range=(5, 95)):
        """
        원본 통계와 생성된 데이터의 분포 비교 시각화 (5-95 퍼센타일 범위)
        
        Parameters:
        - credit_grade: 신용등급
        - num_samples: 생성할 샘플 수 (기본 1000)
        - save_samples: 생성된 샘플 데이터를 CSV로 저장할지 여부
        - filename: CSV 파일명 (지정하지 않으면 자동 생성)
        - percentile_range: 퍼센타일 범위 (기본값: 5-95%)
        """
        # 여러 샘플 생성
        samples = self.generate_multiple_companies(
            credit_grade, num_samples, "Sample"
        )
        
        # 샘플 데이터 저장 (선택사항)
        if save_samples:
            if filename is None:
                filename = f"distribution_samples_{credit_grade}_{num_samples}_p{percentile_range[0]}-{percentile_range[1]}"
            
            # CSV로 저장
            saved_path = self.save_to_csv(samples, filename)
            print(f"분포 샘플 데이터 저장 완료: {saved_path}")
        
        # 주요 지표들만 선택해서 시각화
        key_metrics = ['매출액', '영업이익', '당기순이익', '총자산']
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.flatten()
        
        for i, metric in enumerate(key_metrics):
            if i < len(axes):
                ax = axes[i]
                
                # 원본 통계
                original_mean = None
                original_std = None
                
                # 패턴 1: (metric, 'mean(평균)')
                if (metric, 'mean(평균)') in self.df.columns:
                    original_mean = self.df.loc[credit_grade, (metric, 'mean(평균)')]
                    original_std = self.df.loc[credit_grade, (metric, 'std(표준편차)')]
                # 패턴 2: (metric, 'mean')
                elif (metric, 'mean') in self.df.columns:
                    original_mean = self.df.loc[credit_grade, (metric, 'mean')]
                    original_std = self.df.loc[credit_grade, (metric, 'std')]
                
                if not (pd.isna(original_mean) or pd.isna(original_std)):
                    # 생성된 데이터 히스토그램
                    generated_values = samples[metric].dropna()
                    ax.hist(generated_values, bins=50, alpha=0.7, density=True, 
                           color='skyblue', label=f'Generated Data ({percentile_range[0]}-{percentile_range[1]}%)')
                    
                    # 절단된 정규분포의 이론적 곡선
                    from scipy.stats import truncnorm
                    
                    # 퍼센타일 범위 계산
                    lower_z = stats.norm.ppf(percentile_range[0] / 100.0)
                    upper_z = stats.norm.ppf(percentile_range[1] / 100.0)
                    lower_bound = original_mean + lower_z * original_std
                    upper_bound = original_mean + upper_z * original_std
                    
                    if metric in self.positive_only_metrics:
                        lower_bound = max(0.1, lower_bound)
                    
                    # 절단된 정규분포 곡선
                    x = np.linspace(lower_bound, upper_bound, 100)
                    a = (lower_bound - original_mean) / original_std
                    b = (upper_bound - original_mean) / original_std
                    truncated_dist = truncnorm.pdf(x, a, b, loc=original_mean, scale=original_std)
                    ax.plot(x, truncated_dist, 'r-', linewidth=2, label='Truncated Normal')
                    
                    # 원본 이론적 분포도 표시 (전체 범위)
                    x_full = np.linspace(generated_values.min() * 0.8, generated_values.max() * 1.2, 100)
                    original_dist = stats.norm.pdf(x_full, original_mean, original_std)
                    ax.plot(x_full, original_dist, 'g--', linewidth=1, alpha=0.5, label='Original Normal')
                    
                    # 원본 평균선
                    ax.axvline(original_mean, color='red', linestyle='--', 
                              label=f'Mean: {original_mean:.0f}')
                    
                    # 퍼센타일 경계선
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
        
        # 통계 요약
        print(f"\n=== {credit_grade} 등급 분포 데이터 통계 요약 (퍼센타일: {percentile_range[0]}-{percentile_range[1]}%) ===")
        for metric in key_metrics:
            original_mean = None
            original_std = None
            
            # 패턴 1: (metric, 'mean(평균)')
            if (metric, 'mean(평균)') in self.df.columns:
                original_mean = self.df.loc[credit_grade, (metric, 'mean(평균)')]
                original_std = self.df.loc[credit_grade, (metric, 'std(표준편차)')]
            # 패턴 2: (metric, 'mean')
            elif (metric, 'mean') in self.df.columns:
                original_mean = self.df.loc[credit_grade, (metric, 'mean')]
                original_std = self.df.loc[credit_grade, (metric, 'std')]
            
            if not pd.isna(original_mean):
                generated_mean = samples[metric].mean()
                generated_std = samples[metric].std()
                
                # 이론적 범위 계산
                lower_z = stats.norm.ppf(percentile_range[0] / 100.0)
                upper_z = stats.norm.ppf(percentile_range[1] / 100.0)
                theoretical_lower = original_mean + lower_z * original_std
                theoretical_upper = original_mean + upper_z * original_std
                
                # 실제 생성된 데이터의 범위
                actual_min = samples[metric].min()
                actual_max = samples[metric].max()
                
                print(f"\n{metric}:")
                print(f"  원본    - 평균: {original_mean:>10.0f}, 표준편차: {original_std:>10.0f}")
                print(f"  생성됨  - 평균: {generated_mean:>10.0f}, 표준편차: {generated_std:>10.0f}")
                print(f"  이론범위 - 최소: {theoretical_lower:>10.0f}, 최대: {theoretical_upper:>10.0f}")
                print(f"  실제범위 - 최소: {actual_min:>10.0f}, 최대: {actual_max:>10.0f}")
        
        return samples  # 생성된 샘플 데이터 반환

    def _validate_financial_ratios(self, data_dict):
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

#%%
# 1. 초기화
generator = MultivariateCompanyDataGenerator(df_multiindex)

all_companies = generator.generate_companies_all_grades(
    num_per_grade=2000,
    percentile_range=(5, 95)  # 5-95 퍼센타일 범위로 제한
)

from add_derived_variables import add_derived_variables
all_companies=add_derived_variables(all_companies)

generator.save_to_csv(all_companies, "all_grades_generated_companies")


# samples = generator.plot_distribution_comparison(
#     credit_grade='AAA',
#     num_samples=500,  # 샘플 수 조정
#     save_samples=True,  # CSV로 저장
#     filename='aaa_distribution_samples',  # 파일명 지정
#     percentile_range=(10, 90)  # 퍼센타일 범위 조정
# )

#%%
# 사용 예시
"""
# 1. 기본 사용법
generator = MultivariateCompanyDataGenerator(df_multiindex)

# 2. 단일 기업 생성
# 2.1 기본 생성
single_company = generator.generate_company_data('AAA')

# 2.2 퍼센타일 범위 지정하여 생성
single_company = generator.generate_company_data(
    credit_grade='AAA',
    percentile_range=(5, 95)  # 5-95 퍼센타일 범위로 제한
)

# 3. 여러 기업 생성
# 3.1 기본 생성
multiple_companies = generator.generate_multiple_companies('AAA', num_companies=100)

# 3.2 퍼센타일 범위 지정하여 생성
multiple_companies = generator.generate_multiple_companies(
    credit_grade='AAA',
    num_companies=100,
    percentile_range=(10, 90)  # 10-90 퍼센타일 범위로 제한
)

# 4. 모든 등급의 기업 생성
# 4.1 기본 생성
all_companies = generator.generate_companies_all_grades(num_per_grade=50)

# 4.2 퍼센타일 범위 지정하여 생성
all_companies = generator.generate_companies_all_grades(
    num_per_grade=50,
    percentile_range=(5, 95)  # 5-95 퍼센타일 범위로 제한
)

# 5. 상관관계 분석
correlation_matrix = generator.analyze_correlations(all_companies, 'AAA')

# 6. 저장
generator.save_to_csv(all_companies, "multivariate_generated_companies")

# 7. 통계 비교
generator.compare_statistics(df_multiindex, all_companies, 'AAA')

# 8. 분포 비교 및 시각화
# 8.1 기본 사용 (1000개 샘플, 5-95 퍼센타일)
samples = generator.plot_distribution_comparison('AAA')

# 8.2 샘플 수 조정 및 저장 옵션 사용
samples = generator.plot_distribution_comparison(
    credit_grade='AAA',
    num_samples=500,  # 샘플 수 조정
    save_samples=True,  # CSV로 저장
    filename='aaa_distribution_samples',  # 파일명 지정
    percentile_range=(10, 90)  # 퍼센타일 범위 조정
)

# 8.3 다른 등급에 대한 분포 분석
samples = generator.plot_distribution_comparison(
    credit_grade='BBB',
    num_samples=1000,
    save_samples=True,
    percentile_range=(5, 95)
)
"""