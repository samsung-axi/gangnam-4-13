import React from 'react';
import './LunaTheme.css';

/**
 * 루나 테마 상세 내용 컴포넌트
 * 달빛 아래 라벤더 정원을 거니는 듯한, 고요하고 신비로운 향의 감성적인 상세 페이지
 */
function LunaTheme({ perfume }) {
    console.log('LunaTheme 렌더링됨, perfume:', perfume);
    return (
        <>
            {/* 메인 이미지 영역 - 고정된 높이 */}
            <div className="luna-main-section">
                {/* 메인 히어로 섹션 */}
                <section className="luna-hero">
                    <div className="luna-hero-bg">
                        <img src="/images/luna-main.png" alt="루나 메인 이미지" className="luna-main-image" />
                        <div className="luna-hero-overlay">
                            <div className="luna-hero-content">
                                <h2 className="luna-subtitle">Luna by Banghyang Eau de Parfum</h2>
                                <p className="luna-tagline">달빛 아래 라벤더 정원을 거니는 듯한, 고요하고 신비로운 향</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UVP 섹션 */}
                <section className="luna-uvp">
                    <div className="luna-uvp-content">
                        <p className="luna-uvp-text">
                            밤하늘과 어울리는 우디 아로마틱 무드.
                        </p>
                    </div>
                </section>
            </div>
            {/* 감성 제품 설명 */}
            <section className="luna-description">
                <div className="luna-description-content">
                    <div className="luna-description-text">
                        <p>
                            레몬과 클라리 세이지의 맑고 가벼운 시작은
                        </p>
                        <p>
                            차분한 공간을 밝히는 작은 별빛처럼 은은하고,<br />
                            중심의 라벤더와 바이올렛 리프는<br />
                            달빛 아래 핀 보랏빛 정원처럼 부드럽고 몽환적입니다.
                        </p>
                        <p>
                            잔향에 남는 앰버와 베티버는<br />
                            그 밤이 결코 외롭지 않도록, 따뜻한 온기를 남깁니다.
                        </p>
                    </div>
                    <p className="luna-description-conclusion">
                        루나는 혼자 있는 시간이 소중한 사람에게, 하루의 끝 오늘도 조용히 다가갑니다.
                    </p>
                </div>
            </section>

            {/* 향조 정보 이후 섹션들 - 독립적인 영역 */}
            <div className="luna-details-section">
                {/* 향조 정보 */}
                <section className="luna-notes">
                    <div className="luna-notes-content">
                        <div className="luna-notes-layout">
                            {/* 왼쪽: 노트 정보 */}
                            <div className="luna-notes-left">
                                {/* Top Note */}
                                <div className="luna-note-item">
                                    <h4 className="luna-note-title">Top Note</h4>
                                    <div className="luna-note-graph">
                                        <div className="luna-graph-bar">
                                            <div className="luna-graph-segment" style={{ width: '45%', backgroundColor: '#8A2BE2' }}></div>
                                            <div className="luna-graph-segment" style={{ width: '35%', backgroundColor: '#9370DB' }}></div>
                                            <div className="luna-graph-segment" style={{ width: '20%', backgroundColor: '#BA55D3' }}></div>
                                        </div>
                                        <div className="luna-graph-labels">
                                            <span>레몬</span>
                                            <span>클라리 세이지</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Note */}
                                <div className="luna-note-item">
                                    <h4 className="luna-note-title">Middle Note</h4>
                                    <div className="luna-note-graph">
                                        <div className="luna-graph-bar">
                                            <div className="luna-graph-segment" style={{ width: '50%', backgroundColor: '#8A2BE2' }}></div>
                                            <div className="luna-graph-segment" style={{ width: '30%', backgroundColor: '#9370DB' }}></div>
                                            <div className="luna-graph-segment" style={{ width: '20%', backgroundColor: '#BA55D3' }}></div>
                                        </div>
                                        <div className="luna-graph-labels">
                                            <span>라벤더</span>
                                            <span>바이올렛 리프</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Base Note */}
                                <div className="luna-note-item">
                                    <h4 className="luna-note-title">Base Note</h4>
                                    <div className="luna-note-graph">
                                        <div className="luna-graph-bar">
                                            <div className="luna-graph-segment" style={{ width: '55%', backgroundColor: '#8A2BE2' }}></div>
                                            <div className="luna-graph-segment" style={{ width: '45%', backgroundColor: '#9370DB' }}></div>
                                        </div>
                                        <div className="luna-graph-labels">
                                            <span>앰버</span>
                                            <span>베티버</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 성별 선호도 */}
                            <div className="luna-notes-right">
                                <div className="luna-preference-graph">
                                    <div className="luna-preference-item">
                                        <span className="luna-preference-label">여성</span>
                                        <div className="luna-preference-bar">
                                            <div className="luna-preference-fill" style={{ width: '65%', backgroundColor: '#BA55D3' }}></div>
                                        </div>
                                        <span className="luna-preference-percent">65%</span>
                                    </div>
                                    <div className="luna-preference-item">
                                        <span className="luna-preference-label">남성</span>
                                        <div className="luna-preference-bar">
                                            <div className="luna-preference-fill" style={{ width: '55%', backgroundColor: '#8A2BE2' }}></div>
                                        </div>
                                        <span className="luna-preference-percent">55%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 어울리는 순간 */}
                <section className="luna-moments">
                    <div className="luna-moments-content">
                        <div className="luna-moments-grid">
                            <div className="luna-moment-item">
                                <span className="luna-moment-number">1</span>
                                <p>별이 떠오르는 저녁 산책길</p>
                            </div>
                            <div className="luna-moment-item">
                                <span className="luna-moment-number">2</span>
                                <p>잔잔한 재즈가 흐르는 혼자만의 밤</p>
                            </div>
                            <div className="luna-moment-item">
                                <span className="luna-moment-number">3</span>
                                <p>하루를 마무리하며 켜는 침대 옆 무드등</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 추천 계절 */}
                <section className="luna-season">
                    <div className="luna-season-content">
                        <p className="luna-season-text">
                            여름밤의 바람부터 가을밤의 적막까지.<br />
                            당신의 밤을 더 깊고 아름답게 만드는 위로가 되어주는 향입니다.
                        </p>
                    </div>
                </section>

                {/* SNS 문구 */}
                <section className="luna-sns">
                    <div className="luna-sns-content">
                        <p className="luna-sns-text">
                            오늘 밤, 나를 감싸는 은은한 위로<br />
                            <span className="luna-sns-hashtags">#루나 #달빛향기 #라벤더밤</span>
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

export default LunaTheme;
