import { evaluationResultAtom } from '@src/config/atom.js';
import { useAtom } from 'jotai';
import React from 'react';

/**
 * 결과 항목 그룹 정의
 * @param {Object} data - 평가 결과 데이터 (model_result)
 * @returns {Object} 그룹화된 결과 항목
 */
const getResultGroups = (data) => ({
  // 주요 결과
  mainResults: [
    { key: 'result', label: '적합 여부', value: data.result },
    { key: 'emotion', label: '표정', value: data.emotion },
    { key: '최종 판단', label: '최종 판단', value: data['최종 판단'] },
  ],
  // 수치 데이터
  measurements: [
    { key: '입꼬리기울기', label: '입꼬리 기울기', value: data['입꼬리기울기'] },
    { key: '입꼬리거리(px)', label: '입꼬리 거리(px)', value: data['입꼬리거리(px)'] },
    { key: '입벌어짐비율', label: '입 벌어짐 비율', value: data['입벌어짐비율'] },
    { key: '입꼬리비대칭', label: '입꼬리 비대칭', value: data['입꼬리비대칭'] },
    { key: '광대비대칭', label: '광대 비대칭', value: data['광대비대칭'] },
    { key: '입중앙오프셋', label: '입 중앙 오프셋', value: data['입중앙오프셋'] },
  ],
  // 판정 결과
  judgments: [
    { key: '눈썹가림', label: '눈썹 가림', value: data['눈썹가림'] },
    { key: '귀노출', label: '귀 노출', value: data['귀노출'] },
    { key: '시선정면', label: '시선 정면', value: data['시선정면'] },
    { key: '얼굴정면', label: '얼굴 정면', value: data['얼굴정면'] },
  ],
});

/**
 * 결과 항목 컴포넌트
 */
const ResultItem = ({ label, value, valueClassName }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
    <span className="font-medium text-gray-700">{label}</span>
    <span className={`font-bold ${valueClassName}`}>{value}</span>
  </div>
);

/**
 * 메인 결과 항목 컴포넌트
 */
const MainResultItem = ({ label, value, valueClassName }) => (
  <div className="p-4 bg-gray-50 rounded-lg text-center">
    <h3 className="text-lg font-medium text-gray-700 mb-2">{label}</h3>
    <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
  </div>
);

/**
 * AI 분석 결과 컴포넌트
 */
const AIAnalysisResult = ({ content }) => {
  if (!content) return null;
  
  // 줄바꿈을 <br> 태그로 변환
  const formattedContent = content.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-2">
      {paragraph.split('\n').map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line}
          {lineIndex < paragraph.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </p>
  ));

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="text-gray-700 leading-relaxed">
        {formattedContent}
      </div>
    </div>
  );
};

/**
 * 평가 결과를 표시하는 레이아웃 컴포넌트
 */
const EvaluationLayout = () => {
  const [evaluationResult] = useAtom(evaluationResultAtom);

  if (!evaluationResult) {
    return null;
  }

  // 새로운 응답 형식에 맞게 model_result 데이터 사용
  const modelResult = evaluationResult.model_result || evaluationResult;
  const gptResult = evaluationResult.gpt_result;
  
  const resultGroups = getResultGroups(modelResult);

  // 값에 따른 색상 결정
  const getValueColor = (value) => {
    if (typeof value === 'string') {
      if (value.includes('⭕')) return 'text-green-600';
      if (value.includes('❌')) return 'text-red-600';
    }
    return 'text-gray-800';
  };

  // 수치 데이터 포맷팅
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">증명사진 분석 결과</h2>
      
      {/* 주요 결과 */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resultGroups.mainResults.map((item) => (
            <MainResultItem
              key={item.key}
              label={item.label}
              value={item.value}
              valueClassName={getValueColor(item.value)}
            />
          ))}
        </div>
      </div>
      
      {/* AI 상세 분석 결과 */}
      {gptResult && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">AI 상세 분석</h3>
          <AIAnalysisResult content={gptResult} />
        </div>
      )}
      
      {/* 측정 수치 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">측정 수치</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {resultGroups.measurements.map((item) => (
            <ResultItem
              key={item.key}
              label={item.label}
              value={formatValue(item.value)}
              valueClassName={getValueColor(item.value)}
            />
          ))}
        </div>
      </div>
      
      {/* 판정 결과 */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">판정 결과</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resultGroups.judgments.map((item) => (
            <ResultItem
              key={item.key}
              label={item.label}
              value={item.value}
              valueClassName={getValueColor(item.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvaluationLayout;
