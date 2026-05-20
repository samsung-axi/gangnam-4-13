// 최초 작성자: 김병훈
// 내 가구에서 추가된 가구를 삭제하기 위함

import { useState, useEffect } from 'react';

// 아이템을 관리하는 커스텀 훅
function useFurnitureItems(initialFurnitureList = []) {
    const [furnitureItems, setFurnitureItems] = useState(initialFurnitureList);

    // ✅ initialFurnitureList가 바뀔 때마다 업데이트
    useEffect(() => {
        setFurnitureItems(initialFurnitureList);
    }, [initialFurnitureList]);

    const handleminus = (itemImage) => {
        const updatedList = furnitureItems.filter(item => item.image !== itemImage);
        setFurnitureItems(updatedList);
    };

    return {
        furnitureItems,
        handleminus
    };
}

export default useFurnitureItems;
