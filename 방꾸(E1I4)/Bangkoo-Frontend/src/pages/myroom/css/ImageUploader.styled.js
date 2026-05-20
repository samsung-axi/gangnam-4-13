import styled from "styled-components";

export const DeleteBox = styled.div`
  display: flex;
  justify-content: flex-end;
  & > button {
    margin-bottom: ${({ theme }) => theme.spacing.sm };
  }
`;

export const UndoRedoBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const UploadContainer = styled.div`
  //width: 100%;
  //max-width: 800px;
  //aspect-ratio: 16 / 9;
  //overflow: hidden;
  height: 100%;
  max-height: calc(100vh - ${({ theme }) => theme.headerHeight } - 199px);
  border: ${({ theme, $hasImage }) => $hasImage ? `1px solid ${theme.colors.grey}` : `2px dashed ${theme.colors.grey}`};
  border-radius: ${({ theme }) => theme.borderRadius.md };
  text-align: center;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white };
  //cursor: pointer;
  position: relative;
  box-sizing: border-box;
`;

export const UploadBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  
  & p {
    margin: ${({ theme }) => theme.spacing.xl} 0 0;
  }
`;

export const LoadingBox = styled.div`
  height: calc(100% - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 150px;
  box-sizing: border-box;
  
  & p {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

export const UploadInput = styled.input`
  display: none;
`;
//PreviewImage가 있었던 자리 (김범석)
// export const PreviewImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit:contain;
//
// `;
// 이미지 양 여백 blur 처리 용 스타일 추가 (김범석)
// export const BlurredWrapper = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   pointer-events: none; // 클릭 방지
//   z-index: 0;
//   overflow: hidden; // 이 부분이 중요
//   border-radius: ${({ theme }) => theme.borderRadius.md };
// `;
//
// export const BlurredImage = styled.img`
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     width: 120%;
//     height: 120%;
//     transform: translate(-50%, -50%) scale(1.2); // 완전한 중앙 + 확대
//     object-fit: cover;
//     filter: blur(30px) brightness(0.7);
//     pointer-events: none;center center; // 중심 기준으로 확대
// `;
//
// export const MainImage = styled.img`
//   position: relative;
//   width: 100%;
//   height: 100%;
//   object-fit: contain; // 원본 비율 유지
//   z-index: 1;
// `;
export const MainCanvas = styled.canvas`
    position: relative;
    //width: 100%;
    //height: 100%;
    display: block;
    margin: 0 auto;
    //object-fit: cover;
    z-index: 1;
`;

export const BlurredWrapper = styled.div`
    position: relative;

    overflow: hidden;    /* ✅ 마스크 넘치는 부분 잘라냄 */
    border-radius: 15px;
`;

// export const MaskCanvas = styled.canvas`
//     position: absolute;
//     top: 0;
//     left: 0;
//     z-index: 10;
//     width: 100%;
//     height: 100%;
//     max-width: 100%;
//     max-height: 100%;
//     object-fit: contain;
//     pointer-events: auto;
//     border-radius: 16px; /* 선택사항 */
// `;
export const BlurredCanvas = styled.img`
    width: auto;
    height: 100%;
    opacity: 0.6;
    object-fit: cover;
`;

