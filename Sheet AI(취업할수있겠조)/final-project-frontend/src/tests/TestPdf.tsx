import React, { useEffect } from 'react';
import testData from './bogoser.json';
import { PDFDownloader } from '@/tests/ReactPdf.tsx';
import Html2JsPdf from '@/tests/Html2JsPdf.tsx';

const TestPdf: React.FC = () => {
  useEffect(() => {
    console.log('PDF 데이터 구조 확인:', testData.json);
  }, []);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>PDF 테스트</h1>
      <div className='mb-4'>
        <p className='text-gray-600 mb-2'>아래 버튼을 클릭하여 PDF를 다운로드할 수 있습니다.</p>
        <PDFDownloader data={testData.json} />
        <Html2JsPdf />
      </div>
    </div>
  );
};

export default TestPdf;
