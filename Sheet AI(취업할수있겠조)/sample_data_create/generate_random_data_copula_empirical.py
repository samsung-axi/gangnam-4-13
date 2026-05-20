#%%
import pandas as pd

file='realdata1.csv'
df=pd.read_csv(file)
df


#%%
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from scipy.stats import gaussian_kde
import warnings
import os
from statsmodels.distributions.empirical_distribution import ECDF

warnings.filterwarnings('ignore')

# 한글 폰트 설정
plt.rcParams['font.family'] = ['DejaVu Sans', 'Malgun Gothic']
plt.rcParams['axes.unicode_minus'] = False

#%%
class EmpiricalCopulaGenerator:
    def __init__(self, actual_data_path):
        """
        실제 데이터를 사용하여 Copula 기반 데이터 생성기 초기화
        
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
        
        # 각 등급별 경험적 분포 함수 저장
        self.empirical_cdfs = {}
        self.empirical_ppfs = {}
        
        # 각 등급별 상관관계 행렬 저장
        self.correlation_matrices = {}
        
        # 변환 파라미터 저장
        self.transformation_params = {}
        for grade in self.actual_data['등급'].unique():
            self.transformation_params[grade] = {}
        
        # 데이터 전처리
        self._preprocess_data()
        
    def _preprocess_data(self):
        """
        실제 데이터 전처리 및 경험적 분포 함수 생성
        """
        # 각 등급별로 데이터 분리
        for grade in self.actual_data['등급'].unique():
            grade_data = self.actual_data[self.actual_data['등급'] == grade]
            
            # 각 지표별 경험적 분포 함수 생성
            self.empirical_cdfs[grade] = {}
            self.empirical_ppfs[grade] = {}
            
            # 변환된 데이터 저장용
            transformed_data = pd.DataFrame()
            
            for metric in self.financial_metrics:
                if metric in grade_data.columns:
                    values = grade_data[metric].dropna()
                    if len(values) > 0:
                        # 양수 값만 선택
                        positive_values = values[values > 0]
                        
                        if len(positive_values) > 0:
                            # 로그 변환
                            log_values = np.log1p(positive_values)
                            
                            # Box-Cox 변환
                            try:
                                boxcox_values, lambda_param = stats.boxcox(positive_values)
                                transformed_data[metric] = boxcox_values
                            except:
                                # Box-Cox 변환이 실패하면 로그 변환값 사용
                                transformed_data[metric] = log_values
                            
                            # 정규화
                            mean = transformed_data[metric].mean()
                            std = transformed_data[metric].std()
                            if std > 0:  # 표준편차가 0이 아닌 경우에만 정규화
                                transformed_data[metric] = (transformed_data[metric] - mean) / std
                            
                            # 변환 파라미터 저장
                            self.transformation_params[grade][metric] = {
                                'lambda': lambda_param if 'lambda_param' in locals() else None,
                                'mean': mean,
                                'std': std
                            }
                            
                            # 경험적 누적분포함수 (ECDF)
                            self.empirical_cdfs[grade][metric] = ECDF(transformed_data[metric])
                            # 경험적 분위수함수 (PPF)
                            self.empirical_ppfs[grade][metric] = lambda p, v=transformed_data[metric]: np.percentile(v, p * 100)
            
            # 상관관계 행렬 계산
            valid_metrics = [m for m in self.financial_metrics if m in transformed_data.columns]
            if len(valid_metrics) > 1:
                try:
                    # 상관관계 행렬 계산
                    corr_matrix = transformed_data[valid_metrics].corr().values
                    
                    # 양정치 보장
                    corr_matrix = self._ensure_positive_definite(corr_matrix)
                    
                    # 상관관계가 너무 높은 경우 조정
                    corr_matrix = np.clip(corr_matrix, -0.99, 0.99)
                    
                    self.correlation_matrices[grade] = corr_matrix
                except Exception as e:
                    print(f"Warning: {grade} 등급의 상관관계 행렬 계산 실패: {e}")
                    # 실패 시 단위행렬 사용
                    self.correlation_matrices[grade] = np.eye(len(valid_metrics))
    
    def _ensure_positive_definite(self, matrix):
        """
        행렬이 양정치(positive definite)가 되도록 조정
        """
        try:
            # 고유값 분해
            eigenvals, eigenvecs = np.linalg.eigh(matrix)
            
            # 음수 고유값을 작은 양수로 대체
            min_eigenval = np.min(eigenvals)
            if min_eigenval < 0:
                eigenvals = np.maximum(eigenvals, 1e-6)
            
            # 행렬 재구성
            matrix_fixed = eigenvecs @ np.diag(eigenvals) @ eigenvecs.T
            
            # 대각선 요소를 1로 정규화
            diag_sqrt = np.sqrt(np.diag(matrix_fixed))
            matrix_fixed = matrix_fixed / (diag_sqrt[:, None] * diag_sqrt[None, :])
            
            return matrix_fixed
        except:
            # 실패 시 단위행렬 반환
            return np.eye(matrix.shape[0])
    
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
    
    def _inverse_transform(self, data_dict, credit_grade):
        """
        변환된 데이터를 원래 스케일로 되돌림
        """
        result = {}
        for metric, value in data_dict.items():
            if metric in self.transformation_params[credit_grade]:
                params = self.transformation_params[credit_grade][metric]
                
                # 정규화 역변환
                value = value * params['std'] + params['mean']
                
                # Box-Cox 역변환
                if params['lambda'] is not None:
                    if params['lambda'] == 0:
                        value = np.exp(value)
                    else:
                        value = np.power(value * params['lambda'] + 1, 1/params['lambda'])
                
                # 로그 역변환
                value = np.expm1(value)
                
                result[metric] = value
            else:
                result[metric] = value
        return result
    
    def generate_company_data(self, credit_grade, company_name=None, seed=None, 
                            max_attempts=100, percentile_range=None):
        """
        Copula를 사용하여 기업 데이터 생성
        """
        if seed is not None:
            np.random.seed(seed)
        
        if credit_grade not in self.empirical_cdfs:
            raise ValueError(f"신용등급 '{credit_grade}'에 대한 데이터가 없습니다.")
        
        # 해당 등급의 원본 데이터 가져오기
        grade_data = self.actual_data[self.actual_data['등급'] == credit_grade]
        
        # 유효한 지표들 확인
        valid_metrics = [m for m in self.financial_metrics if m in grade_data.columns]
        if len(valid_metrics) < 2:
            raise ValueError(f"유효한 지표가 너무 적습니다: {len(valid_metrics)}개")
        
        # 상관관계 행렬 계산
        corr_matrix = grade_data[valid_metrics].corr().values
        corr_matrix = self._ensure_positive_definite(corr_matrix)
        
        # 다변량 정규분포에서 샘플링
        sample = np.random.multivariate_normal(
            mean=np.zeros(len(valid_metrics)),
            cov=corr_matrix,
            check_valid='warn'
        )
        
        # 정규분포 샘플을 uniform 분포로 변환
        uniform_samples = stats.norm.cdf(sample)
        
        # uniform 분포를 실제 데이터로 변환
        data_dict = {}
        for i, metric in enumerate(valid_metrics):
            values = grade_data[metric].dropna()
            if len(values) > 0:
                # 퍼센타일 계산
                percentile = uniform_samples[i] * 100
                value = np.percentile(values, percentile)
                
                # 퍼센타일 범위 적용
                if percentile_range is not None:
                    lower_bound = np.percentile(values, percentile_range[0])
                    upper_bound = np.percentile(values, percentile_range[1])
                    value = np.clip(value, lower_bound, upper_bound)
                
                data_dict[metric] = value
        
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
                                  percentile_range=None):
        """
        동일한 신용등급으로 여러 기업 데이터 생성
        """
        companies = []
        
        for i in range(num_companies):
            try:
                company_name = f"{name_prefix}_{credit_grade}_{i+1:02d}"
                company_data = self.generate_company_data(
                    credit_grade, company_name, seed=i,
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
                                    percentile_range=None):
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
                                   percentile_range=None):
        """
        원본 데이터와 생성된 데이터의 분포 비교 시각화
        """
        # 여러 샘플 생성
        samples = self.generate_multiple_companies(
            credit_grade, num_samples, "Sample",
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

#%%
# 사용 예시
if __name__ == "__main__":
    # 1. 데이터 로드 및 생성기 초기화
    generator = EmpiricalCopulaGenerator('fakedata1.csv')
    
    # 2. 모든 등급의 기업 생성
    # all_companies = generator.generate_companies_all_grades(
    #     num_per_grade=10,
    #     percentile_range=(5, 95)  # 5-95 퍼센타일 범위로 제한
    # )
    
    # 3. 생성된 데이터 저장
    # generator.save_to_csv(all_companies, "empirical_copula_generated_companies")
    
    samples = generator.plot_distribution_comparison(
            credit_grade='AAA',
            num_samples=100,
            save_samples=True,
            filename=f"{'AAA'}_distribution_samples",
            percentile_range=(5, 95)
        ) 

    # 4. 각 등급별 분포 비교 및 시각화
    # for grade in generator.actual_data['등급'].unique():
    #     print(f"\n{grade} 등급 분포 분석 중...")
    #     samples = generator.plot_distribution_comparison(
    #         credit_grade=grade,
    #         num_samples=100,
    #         save_samples=True,
    #         filename=f"{grade}_distribution_samples",
    #         percentile_range=(5, 95)
    #     ) 
# %%
