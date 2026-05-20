import React from "react";
import GitHubLogo from "./../../assets/svg/GitHub_Invertocat_Light.svg";
import HuggingFaceLogo from "./../../assets/svg/hf-logo.svg";
import "./../../assets/css/all.css";
import "./../../assets/css/Common/footer.css";
import { MdMargin } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 왼쪽: 회사 정보 */}
        <div className="footer-section info">
          <h4>
            <a href="https://gorani.world" rel="noopener noreferrer">
              고라니 AI 번역
            </a>
          </h4>
          <p>

            <a href="https://github.com/Tension-Hi-media" target="_blank" rel="noopener noreferrer">
              <img src={GitHubLogo} alt="GitHub Logo" width="30" />
              GORANI GitHub
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="https://huggingface.co/lucian1120/gorani-3.1-8B-4bit" target="_blank" rel="noopener noreferrer">
              <img className="huggingface-logo" src={HuggingFaceLogo} alt="Hugging Face Logo" width="30" />
              GORANI Hugging Face
            </a>
          </p>
          <p>
            팀장: <a>임현성</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            팀원: 
            <a>노태윤</a> 
            <a>배하은</a> 
            <a>이현승</a> 
            <a>지동현</a>
          </p>
        </div>
      </div>

      {/* 하단 섹션: 저작권 표시 */}
      <div className="footer-bottom">
        <p>ⓒ 2025 WWW.GORANI.WORLD. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
