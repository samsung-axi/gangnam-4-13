import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/footer/TermsofUse.css';

const TermsOfUse = () => {

    const navigate = useNavigate();

    return (
        <>
            <img src="/images/logo.png" alt="1번 이미지" className="main-logo-image"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            />
            <div className="termsofuse-container">
                <div className="termsofuse-content">
                    <div className="termsofuse-title">-이용 약관-</div>
                    <br/>

                    <div className="termsofuse-notice">
                        <p>본 약관은 “방향” 서비스의 이용과 관련된 기본적인 권리와 의무를 명시한 것입니다.</p>
                    </div>
                    <br/>

                    <section className="termsofuse-section">
                        <h2>1. 목적</h2>
                        <ul>
                            <li className="termsofuse-li">본 약관은 "방향" 서비스 이용과 관련하여 필요한 사항을 규정하는 것을 목적으로 합니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="termsofuse-section">
                        <h2>2. 회원가입</h2>
                        <ul>
                            <li className="termsofuse-li">회원은 필수 정보를 제공하여 가입할 수 있으며, 가입 즉시 서비스 이용이 가능합니다.</li>          
                        </ul>
                    </section>
                    <br/>

                    <section className="termsofuse-section">
                        <h2>3. 서비스의 제공 및 변경</h2>
                        <ul>
                        <li className="termsofuse-li">"방향"은 향 추천 서비스와 관련한 다양한 정보를 제공합니다. 필요에 따라 서비스 내용을 변경할 수 있으며, 변경 시 사전에 공지합니다.</li>
                        </ul>
                    </section>
                    <br/>

                    <section className="termsofuse-section">
                        <h2>4. 책임의 제한</h2>
                        <ul>
                        <li className="termsofuse-li">"방향"은 회원이 제공하는 향수 추천 결과에 대한 만족도와 관련해 직접적인 책임을 지지 않습니다.</li>
                        </ul>
                    </section>
                    <br/>

                    
                </div>
            </div>
        </>
    );
};

export default TermsOfUse;
