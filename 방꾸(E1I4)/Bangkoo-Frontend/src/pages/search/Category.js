import React, { useMemo } from "react";
import {CategoryBox} from "./css/SearchInput.styled";
import {Text} from "@/common/Typography";

function Category({onSearch, setCategory}) {
    const CATEGORY_ITEMS = useMemo(() => [
        { id: 1, value: "의자" },
        { id: 2, value: "가전제품" },
        { id: 3, value: "테이블" },
        { id: 4, value: "침대/매트리스" },
        { id: 5, value: "이불/베개" },
        { id: 6, value: "소파" },
        { id: 7, value: "쿠션/담요" },
        { id: 8, value: "수납" },
        { id: 9, value: "아웃도어" },
        { id: 10, value: "화분" },
        { id: 11, value: "데코" },
        { id: 12, value: "러그" },
        { id: 13, value: "조명" },
        { id: 14, value: "커버" },
        { id: 15, value: "트레이" },
        { id: 16, value: "기타" },
    ], []);

    const handleClick = (e, value) => {
        e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록
        onSearch(value);
        setCategory(false);
    };

    return (
        <CategoryBox>
            {CATEGORY_ITEMS.map((item) => (
                <Text
                    key={item.id}
                    size="sm"
                    $weight={600}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handleClick(e, item.value)}
                >
                    {item.value}
                </Text>
            ))}
        </CategoryBox>
    );
}

export default Category;