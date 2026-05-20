import React from "react";
import styled from "styled-components";

const Spinner = styled.div`
  border: 6px solid #eee;
  border-top: 6px solid ${({ theme }) => theme.colors.orange};
  border-radius: 50%;
  width: 46px;
  height: 46px;
  animation: spin 1s linear infinite;
  margin: 1rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner = () => <Spinner />;

export default LoadingSpinner;