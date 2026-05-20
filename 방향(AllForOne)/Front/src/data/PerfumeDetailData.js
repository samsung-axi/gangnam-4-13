/**
 * 향수 상세페이지 데이터
 * 각 향수마다 다른 테마와 정보를 제공합니다.
 */

export const perfumeDetailData = {
    1: {
        id: 1,
        name: "Luna by Banghyang Eau de Parfum",
        koreanName: "루나 바이 방향 오 드 퍼퓸",
        brand: "Banghyang",
        mainAccord: "Woody Aromatic",
        mainNote: "Lavender, Violet Leaf",
        volume: "100ml",
        price: 145000,
        image: "/images/luna.png",
        description: "달빛처럼 은은하고 우아한 향수",
        notes: {
            top: ["Lemon", "Clary Sage"],
            middle: ["Lavender", "Violet Leaf"],
            base: ["Amber", "Vetiver"]
        },
        theme: "luna",
        colorScheme: {
            primary: "#8B5CF6",
            secondary: "#DDD6FE",
            accent: "#FEF3C7",
            background: "linear-gradient(135deg, #fef3c7, #ddd6fe, #d1d5db)"
        }
    },
    2: {
        id: 2,
        name: "Éther by Banghyang Eau de Parfum",
        koreanName: "에테르 바이 방향 오 드 퍼퓸",
        brand: "Banghyang",
        mainAccord: "Powdery Floral",
        mainNote: "Iris, Jasmine Sambac",
        volume: "75ml",
        price: 89000,
        image: "/images/ether.png",
        description: "에테르처럼 순수하고 신비로운 향수",
        notes: {
            top: ["Bergamot", "Pink Pepper"],
            middle: ["Iris", "Jasmine Sambac"],
            base: ["Musk", "Cedarwood"]
        },
        theme: "ether",
        colorScheme: {
            primary: "#3B82F6",
            secondary: "#DBEAFE",
            accent: "#FEF3C7",
            background: "linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd)"
        }
    },
    3: {
        id: 3,
        name: "Nuage by Banghyang Eau de Parfum",
        koreanName: "누아쥬 바이 방향 오 드 퍼퓸",
        brand: "Banghyang",
        mainAccord: "Fruity Floral",
        mainNote: "Freesia, Peony",
        volume: "50ml",
        price: 72000,
        image: "/images/nuage.png",
        description: "구름처럼 부드럽고 로맨틱한 향수",
        notes: {
            top: ["Pear", "Black Currant Bud"],
            middle: ["Freesia", "Peony"],
            base: ["Vanilla", "Sandalwood"]
        },
        theme: "nuage",
        colorScheme: {
            primary: "#EC4899",
            secondary: "#FCE7F3",
            accent: "#FEF3C7",
            background: "linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4)"
        }
    }
};

/**
 * 향수 ID로 상세 정보를 가져오는 함수
 * @param {number} id - 향수 ID
 * @returns {Object|null} 향수 상세 정보 또는 null
 */
export const getPerfumeDetail = (id) => {
    return perfumeDetailData[id] || null;
};

/**
 * 모든 향수 상세 정보를 가져오는 함수
 * @returns {Array} 모든 향수 상세 정보 배열
 */
export const getAllPerfumeDetails = () => {
    return Object.values(perfumeDetailData);
};
