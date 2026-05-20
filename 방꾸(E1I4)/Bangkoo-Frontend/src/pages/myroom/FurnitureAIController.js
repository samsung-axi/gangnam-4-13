import React, {useState} from "react";
import {AIControllerBox, AISearchButton, SearchTooltip} from "./css/MyRoom.styled";
import CommonButton from "@/common/CommonButton";
import { ReactComponent as SearchIcon } from "@/assets/images/SearchIcon.svg";
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";
import {Text} from "@/common/Typography";
import CommonIconButton from "@/common/CommonIconButton";

function FurnitureAIController({settingClick, onSearchClick, tutorialStep, setTutorialStep}) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    const handleCloseTooltip = () => {
        setIsTooltipVisible(false);
    };

    return (
        <AIControllerBox>
            <CommonButton
                width="135px"
                height="44px"
                fontSize="xs"
                fontWeight="800"
                radius="sm"
                type="fill"
                onClick={settingClick}
            >
                AI 추천 조건
            </CommonButton>

            {isTooltipVisible &&
                <SearchTooltip>
                    <div>
                        <Text size="xs" $weight={800} color="white">가구 검색</Text>
                        <CommonIconButton
                            width="20px"
                            height="20px"
                            color="orange"
                            icon={<CloseIcon/>}
                            onClick={handleCloseTooltip}
                        />
                    </div>

                    <Text size="xxs" $weight={500} color="white">
                        검색 버튼을 누르시면 원하는 가구를<br />
                        검색 또는 AI 검색을 할 수 있습니다.
                    </Text>
                </SearchTooltip>
            }


            <AISearchButton
                className="search-button"
                onClick={() => {
                    onSearchClick();
                    if (tutorialStep === "3.1") {
                        setTutorialStep("3.2");
                    }
                }}
            >
                <SearchIcon/>
                검색
            </AISearchButton>

        </AIControllerBox>
    );
}

export default FurnitureAIController;