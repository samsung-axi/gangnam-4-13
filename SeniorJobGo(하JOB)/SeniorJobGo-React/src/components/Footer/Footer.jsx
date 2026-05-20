import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>
          (06615) 서울특별시 서초구 강남대로 405, 통영빌딩 2층<br />
          AIX-II © 2025 SeniorJobGo. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;