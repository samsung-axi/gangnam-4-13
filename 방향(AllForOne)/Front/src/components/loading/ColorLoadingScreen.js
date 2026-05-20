import React from "react";
import styles from "../../css/components/ColorLoadingScreen.module.css";

const ColorLoadingScreen = ({ loadingText }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.loadingContainer}>
                <div className={styles.perfumeBottle}></div>
                <div className={styles.rotatingCircle}></div>
                <div className={styles.loadingText}>{loadingText}</div>
            </div>
        </div>
    );
};

export default ColorLoadingScreen;