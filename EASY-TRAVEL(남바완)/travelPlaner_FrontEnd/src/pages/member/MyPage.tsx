import React from 'react'
import styles from "./MyPage.module.css"; 
import { Link } from 'react-router-dom'

function MyPage() {
  return (
    <div className={styles.mypage_container}>
        <div className='mypage-title'>
            <h2>마이페이지</h2>
        </div>
        <div className='mypage-info-container'>
            <div className='mypage-info-nav'>
                <div className='mypage-info-title'>
                    <h3>정보수정</h3>
                </div>
                <div className=''> 
                    <Link to='...'>수정하기</Link>
                </div>
            </div>
            <div className='mypage-info-content'>
                <div className='mapage-info-header'>
                    <img></img>
                    <div>
                        <p>홍길동</p>
                        <p>qwerasdf@<br/>google.com</p>
                    </div>
                </div>
                <div className='mapage-info-details'>
                    <p><img src='public\icons\badge_24dp_999999_FILL0_wght400_GRAD0_opsz24.png'></img>홍길동 </p>
                    <p><img src='public\icons\mail_24dp_999999_FILL0_wght400_GRAD0_opsz24.png'></img>qwerasdf@google.com</p>
                    <p><img src='public\icons\phone_iphone_24dp_999999_FILL0_wght400_GRAD0_opsz24.png'></img>010-1234-5678</p>
                </div>
            </div>
        </div>
        <div className='mypage-plan-container'>
            <div className='mypage-plan-nav'>
                <Link to='...'>계획보러가기<img src='public\icons\chevron_right_24dp_434343_FILL0_wght400_GRAD0_opsz24.png'></img> </Link>
            </div>
        </div>
    </div>
  )
}

export default MyPage
