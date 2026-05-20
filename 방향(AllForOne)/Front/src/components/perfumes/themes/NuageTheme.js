import React from 'react';
import './NuageTheme.css';

/**
 * 누아쥬 테마 상세 내용 컴포넌트
 * 살며시 내려앉는 핑크빛 구름처럼, 따뜻하고 부드러운 위로의 감성적인 상세 페이지
 */
function NuageTheme({ perfume }) {
    console.log('NuageTheme 렌더링됨, perfume:', perfume);
    return (
        <>
            {/* 메인 이미지 영역 - 고정된 높이 */}
            <div className="nuage-main-section">
                {/* 메인 히어로 섹션 */}
                <section className="nuage-hero">
                    <div className="nuage-hero-bg">
                        <img src="/images/nuage-main.png" alt="누아쥬 메인 이미지" className="nuage-main-image" />
                        <div className="nuage-hero-overlay">
                            <div className="nuage-hero-content">
                                <h2 className="nuage-subtitle">Nuage by Banghyang Eau de Parfum</h2>
                                <p className="nuage-tagline">살며시 내려앉는 핑크빛 구름처럼, 따뜻하고 부드러운 위로</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UVP 섹션 */}
                <section className="nuage-uvp">
                    <div className="nuage-uvp-content">
                        <p className="nuage-uvp-text">
                            프랑스어로 '구름' 당신의 하루를 부드럽게 감싸 안는, 달콤하고 포근한 향입니다.
                        </p>
                    </div>
                </section>

                {/* 감성 제품 설명 */}
                <section className="nuage-description">
                    <div className="nuage-description-content">
                        <div className="nuage-description-text">
                            <p>
                                누아쥬는 사랑스러운 따스함을 담은 향기입니다.<br />
                                햇살이 드는 오후, 크림 빛 담요에 몸을 맡기듯 포근한 감정이 차오르고,
                            </p>
                            <p>
                                배와 블랙커런트 버드의 상큼한 첫 향은<br />
                                마치 잘 익은 과일을 한 입 베어문 듯 기분 좋은 달콤함으로 시작됩니다.
                            </p>
                            <p>
                                그 뒤를 잇는 프리지아와 작약은 가벼운 꽃잎처럼 공기 중에 흩날리며,<br />
                                바닐라와 샌달우드의 잔향은 마치 따뜻한 손길처럼 피부에 남습니다.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* 감성 제품 설명 결론 */}
            <section className="nuage-description-conclusion">
                <div className="nuage-description-conclusion-content">
                    <p className="nuage-description-conclusion-text">
                        추운 계절, 따뜻한 목도리처럼 마음을 감싸주며 소중한 사람과의 순간을 더욱 다정하게 만듭니다.
                    </p>
                </div>
            </section>

            {/* 향조 정보 이후 섹션들 - 독립적인 영역 */}
            <div className="nuage-details-section">
                {/* 향조 정보 */}
                <section className="nuage-notes">
                    <div className="nuage-notes-content">
                        <div className="nuage-notes-layout">
                            {/* 왼쪽: 노트 정보 */}
                            <div className="nuage-notes-left">
                                {/* Top Note */}
                                <div className="nuage-note-item">
                                    <h4 className="nuage-note-title">Top Note</h4>
                                    <div className="nuage-note-graph">
                                        <div className="nuage-graph-bar">
                                            <div className="nuage-graph-segment" style={{width: '40%', backgroundColor: '#FFB6C1'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '30%', backgroundColor: '#FFC0CB'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '20%', backgroundColor: '#FFD1DC'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '10%', backgroundColor: '#FFE4E1'}}></div>
                                        </div>
                                        <div className="nuage-graph-labels">
                                            <span>배</span>
                                            <span>블랙커런트</span>
                                            <span>사과</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Note */}
                                <div className="nuage-note-item">
                                    <h4 className="nuage-note-title">Middle Note</h4>
                                    <div className="nuage-note-graph">
                                        <div className="nuage-graph-bar">
                                            <div className="nuage-graph-segment" style={{width: '50%', backgroundColor: '#FFB6C1'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '30%', backgroundColor: '#FFC0CB'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '20%', backgroundColor: '#FFD1DC'}}></div>
                                        </div>
                                        <div className="nuage-graph-labels">
                                            <span>프리지아</span>
                                            <span>작약</span>
                                            <span>기타</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Base Note */}
                                <div className="nuage-note-item">
                                    <h4 className="nuage-note-title">Base Note</h4>
                                    <div className="nuage-note-graph">
                                        <div className="nuage-graph-bar">
                                            <div className="nuage-graph-segment" style={{width: '55%', backgroundColor: '#FFB6C1'}}></div>
                                            <div className="nuage-graph-segment" style={{width: '45%', backgroundColor: '#FFC0CB'}}></div>
                                        </div>
                                        <div className="nuage-graph-labels">
                                            <span>바닐라</span>
                                            <span>샌달우드</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽: 성별 선호도 */}
                            <div className="nuage-notes-right">
                                <div className="nuage-preference-graph">
                                    <div className="nuage-preference-item">
                                        <span className="nuage-preference-label">여성</span>
                                        <div className="nuage-preference-bar">
                                            <div className="nuage-preference-fill" style={{width: '85%', backgroundColor: '#FFB6C1'}}></div>
                                        </div>
                                        <span className="nuage-preference-percent">85%</span>
                                    </div>
                                    <div className="nuage-preference-item">
                                        <span className="nuage-preference-label">남성</span>
                                        <div className="nuage-preference-bar">
                                            <div className="nuage-preference-fill" style={{width: '35%', backgroundColor: '#FF69B4'}}></div>
                                        </div>
                                        <span className="nuage-preference-percent">35%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 어울리는 순간 */}
                <section className="nuage-moments">
                    <div className="nuage-moments-content">
                        <div className="nuage-moments-grid">
                            <div className="nuage-moment-item">
                                <span className="nuage-moment-number">1</span>
                                <p>푹신한 이불 속 느긋한 일요일 아침</p>
                            </div>
                            <div className="nuage-moment-item">
                                <span className="nuage-moment-number">2</span>
                                <p>카페에서 나누는 따뜻한 대화</p>
                            </div>
                            <div className="nuage-moment-item">
                                <span className="nuage-moment-number">3</span>
                                <p>추운 날, 좋아하는 니트 입는 순간</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 추천 계절 */}
                <section className="nuage-season">
                    <div className="nuage-season-content">
                        <p className="nuage-season-text">
                            가을의 노을부터 겨울의 따뜻한 실내까지.<br />
                            차가운 바람 속에서도 당신만의 포근함을 잃지 않도록,<br />
                            누아쥬는 감정을 감싸는 부드러운 구름이 됩니다.
                        </p>
                    </div>
                </section>

                {/* SNS 문구 */}
                <section className="nuage-sns">
                    <div className="nuage-sns-content">
                        <p className="nuage-sns-text">
                            기분 좋은 나른함,<br />
                            <span className="nuage-sns-hashtags">#누아쥬 #핑크빛위로 #포근한향기</span>
                        </p>
                    </div>
                </section>
            </div>
        </>
    );
}

export default NuageTheme;
