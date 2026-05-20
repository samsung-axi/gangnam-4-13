import React from "react";
import LongBtn from "../../components/buttons/LongBtn";
import ShortBtn from "../../components/buttons/ShortBtn";
import RadioBtn from "../../components/buttons/RadioBtn";
import NormalInput from "../../components/input/NormalInput";
import SearchInput from "../../components/input/SearchInput";
import SearchInput2 from "../../components/input/SearchInput2";
import PromptModal from "../../components/modal/PromptModal";

const Home: React.FC = () => {
  return (
    <div>
      <LongBtn />
      <ShortBtn />
      <RadioBtn />
      <NormalInput />
      <SearchInput />
      <SearchInput2 />
      {/* <PromptModal
        title={"숙소"}
        message={"원하시는 숙소를 직접 검색하거나 예를 들어주세요."}
      /> */}
    </div>
  );
};

export default Home;
