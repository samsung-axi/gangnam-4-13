import styled from "styled-components";

const Container = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(20deg, rgb(33, 33, 33), rgb(66, 66, 66));
  margin: 0; /* margin 제거 */
  padding: 0; /* padding 제거 */
`;

const Position = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-areas:
    "leftTop rightTop"
    "leftBot rightBot"
    "leftBot2 rightBot2";
  z-index: 3;
  transition: 1s;
  transform: scale(1);
  margin: 0; /* margin 제거 */
  padding: 0; /* padding 제거 */
`;

const GRID_AREA: { [key: number]: string } = {
  0: "leftTop",
  1: "rightTop",
  2: "leftBot",
  3: "rightBot",
  4: "leftBot2",
  5: "rightBot2",
};

const PuzzleBox = styled.div<{ gridArea: number; hoverScale: boolean }>`
  grid-area: ${({ gridArea }) => GRID_AREA[gridArea]};
  width: 200px;
  height: 200px;
  background: white;
  border: 1px solid gray;
  cursor: pointer;
  transition: 0.4s;
  border-radius: 8px; /* 부드러운 모서리 */

  /* 3D 효과 추가 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transform-style: preserve-3d;
  overflow: hidden; /* 이미지가 넘치지 않도록 숨기기 */

  /* margin이나 padding 제거 */
  margin: 0;
  padding: 0;

  :hover {
    transform: ${({ hoverScale }) =>
      hoverScale && "scale(1.2) rotateY(15deg) rotateX(10deg)"};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Hover 시 더 강한 그림자 */
  }

  /* 애니메이션을 부드럽게 추가 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const PuzzleImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율을 유지하며 이미지가 퍼즐 박스에 맞게 채워지도록 함 */
  border-radius: 8px; /* 이미지도 모서리 둥글게 */

  /* margin이나 padding 제거 */
  margin: 0;
  padding: 0;
`;

const S = {
  Container,
  Position,
  PuzzleBox,
  PuzzleImg,
};

export default S;
