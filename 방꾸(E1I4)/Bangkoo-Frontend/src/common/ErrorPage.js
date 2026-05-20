import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Error500 } from '../assets/images/Error500.svg';
import { ReactComponent as Error404 } from '../assets/images/Error404.svg';
import { Link } from 'react-router-dom';

const Root = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding-top: ${({ theme }) => theme.headerHeight};
  background: ${({ theme }) => theme.colors.lightOrange};
`;

const RootIn = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > div > svg {
    width: 400px;
    height: auto;
  }
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const TextStyle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 600;
`;

const SmallStyle = styled.p`
  margin: 6px 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.dark};
  & a {
    color: ${({ theme }) => theme.colors.orange};
    font-weight: bold;
    text-decoration: none;
  }
`;

const ErrorPage = ({error = "404"}) => {
    return (
        <Root>
            <RootIn>
                {error === "500" &&
                    <div>
                        <Error500/>
                        <TextStyle>죄송합니다! 서버에서 문제가 발생했습니다.</TextStyle>
                        <SmallStyle>
                            잠시 후에 다시 시도해 주세요.
                        </SmallStyle>
                        <SmallStyle>
                            <Link to="/">돌아가기</Link>
                        </SmallStyle>
                    </div>
                }

                {error === "404" &&
                    <div>
                        <Error404/>
                        <TextStyle>
                            죄송합니다. 찾으시는 페이지가 존재하지 않습니다.</TextStyle>
                        <SmallStyle>
                            URL을 확인하시거나 홈페이지로 돌아가시기 바랍니다.
                        </SmallStyle>
                        <SmallStyle>
                            <Link to="/">돌아가기</Link>
                        </SmallStyle>
                    </div>
                }
            </RootIn>
        </Root>
    );
};

export default ErrorPage;