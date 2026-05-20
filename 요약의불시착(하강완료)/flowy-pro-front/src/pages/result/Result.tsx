import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  background-color: #f7f7f7;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Result: React.FC = () => {
  return (
    <Container>
      <MainContent>{/* <ResultContents /> */}</MainContent>
    </Container>
  );
};

export default Result;
