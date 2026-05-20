import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const LeftArea = styled.div`
  width: 180px;
  height: calc(100vh - 86px);
  border-right: 1px solid gray;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 86px;
  justify-content: space-between;
  position: relative;
`;

export const RightArea = styled.div`
  flex: 1;
  height: calc(100vh - 86px);
  box-sizing: border-box;
  background-color: white;
  margin-top: 86px;
`;



export const GaguListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2%;
  flex-wrap: wrap;
`;

export const GaguList =styled.div`
margin-top:10px;
`
