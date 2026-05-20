import React from "react";
import { HomeRoot } from "./css/Home.styled";
import Banner from "./Banner";
import Header from "@/components/layout/header/Header";
import StepComponent from "./StepComponent";
import StartComponent from "./StartComponent";
import Step1 from "@/assets/images/Step1.png";
import Step2 from "@/assets/images/Step2.png";
import Step3 from "@/assets/images/Step3.png";
import Step4 from "@/assets/images/Step4.png";
import Step5 from "@/assets/images/Step5.png";

function Home() {
  return (
    <HomeRoot>
      <Header />
      <Banner />
      <StepComponent
        image={Step1}
        step={"STEP 1."}
        title={"내 방 사진 업로드하기"}
        text={
          <span>
            스마트폰이나 컴퓨터에서 내 방 사진을 업로드하세요. <br />
            AI가 사진을 분석하여 방 안에 있는
            <br />
            가구들을 자동으로 인식해요.
          </span>
        }
      />
      <StepComponent
        image={Step2}
        type={"bk"}
        step={"STEP 2."}
        title={
          <span>
            가구 선택하고
            <br />
            자유롭게 이동하거나 삭제하기
          </span>
        }
        text={
          <span>
            사진 속 가구를 클릭하면 선택할 수 있어요.
            <br />
            선택한 가구는 마우스로 드래그해서 이동하거나,
            <br />
            삭제할 수 있어요.
          </span>
        }
      />
      <StepComponent
        image={Step3}
        step={"STEP 3."}
        title={"AI에게 어울리는 가구 추천받기"}
        text={
          <span>
            AI가 방의 분위기와 공간을 분석해 가장
            <br />
            잘 어울리는 가구를 추천해줘요.
            <br />
            또한 직접 원하는 가구를 검색해서 선택할 수도 있어요.
          </span>
        }
      />
      <StepComponent
        image={Step4}
        type={"bk"}
        step={"STEP 4."}
        title={"가구 추가하고 마음껏 배치 변경하기"}
        text={
          <span>
            마음에 드는 가구를 추가하고,
            <br />
            자유롭게 원하는 위치로 배치해보세요.
            <br />
            기존 가구를 삭제하거나 다시 옮기는 것도
            <br />
            물론 가능해요. 나만의 스타일로 방을 꾸며보세요.
          </span>
        }
      />
      <StepComponent
        image={Step5}
        step={"STEP 5."}
        title={"완성된 결과 저장하기"}
        text={
          <span>
            모든 편집이 끝났다면 결과를 저장하세요.
            <br />
            변경된 인테리어는 이미지로 저장됩니다.
          </span>
        }
      />

      <StartComponent />
    </HomeRoot>
  );
}
export default Home;
