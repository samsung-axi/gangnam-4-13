import React, { useState } from 'react';
import './FinancialInputModal.css';
import { FaRegChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { companyInfoAtom, creditRatingAtom, financialDataAtom } from '@/shared/store/atoms.ts';
import { useReportMutation } from '@/features/report-generation/service/reportService';
import { devLog } from '@/shared/util/logger';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FinancialInputModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // jotai atom
  const [, setFinancialData] = useAtom(financialDataAtom);
  const [, setCreditRating] = useAtom(creditRatingAtom);
  const [, setCompanyInfo] = useAtom(companyInfoAtom);

  // 보고서 생성 mutation 훅 호출
  const reportMutation = useReportMutation();

  // 기본 재무 필드
  const financialFields = [
    { key: 'revenue', label: '매출액' },
    { key: 'operating_profit', label: '영업이익' },
    { key: 'net_income', label: '당기순이익' },
    { key: 'total_assets', label: '총자산' },
    { key: 'total_liabilities', label: '총부채' },
    { key: 'total_equity', label: '자본총계' },
    { key: 'capital', label: '자본금' },
    { key: 'operating_cash_flow', label: '영업활동현금흐름' },
    { key: 'interest_bearing_debt', label: '이자발생부채' },
  ];

  // 회사 정보 필드
  const companyFields = [
    { key: 'company_name', label: '회사명' },
    { key: 'industry_name', label: '산업 분류' },
    { key: 'market_type', label: '시장 유형' },
  ];

  // 초기 상태 설정
  const [values, setValues] = useState<{ [key: string]: string }>(
    Object.fromEntries([
      ...companyFields.map(field => [field.key, '']),
      ...financialFields.map(field => [field.key, ''])
    ])
  );

  const formatNumber = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '');
    if (!numeric) return '';
    return parseInt(numeric, 10).toLocaleString('ko-KR');
  };

  const handleChange = (key: string, rawValue: string, isNumeric: boolean = true) => {
    setValues(prev => ({
      ...prev,
      [key]: isNumeric ? formatNumber(rawValue) : rawValue,
    }));
  };

  // 확인 버튼 눌렀을 때 실행될 함수
  const handleSubmit = () => {
    if (!values.company_name.trim()) {
      alert('회사명을 입력해주세요.');
      return;
    }

    setIsGeneratingReport(true);

    // 숫자 데이터 변환
    const numericData: Record<string, number> = {};
    financialFields.forEach(field => {
      const clean = values[field.key]?.replace(/[^0-9]/g, '') || '0';
      numericData[field.key] = parseInt(clean, 10);
    });

    // 계산된 재무 비율 추가
    const totalAssets = numericData.total_assets || 1; // 0으로 나누기 방지
    const totalEquity = numericData.total_equity || 1;
    const revenue = numericData.revenue || 1;

    // 부채비율 = 총부채 / 총자산
    const debt_ratio = numericData.total_liabilities / totalAssets;
    
    // ROA = 당기순이익 / 총자산
    const ROA = numericData.net_income / totalAssets;
    
    // ROE = 당기순이익 / 자본총계
    const ROE = numericData.net_income / totalEquity;
    
    // 총자산회전율 = 매출액 / 총자산
    const asset_turnover_ratio = revenue / totalAssets;
    
    // 이자부담률 = 이자발생부채 / 총자산
    const interest_to_assets_ratio = numericData.interest_bearing_debt / totalAssets;
    
    // 매출액대비이자비율 = 이자발생부채 / 매출액
    const interest_to_revenue_ratio = numericData.interest_bearing_debt / revenue;

    // 로그 변환 값 추가
    const log_total_assets = Math.log(totalAssets > 0 ? totalAssets : 1);
    const log_total_liabilities = Math.log(numericData.total_liabilities > 0 ? numericData.total_liabilities : 1);

    // jotai 상태 업데이트
    setFinancialData({
      ROA,
      ROE,
      debt_ratio,
      asset_turnover_ratio,
      interest_to_assets_ratio,
    });

    // 회사 정보 저장
    setCompanyInfo({
      company_name: values.company_name,
      industry_name: values.industry_name || '정보 없음',
      market_type: values.market_type || '정보 없음',
    });

    // 보고서 생성 요청 데이터 준비
    const reportRequest = {
      company_name: values.company_name,
      similarity_score: 1.0, // 직접 입력이므로 유사도 1.0으로 설정
      financial_data: {
        corp_code: Date.now().toString(), // 임시 코드 생성
        corp_name: values.company_name,
        market_type: values.market_type || '정보 없음',
        industry_name: values.industry_name || '정보 없음',
        is_consolidated: false,
        revenue: numericData.revenue,
        operating_profit: numericData.operating_profit,
        net_income: numericData.net_income,
        total_assets: numericData.total_assets,
        total_liabilities: numericData.total_liabilities,
        total_equity: numericData.total_equity,
        capital: numericData.capital,
        operating_cash_flow: numericData.operating_cash_flow,
        interest_bearing_debt: numericData.interest_bearing_debt,
        debt_ratio,
        ROA,
        ROE,
        asset_turnover_ratio,
        interest_to_assets_ratio,
        interest_to_revenue_ratio,
        cash_flow_to_interest: null,
        interest_to_cash_flow: null,
        log_total_assets,
        log_total_liabilities,
        positive_factors: null,
        negative_factors: null,
        description: `${values.company_name} - ${values.industry_name || '정보 없음'} - ${values.market_type || '정보 없음'}`,
      },
      report_type: 'agent_based' as const,
    };

    // 보고서 생성 API 호출
    reportMutation.mutate(reportRequest, {
      onSuccess: data => {
        devLog('보고서 생성 성공:', data);
        setIsGeneratingReport(false);
        
        // 데이터가 유효한지 확인
        if (!data) {
          devLog('보고서 데이터가 없습니다.');
          alert('보고서 데이터를 받지 못했습니다.');
          return;
        }
        
        // 보고서 페이지로 이동하면서 데이터 전달
        try {
          navigate('/report', {
            state: {
              reportData: data,
              companyData: {
                company_name: values.company_name,
                financial_data: reportRequest.financial_data,
                similarity_score: reportRequest.similarity_score
              }
            }
          });
          onClose(); // 모달 닫기
        } catch (error) {
          devLog('페이지 이동 오류:', error);
          alert('페이지 이동 중 오류가 발생했습니다.');
        }
      },
      onError: error => {
        setIsGeneratingReport(false);
        devLog('보고서 생성 오류:', error);
        alert('보고서 생성 중 오류가 발생했습니다.');
      },
    });
  };

  return (
    <div
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='financial-modal bg-white rounded-xl shadow-2xl w-[620px] p-8 max-h-[85vh] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        {/* 제목 */}
        <div className='flex items-center space-x-3 mb-4'>
          <FaRegChartBar className='text-blue-600 text-xl' />
          <h2 className='text-2xl font-semibold text-gray-800'>직접 재무 입력</h2>
        </div>

        {/* 회사 정보 입력 폼 */}
        <div className='mb-6'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>회사 정보</h3>
          <div className='flex flex-col space-y-4'>
            {companyFields.map(field => (
              <label key={field.key} className='flex flex-col text-sm font-medium text-gray-700'>
                <span className='mb-1'>{field.label}</span>
                <input
                  type='text'
                  placeholder={`${field.label}을 입력하세요`}
                  value={values[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value, false)}
                  className='border border-gray-300 bg-gray-50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition'
                />
              </label>
            ))}
          </div>
        </div>

        {/* 재무 정보 입력 폼 */}
        <div>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>재무 정보</h3>
          <div className='flex flex-col space-y-4'>
            {financialFields.map(field => (
              <label key={field.key} className='flex flex-col text-sm font-medium text-gray-700'>
                <span className='mb-1'>{field.label}</span>
                <div className='flex items-center'>
                  <input
                    type='text'
                    inputMode='numeric'
                    placeholder={`${field.label}을 입력하세요`}
                    value={values[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className='flex-1 border border-gray-300 bg-gray-50 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition'
                  />
                  <span className='ml-2 text-gray-600 text-sm'>원</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className='flex justify-end space-x-4 pt-6 mt-6 border-t'>
          <button
            onClick={onClose}
            className='px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition'
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isGeneratingReport}
            className={`px-5 py-2 rounded-md ${
              isGeneratingReport ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold shadow-sm transition`}
          >
            {isGeneratingReport ? '보고서 생성 중...' : '보고서 생성'}
          </button>
        </div>

        {/* 보고서 생성 중 로딩 오버레이 */}
        {isGeneratingReport && (
          <div className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>보고서 생성 중</h3>
              <p className='text-gray-600'>
                기업 데이터를 분석하여 보고서를 생성하고 있습니다.
                <br />
                잠시만 기다려주세요...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialInputModal;
