// pages/3d/ActionSection.js
import React from 'react';
import CommonButton from '@/common/CommonButton';
import { useApplyPlacement } from '@/hooks/useApplyPlacement';

export default function ActionSection({ background, canvasSize, setShowMask, setShowHelper }) {
  const handleApply = useApplyPlacement({ background, canvasSize, setShowMask, setShowHelper });

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <CommonButton
        width="160px"
        height="48px"
        bgColor="#ffda44"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        color="#000"
        onClick={handleApply}
      >
        적용하기
      </CommonButton>
    </div>
  );
}
