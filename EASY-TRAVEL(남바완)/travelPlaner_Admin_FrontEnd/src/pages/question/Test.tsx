import React from 'react';
import styles from './Test.module.scss';

const Test: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SCSS 모듈 테스트</h1>
      <p className={styles.description}>이 텍스트의 스타일이 적용되면 SCSS 모듈이 작동하는 것입니다.</p>
      <button className={styles.button}>테스트 버튼</button>
    </div>
  );
};

export default Test;

