// common/CommonImageBox.js
import React from "react";
import {
    ImageBoxStyle,
    AiChip,
    BottomRightBox,
    CheckboxArea,
    CenterBox,
    EyeOnChip,
    EyeClosedChip,
    HoverTextBox, BottomRightBoxPlus, TopRightBox, AbsoluteBox
} from "./css/ImageBox.styled"
import CommonIconButton from "../common/CommonIconButton"
import { ReactComponent as EyeOnIcon } from "../assets/images/Eye.svg";
import { ReactComponent as EyeClosedIcon } from "../assets/images/EyeClosed.svg";
import { ReactComponent as AiIcon } from "../assets/images/AiIcon.svg";
import { ReactComponent as PlusIcon } from "../assets/images/PlusIcon.svg";
import { ReactComponent as MinusIcon } from "../assets/images/MinusIcon.svg";
import { ReactComponent as TrashIcon } from "../assets/images/TrashIcon.svg";
import { ReactComponent as CheckIcon } from "../assets/images/CheckIcon.svg";
import { ReactComponent as UnCheckIcon } from "../assets/images/UnCheckIcon.svg";
import {Text} from "@/common/Typography";

function CommonImageBox({
            image,
            type = "basic", // basic | hoverPlus | hoverMinus | aiPlus | removeButton | checkbox
            isChecked = false,
            showDelete = false,
            onLink,
            onPlus,
            onMinus,
            onPlusMinus,
            onDelete,
            onCheck,
            onClick,
            recommendationReason,
            item,   //Gemini 전달 값으로 사용
            index,   //Gemini 전달 값으로 사용
            setMode,
        }) {

    if (type === "basic" && onLink) {
        return (
            <a href={onLink} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                <ImageBoxStyle>
                    <img src={image} alt="가구 이미지" />

                    {recommendationReason && (
                        <HoverTextBox>
                            <Text size="sm" $weight={600} color="white">추천 이유</Text>
                            <div>
                                <Text size="xxs" $weight={600} color="white">{recommendationReason}</Text> 
                            </div>
                            
                        </HoverTextBox>
                    )}
                </ImageBoxStyle>
            </a>
        );
    }

    // type === "checkbox"
    if (type === "checkbox") {
        const content = (
            <ImageBoxStyle>
                <img src={image} alt="가구 이미지" />

                {recommendationReason && (
                    <HoverTextBox>
                        <Text size="sm" $weight={600} color="white">추천 이유</Text>
                        <div>
                            <Text size="xxs" $weight={600} color="white">{recommendationReason}</Text>
                        </div>
                    </HoverTextBox>
                )}

                <CheckboxArea
                    onClick={(e) => {
                        e.stopPropagation(); // 링크로 이동 막지 않도록 클릭만 막기
                        e.preventDefault();
                        if (onCheck) onCheck();
                    }}
                >
                    {isChecked ? <CheckIcon /> : <UnCheckIcon />}
                </CheckboxArea>
            </ImageBoxStyle>
        );

        // 링크가 있으면 <a>로 감싸기
        if (onLink) {
            return (
                <a href={onLink} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {content}
                </a>
            );
        }

        return content;
    }

    const buttonProps = {
        width: "28px",
        height: "28px",
        type: "full",
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
    }
    return (
        <ImageBoxStyle onClick={onClick} >
            <img src={image} alt="가구 이미지" />

            {/* AI Chip */}
            {type === "aiPlus" && (
                <AiChip>
                    {/*<AiIcon />*/}
                    <span>AI</span>
                </AiChip>
            )}
            {/*/!* Eye On *!/*/}
            {/*{type === "eyeOn" && (*/}
            {/*    <EyeOnChip>*/}
            {/*        <EyeOnIcon />*/}
            {/*    </EyeOnChip>*/}
            {/*)}*/}
            {/* Eye Closed */}
            {/*{type === "eyeClosed" && (*/}
            {/*    <EyeClosedChip>*/}
            {/*        <EyeClosedIcon />*/}
            {/*    </EyeClosedChip>*/}
            {/*)}*/}

            {type === "hoverPlus" && (
                <CenterBox>
                    <CommonIconButton
                        color="orange"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlusMinus();
                        }}
                        icon={<PlusIcon />}
                        {...buttonProps}
                    />
                </CenterBox>
            )}

            {type === "hoverMinus" && (
                <CenterBox>
                    <CommonIconButton
                        color="red"
                        onClick={(e) => {
                        e.stopPropagation();
                        onPlusMinus();
                        }}
                        icon={<MinusIcon />}
                        {...buttonProps}
                    />
                </CenterBox>
            )}

            {/* 하단 플러스 버튼 (aiPlus) */}
            {type === "aiPlus" && (
                <BottomRightBoxPlus>
                    <CommonIconButton onClick={onPlus} color="orange" icon={<PlusIcon />} {...buttonProps}/>
                </BottomRightBoxPlus>
            )}
            {/* 하단 마이너스 버튼 (eyeOn) */}
            {(type === "eyeOn" || type === "addFurniture") && (
                <BottomRightBox>
                    <CommonIconButton // onClick={onMinus}
                                      onClick={(e) => {
                                          e.stopPropagation(); // ✅ 공통 처리
                                          // onMinus?.(item,index);
                                          setMode("remove"); // ✅ 휴지통 클릭 시 모드 설정
                                        
                                          setTimeout(() => {
                                              if (onMinus) onMinus(item, index); // 직접 props로 넘긴 item/index 사용
                                          }, 500);

                                      }}
                                      icon={<EyeOnIcon />} {...buttonProps}/>
                </BottomRightBox>
            )}
            {/* 하단 플러스 버튼 (eyeClosed) */}
            {type === "eyeClosed" && (
                <BottomRightBox>
                    <CommonIconButton // onClick={onPlus}
                                      onClick={(e) => {
                                          e.stopPropagation(); // ✅ 공통 처리
                                          onPlus?.(e);
                                      }}
                                      icon={<EyeClosedIcon />} {...buttonProps}/>
                </BottomRightBox>
            )}

            {/*/!* 삭제 버튼 (외부 제어) *!/*/}
            {type === "removeButton" && showDelete && (
                <BottomRightBox>
                    <CommonIconButton onClick={onDelete} color="red" icon={<TrashIcon />} {...buttonProps}/>
                </BottomRightBox>
            )}
            
        </ImageBoxStyle>
    );
}

export default CommonImageBox;