import React from "react";

const HeaderWelcome = ({ isLoggedIn, userName, remainingTime }) => {
  return (
    <div style={styles.container}>
      {isLoggedIn ? (
        <>
          <span style={styles.welcomeMessage}>{userName}님, 환영합니다!</span>
          <span style={styles.remainingTime}>
            남은 시간: {Math.floor(remainingTime / 60)}분 {remainingTime % 60}초
          </span>
        </>
      ) : (
        <span style={styles.welcomeMessage}></span>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: "10px",
  },
  welcomeMessage: {
    color: "#fff",
    fontSize: "14px",
  },
  remainingTime: {
    color: "#ffcc00",
    fontSize: "12px",
  },
};

export default HeaderWelcome;
