import React, {useState, useEffect} from "react";
import { 
    Backdrop,
    Modal,
    Message, 
    ButtonGroup,
    SkipBox
} from "./css/Tutorial.styled";
import CommonButton from "../../common/CommonButton";

const buttonProps = {
    width:"90px",
    height: "40px",
    fontSize: "xs",
    fontWeight: 600
};

function TutorialStart({ onStart, onSkip }) {
    // 마지막 띄어쓰기 꼭 하기
    const fullText = "방꾸의 기능을 한번에 익힐 수 있는 간단한 튜토리얼이에요.\n함께 시작해볼까요? ";
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        setDisplayedText("");
        setIsComplete(false);

        const speed = 50;
        const interval = setInterval(() => {
            if (index >= fullText.length) {
                clearInterval(interval);
                setIsComplete(true);
                return;
            }
            const nextChar = fullText.charAt(index);
            setDisplayedText((prev) => prev + nextChar);
            index++;
        }, speed);

        return () => clearInterval(interval);
    }, [fullText]);

    return (
        <>
            <Backdrop />
            <Modal>
                <Message className={!isComplete ? "typing" : ""}>
                    {displayedText.split("\n").map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </Message>
                {isComplete && (
                    <ButtonGroup>
                        <CommonButton
                            onClick={onStart}
                            children={"시작하기"}
                            {...buttonProps}
                        />
                    </ButtonGroup>
                )}
            </Modal>
            <SkipBox>
                <CommonButton
                    bgColor={"grey"}
                    onClick={onSkip}
                    children={"Skip"}
                    {...buttonProps}
                />
            </SkipBox>
        </>
    );
}

export default TutorialStart;
