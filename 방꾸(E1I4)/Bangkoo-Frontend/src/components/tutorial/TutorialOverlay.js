import React from "react";
import {
    TooltipWrapper,
    TooltipBubble,
} from "./css/TutorialOverlay.styled";

function TutorialOverlay({ message, position = {}, arrowDirection = "down", arrowLeft  }) {
    const safeTop = position?.top ?? 0;
    const safeLeft = position?.left ?? 0;

    return (
        <TooltipWrapper $top={safeTop} $left={safeLeft}>
            <TooltipBubble $direction={arrowDirection} $arrowLeft={arrowLeft}>
                {message}
            </TooltipBubble>


        </TooltipWrapper>
    );
}

export default TutorialOverlay;
