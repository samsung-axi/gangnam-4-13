const perfumeData = [
    {
        id: 1,
        name: "N°5 EDP",
        koreanName: "넘버5 오 드 퍼퓸",
        brand: "CHANEL",
        koreanBrand: "샤넬",
        grade: "Eau de Parfum",
        description: "생동감 넘치면서도 부드럽게 다가오는 플로럴 향",
        ingredients: "경제수, 로즈, 부틸페닐메틸프로피오날, 시트랄, 시트로넬올, 제라니올, 리날룰, 리모넨, 벤질벤조에이트, 벤질살리실레이트, 알파-이소메틸이오논",
        mainAccord: "플로럴",
        sizeOption: "50ml, 100ml",
        categoryId: 1,
        imageUrls: [
            "https://cf.bysuco.net/7a0245b5fa94add4f3c26de364e3fb38.jpg?w=600",
            "https://www.chanel.com/puls-img/1728556271651-onepdpeditopushdesktopmobile01974x1298px2jpg_1299x974.jpg"
        ],
        reviews: {
            expert: [
                {
                    id: 1,
                    reviewer: "김민서 조향사",
                    content: "20세기를 대표하는 향수로, 알데하이드의 혁신적인 사용과 풍부한 플로럴 노트의 조화가 돋보입니다."
                },
                {
                    id: 2,
                    reviewer: "이지원 조향사",
                    content: "현대 향수의 기준을 제시한 타임리스한 작품. 장미와 일랑일랑의 완벽한 밸런스가 인상적입니다."
                },
                {
                    id: 3,
                    reviewer: "박준영 조향사",
                    content: "클래식한 우아함과 현대적 감성이 조화롭게 어우러진 마스터피스입니다."
                }
            ],
            user: [
                {
                    id: 1,
                    reviewer: "김서연",
                    content: "특별한 날에 사용하기 좋은 향수예요. 은은하면서도 고급스러운 향이 너무 좋습니다."
                },
                {
                    id: 2,
                    reviewer: "이하은",
                    content: "오래 지속되는 향이 매력적이에요. 주변에서도 향이 좋다고 자주 물어보세요."
                },
                {
                    id: 3,
                    reviewer: "박지민",
                    content: "클래식한 향이지만 세련된 느낌이 들어요. 정말 만족스러운 구매였습니다."
                },
                {
                    id: 4,
                    reviewer: "최유진",
                    content: "샤넬의 대표작다운 고급스러운 향. 특별한 날마다 사용하고 있어요."
                },
                {
                    id: 5,
                    reviewer: "정다은",
                    content: "선물로 받았는데 정말 좋아요. 오래 사용할 수 있을 것 같습니다."
                }
            ]
        }
    },
    {
        id: 2,
        name: "J'adore",
        koreanName: "자도르",
        brand: "DIOR",
        koreanBrand: "디올",
        grade: "Eau de Parfum",
        description: "매혹적인 플로럴 부케향의 여성스러운 향수",
        ingredients: "베르가못, 메론, 피치, 리날룰, 시트랄, 제라니올, 리모넨, 시트로넬올, 파네솔, 벤질벤조에이트",
        mainAccord: "플로럴",
        sizeOption: "30ml, 50ml, 100ml",
        imageUrls: [
            "https://m.perfumegraphy.com/web/product/big/202108/6e2ac5f567cb1d6dd5c81e3ea696420a.jpg"
        ],
        reviews: {
            expert: [
                {
                    id: 1,
                    reviewer: "최서아 조향사",
                    content: "현대적인 여성미를 표현한 세련된 플로럴 향. 과일향과 꽃향의 조화가 뛰어납니다."
                },
                {
                    id: 2,
                    reviewer: "강민준 조향사",
                    content: "디올의 정수를 담아낸 향수. 화사하면서도 우아한 향이 매력적입니다."
                },
                {
                    id: 3,
                    reviewer: "윤서진 조향사",
                    content: "밝고 경쾌한 톤의 플로럴 향이 매력적인 현대적 명작입니다."
                }
            ],
            user: [
                {
                    id: 1,
                    reviewer: "송지은",
                    content: "데일리로 사용하기 좋은 향수예요. 부담스럽지 않고 은은해요."
                },
                {
                    id: 2,
                    reviewer: "임수빈",
                    content: "봄, 여름에 사용하기 좋아요. 화사한 느낌이 너무 좋습니다."
                },
                {
                    id: 3,
                    reviewer: "한지우",
                    content: "여성스러운 향이 너무 좋아요. 특별한 날에 사용하기 좋습니다."
                },
                {
                    id: 4,
                    reviewer: "오유나",
                    content: "선물로 받았는데 너무 만족스러워요. 지속력도 좋습니다."
                },
                {
                    id: 5,
                    reviewer: "신예진",
                    content: "결혼식때 사용했는데 분위기와 너무 잘 어울렸어요."
                }
            ]
        }
    },
    {
        id: 3,
        name: "Light Blue",
        koreanName: "라이트 블루",
        brand: "DOLCE&GABBANA",
        koreanBrand: "돌체앤가바나",
        grade: "Eau de Toilette",
        description: "시칠리아의 청량감이 느껴지는 상쾌한 시트러스향",
        ingredients: "시칠리안 레몬, 그린 애플, 리날룰, 시트랄, 리모넨, 제라니올, 시트로넬올, 쿠마린, 알파-이소메틸이오논",
        mainAccord: "시트러스",
        sizeOption: "25ml, 50ml, 100ml",
        imageUrls: [
            "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0019/A00000019178901ko.jpg?qt=80"
        ],
        reviews: {
            expert: [
                {
                    id: 1,
                    reviewer: "이현우 조향사",
                    content: "지중해의 싱그러움을 담아낸 향수. 시트러스와 우디 노트의 밸런스가 완벽합니다."
                },
                {
                    id: 2,
                    reviewer: "김도윤 조향사",
                    content: "여름철 데일리 향수로 최고. 상쾌하면서도 고급스러운 향이 매력적입니다."
                },
                {
                    id: 3,
                    reviewer: "장서현 조향사",
                    content: "시칠리아 레몬의 청량감이 돋보이는 향수. 무더운 여름에 제격입니다."
                }
            ],
            user: [
                {
                    id: 1,
                    reviewer: "김민지",
                    content: "첫 향수로 구매했는데 너무 만족스러워요. 상큼한 향이 좋아요."
                },
                {
                    id: 2,
                    reviewer: "이준호",
                    content: "여름에 쓰기 딱 좋은 향수입니다. 시원한 느낌이 너무 좋아요."
                },
                {
                    id: 3,
                    reviewer: "박소현",
                    content: "데일리로 사용하기 좋아요. 부담스럽지 않은 향입니다."
                },
                {
                    id: 4,
                    reviewer: "정우진",
                    content: "시트러스 향수 중에서 가장 좋아하는 제품이에요."
                },
                {
                    id: 5,
                    reviewer: "최예린",
                    content: "남자친구가 선물해줬는데 너무 좋아요. 지속력도 괜찮습니다."
                }
            ]
        }
    }
];

export default perfumeData;