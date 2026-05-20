import React from "react";
import {
    BudgetInput, BudgetInputGroup,
    BudgetInputWrapper, SettingRoot,
    StyleButton,
    StyleButtonWrapper
} from "./css/Setting.styled";
import {Text} from "@/common/Typography";
import { useSelector, useDispatch } from "react-redux";
import { setBudget, setSelectedStyles } from "@/features/ai/aiSlice";

function Setting() {
    const dispatch = useDispatch();
    const budget = useSelector((state) => state.ai.budget);
    const selectedStyles = useSelector((state) => state.ai.selectedStyles);

    const styleOptions = [
        "모던",
        "미니멀",
        "북유럽",
        "빈티지",
        "인더스트리얼",
        "전통",
        "엘레강스",
        "내추럴",
    ];

    // 천 단위 콤마 추가 함수
    const formatNumber = (value) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // 콤마 제거 함수
    const unformatNumber = (value) => value.replace(/,/g, "");

    const handleBudgetChange = (type, value) => {
        dispatch(setBudget({
            ...budget,
            [type]: unformatNumber(value)
        }));
    };

    const toggleStyle = (style) => {
        const updated = selectedStyles.includes(style)
            ? selectedStyles.filter((s) => s !== style)
            : [...selectedStyles, style];
        dispatch(setSelectedStyles(updated));
    };



    return(
        <SettingRoot>
            <Text size="xxs" $weight={600}>예산 금액 설정</Text>
            <BudgetInputWrapper>
                <BudgetInputGroup>
                    <Text size="xxs" $weight={600}>₩</Text>
                    <BudgetInput
                        type="text"
                        placeholder={"0"}
                        value={formatNumber(budget.min)}
                        onChange={(e) => handleBudgetChange("min", e.target.value)}
                    />
                </BudgetInputGroup>

                <Text size="xxs" $weight={600}>~</Text>

                <BudgetInputGroup>
                    <Text size="xxs" $weight={600}>₩</Text>
                    <BudgetInput
                        type="text"
                        placeholder={"0"}
                        value={formatNumber(budget.max)}
                        onChange={(e) => handleBudgetChange("max", e.target.value)}
                    />
                </BudgetInputGroup>
            </BudgetInputWrapper>

            <Text size="xxs" $weight={600}>스타일 설정</Text>
            <StyleButtonWrapper>
                {styleOptions.map((style) => (
                    <StyleButton
                        key={style}
                        $active={selectedStyles.includes(style)}
                        onClick={() => toggleStyle(style)}
                    >
                        {style}
                    </StyleButton>
                ))}
            </StyleButtonWrapper>

        </SettingRoot>
    )
}

export default Setting;