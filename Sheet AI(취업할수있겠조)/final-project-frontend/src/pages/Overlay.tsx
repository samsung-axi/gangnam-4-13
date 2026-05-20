import React from 'react';

interface Props {
  setRightPanelActive: (val: boolean) => void;
}

export default function Overlay({ setRightPanelActive }: Props) {
  return (
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>이미 가입한 회원이시라면,<br />로그인 후 더 많은 서비스를 이용할 수 있습니다.</p>
          <button className="panel-btn" onClick={() => setRightPanelActive(false)}>로그인</button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>아직 회원이 아니신가요?<br />가입 후 더 많은 서비스를 이용할 수 있습니다.</p>
          <button className="panel-btn" onClick={() => setRightPanelActive(true)}>회원가입</button>
        </div>
      </div>
    </div>
  );
}
