import React from 'react';
import './EtherTheme.css';

/**
 * 에테르 테마 상세 내용 컴포넌트
 * 바람결을 닮은 투명한 향기의 감성적인 상세 페이지
 */
function EtherTheme({ perfume }) {
    console.log('EtherTheme 렌더링됨, perfume:', perfume);
    return (
        <>
            {/* 메인 이미지 영역 - 고정된 높이 */}
            <div className="ether-main-section">
                {/* 메인 히어로 섹션 */}
                <section className="ether-hero">
                    <div className="ether-hero-bg">
                        <img src="/images/ether-main.png" alt="에테르 메인 이미지" className="ether-main-image" />
                        <div className="ether-hero-overlay">
                            <div className="ether-hero-content">
                                <h2 className="ether-subtitle">Éther by Banghyang Eau de Parfum</h2>
                                <p className="ether-tagline">바람결을 닮은 투명한 향기, 숨을 쉬듯 스며드는 신화 속 공기</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UVP 섹션 */}
                <section className="ether-uvp">
                    <div className="ether-uvp-content">
                        <p className="ether-uvp-text">
                            햇살이 스치는 하늘, 투명한 바람, 신화 속 순수한 공기처럼<br />
                            에테르는 피부 위에 가볍게 내려앉는 '빛의 향기'입니다.
                        </p>
                    </div>
                </section>

                {/* 감성 제품 설명 */}
                <section className="ether-description">
                    <div className="ether-description-content">
                        <div className="ether-description-text">
                            <p>
                                에테르는 바람 한 점 없는 푸른 하늘 아래,<br />
                                하얀 천이 부드럽게 흩날리는 순간을 닮았습니다.
                            </p>
                            <p>
                                첫 향에서 터지는 베르가못과 핑크 페퍼의 청량함은 마치 새벽 공기처럼 신선하게 다가오며,<br />
                                아이리스와 자스민 삼박이 만들어내는 중심은 부드러운 파우더리 감성으로<br />
                                마음을 가볍게 덮어줍니다.
                            </p>
                            <p>
                                시간이 지날수록 머스크와 시더우드의 고요한 잔향이<br />
                                공기 속에 스며들 듯 은은하게 남아, 당신의 하루에 맑은 숨결을 더해줍니다.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* 감성 제품 설명 결론 */}
            <section className="ether-description-conclusion">
                <div className="ether-description-conclusion-content">
                    <p className="ether-description-conclusion-text">
                        특별하지 않은 날에도, 무언가 새롭게 시작되는 순간도 어울리는 맑고 투명한 여백 같은 존재입니다.
                    </p>
                </div>
            </section>

            {/* 향조 정보 이후 섹션들 - 독립적인 영역 */}
            <div className="ether-details-section">
                {/* 향조 정보 */}
                <section className="ether-notes">
                    <div className="ether-notes-content">
                        <div className="ether-notes-layout">
                            {/* 왼쪽: 노트 정보 */}
                            <div className="ether-notes-left">
                                {/* Top Note */}
                                <div className="ether-note-item">
                                    <h4 className="ether-note-title">Top Note</h4>
                                    <div className="ether-note-graph">
                                        <div className="ether-graph-bar">
                                            <div className="ether-graph-segment" style={{width: '35%', backgroundColor: '#87CEEB'}}></div>
                                            <div className="ether-graph-segment" style={{width: '25%', backgroundColor: '#B0E0E6'}}></div>
                                            <div className="ether-graph-segment" style={{width: '20%', backgroundColor: '#E0F6FF'}}></div>
                                            <div className="ether-graph-segment" style={{width: '15%', backgroundColor: '#F0F8FF'}}></div>
                                            <div className="ether-graph-segment" style={{width: '5%', backgroundColor: '#F5F5F5'}}></div>
                                        </div>
                                        <div className="ether-graph-labels">
                                            <span>베르가못</span>
                                            <span>핑크 페퍼</span>
                                            <span>레몬</span>
                                            <span>그린 노트</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Note */}
                                <div className="ether-note-item">
                                    <h4 className="ether-note-title">Middle Note</h4>
                                    <div className="ether-note-graph">
                                        <div className="ether-graph-bar">
                                            <div className="ether-graph-segment" style={{width: '40%', backgroundColor: '#87CEEB'}}></div>
                                            <div className="ether-graph-segment" style={{width: '30%', backgroundColor: '#B0E0E6'}}></div>
                                            <div className="ether-graph-segment" style={{width: '20%', backgroundColor: '#E0F6FF'}}></div>
                                            <div className="ether-graph-segment" style={{width: '10%', backgroundColor: '#F0F8FF'}}></div>
                                        </div>
                                        <div className="ether-graph-labels">
                                            <span>아이리스</span>
                                            <span>자스민 삼박</span>
                                            <span>로즈</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Base Note */}
                                <div className="ether-note-item">
                                    <h4 className="ether-note-title">Base Note</h4>
                                    <div className="ether-note-graph">
                                        <div className="ether-graph-bar">
                                            <div className="ether-graph-segment" style={{width: '45%', backgroundColor: '#87CEEB'}}></div>
                                            <div className="ether-graph-segment" style={{width: '35%', backgroundColor: '#B0E0E6'}}></div>
                                            <div className="ether-graph-segment" style={{width: '20%', backgroundColor: '#E0F6FF'}}></div>
                                        </div>
                                        <div className="ether-graph-labels">
                                            <span>머스크</span>
                                            <span>시더우드</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 성별 선호도 */}
                            <div className="ether-notes-right">
                                <div className="ether-preference-graph">
                                    <div className="ether-preference-item">
                                        <span className="ether-preference-label">여성</span>
                                        <div className="ether-preference-bar">
                                            <div className="ether-preference-fill" style={{width: '75%', backgroundColor: '#FFB6C1'}}></div>
                                        </div>
                                        <span className="ether-preference-percent">75%</span>
                                    </div>
                                    <div className="ether-preference-item">
                                        <span className="ether-preference-label">남성</span>
                                        <div className="ether-preference-bar">
                                            <div className="ether-preference-fill" style={{width: '45%', backgroundColor: '#87CEEB'}}></div>
                                        </div>
                                        <span className="ether-preference-percent">45%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 어울리는 순간 */}
                <section className="ether-moments">
                    <div className="ether-moments-content">
                        <div className="ether-moments-grid">
                            <div className="ether-moment-item">
                                <span className="ether-moment-number">1</span>
                                <p>햇살 좋은 날, 커튼으로 스며드는 바람</p>
                            </div>
                            <div className="ether-moment-item">
                                <span className="ether-moment-number">2</span>
                                <p>새하얀 셔츠를 입은 봄날의 출근길</p>
                            </div>
                            <div className="ether-moment-item">
                                <span className="ether-moment-number">3</span>
                                <p>생각을 정리하는 조용한 오후의 창가</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 추천 계절 */}
                <section className="ether-season">
                    <div className="ether-season-content">
                        <p className="ether-season-text">
                            봄의 첫 바람부터 초여름의 푸른 공기까지.<br />
                            가벼운 옷차림, 청명한 하늘, 그리고 비워진 마음 위에 조용히 내려앉는 향.
                        </p>
                    </div>
                </section>

                {/* SNS 문구 */}
                <section className="ether-sns">
                    <div className="ether-sns-content">
                        <p className="ether-sns-text">
                            오늘은 마음까지 맑아지는 날,<br />
                            <span className="ether-sns-hashtags">#에테르 #투명한공기 #파우더리무드</span>
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

export default EtherTheme;
