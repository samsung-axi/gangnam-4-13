import React from 'react';
import './SubscriptionTheme.css';

function SubscriptionTheme({ perfume }) {
    // 실제 향수 데이터 (향수 상세 데이터에서 가져온 정보)
    const includedPerfumes = [
        {
            id: 1,
            name: "Ether",
            koreanName: "에테르",
            description: "바람결을 닮은 투명한 향기",
            image: "/images/ether.png",
            mainAccord: "Powdery Floral",
            notes: {
                top: ["Bergamot", "Pink Pepper"],
                middle: ["Iris", "Jasmine Sambac"],
                base: ["Musk", "Cedarwood"]
            },
            tags: ["신선함", "투명함", "바람결"]
        },
        {
            id: 2,
            name: "Luna",
            koreanName: "루나",
            description: "달빛 아래 핀 보랏빛 정원",
            image: "/images/luna.png",
            mainAccord: "Woody Aromatic",
            notes: {
                top: ["Lemon", "Clary Sage"],
                middle: ["Lavender", "Violet Leaf"],
                base: ["Amber", "Vetiver"]
            },
            tags: ["로맨틱", "우아함", "달빛"]
        },
        {
            id: 3,
            name: "Nuage",
            koreanName: "누아쥬",
            description: "달콤한 복숭아의 감성",
            image: "/images/nuage.png",
            mainAccord: "Fruity Floral",
            notes: {
                top: ["Pear", "Black Currant Bud"],
                middle: ["Freesia", "Peony"],
                base: ["Vanilla", "Sandalwood"]
            },
            tags: ["달콤함", "부드러움", "복숭아"]
        }
    ];

    return (
        <div className="subscription-theme-container">
            {/* 메인 히어로 섹션 - 고정된 영역 */}
            <section className="subscription-main-section">
                <div className="subscription-hero-section">
                    <div className="subscription-hero-bg">
                        <div className="subscription-hero-overlay"></div>
                        <div className="subscription-floating-elements">
                            <div className="floating-element element-1"></div>
                            <div className="floating-element element-2"></div>
                            <div className="floating-element element-3"></div>
                            <div className="floating-element element-4"></div>
                            <div className="floating-element element-5"></div>
                        </div>
                    </div>
                    
                    <div className="subscription-hero-content">
                        <div className="subscription-badge">
                            <span className="badge-text">정기구독</span>
                        </div>
                        
                        <h1 className="subscription-main-title">
                            <span className="title-line-1">매월 찾아오는 특별한 향</span>
                        </h1>
                        
                        <p className="subscription-main-subtitle">
                            나만의 향을 찾아 떠나는 감성적인 여정
                        </p>
                        
                        <div className="subscription-hero-description">
                            <p className="hero-description-text">
                                매월 엄선된 3가지 프리미엄 향수를 10ml 샘플로 만나보세요.<br/>
                                전문가 큐레이션을 통해 당신만의 특별한 향을 발견하세요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 상세 정보 섹션 - 독립적인 영역 */}
            <section className="subscription-details-section">
                {/* 포함된 향수들 */}
                <div className="subscription-included-perfumes">
                    <div className="section-header">
                        <p className="section-subtitle">매월 이 세 가지 특별한 향수를 만나보세요</p>
                    </div>
                    
                    <div className="perfume-list">
                        {includedPerfumes.map((perfume, index) => (
                            <div key={perfume.id} className={`perfume-item ${perfume.name.toLowerCase()}`}>
                                <div className="perfume-image-container">
                                    <img 
                                        src={perfume.image} 
                                        alt={perfume.koreanName}
                                        className="perfume-image"
                                    />
                                </div>
                                <div className="perfume-info">
                                    <h4 className="perfume-name">{perfume.koreanName}</h4>
                                    <p className="perfume-description">{perfume.description}</p>
                                    <div className="perfume-accord">
                                        <span className="accord-text">{perfume.mainAccord}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 구독 혜택 */}
                <div className="subscription-benefits">
                    <div className="section-header">
                        <p className="section-subtitle">정기구독만의 특별한 혜택을 경험해보세요</p>
                    </div>
                    
                    <div className="benefits-list">
                        <div className="benefit-item">
                            <div className="benefit-icon">🎁</div>
                            <div className="benefit-content">
                                <h4 className="benefit-title">매월 새로운 향수</h4>
                                <p className="benefit-description">엄선된 10ml 샘플 3종으로 매달 새로운 감성을 만나보세요</p>
                            </div>
                        </div>
                        
                        <div className="benefit-item">
                            <div className="benefit-icon">📖</div>
                            <div className="benefit-content">
                                <h4 className="benefit-title">향수 가이드 제공</h4>
                                <p className="benefit-description">향수 노트와 스토리 카드로 더 깊이 있는 향수 여행</p>
                            </div>
                        </div>
                        
                        <div className="benefit-item">
                            <div className="benefit-icon">🔄</div>
                            <div className="benefit-content">
                                <h4 className="benefit-title">자유로운 구독 관리</h4>
                                <p className="benefit-description">언제든지 변경 및 취소가 가능합니다</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 구독 정보 */}
                <div className="subscription-info">
                    <div className="section-header">
                        <p className="section-subtitle">정기구독에 대한 자세한 정보를 확인하세요</p>
                    </div>
                    
                    <div className="info-list">
                        <div className="info-item">
                            <div className="info-icon">📅</div>
                            <div className="info-content">
                                <h4 className="info-title">배송 주기</h4>
                                <p className="info-description">매월 20일 발송</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">⚙️</div>
                            <div className="info-content">
                                <h4 className="info-title">구독 변경/취소</h4>
                                <p className="info-description">다음 달 10일까지 가능</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">🚚</div>
                            <div className="info-content">
                                <h4 className="info-title">배송비</h4>
                                <p className="info-description">무료 배송</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-icon">💧</div>
                            <div className="info-content">
                                <h4 className="info-title">포함 용량</h4>
                                <p className="info-description">10ml × 3개</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SubscriptionTheme;
