import { useState, useEffect } from 'react'
import '../styles/IntroAnimation.css'

const IntroAnimation = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true)
    const [isAnimating, setIsAnimating] = useState(true)

    useEffect(() => {
        // 3초 후 페이드아웃 시작
        const fadeOutTimer = setTimeout(() => {
            setIsAnimating(false)
        }, 3000)

        // 4초 후 완전히 제거
        const removeTimer = setTimeout(() => {
            setIsVisible(false)
            if (onComplete) {
                onComplete()
            }
        }, 4000)

        return () => {
            clearTimeout(fadeOutTimer)
            clearTimeout(removeTimer)
        }
    }, [onComplete])

    if (!isVisible) return null

    return (
        <div className={`intro-animation ${!isAnimating ? 'fade-out' : ''}`}>
            <div className="intro-content">
                <h1 className="intro-text">
                    <span className="intro-word intro-word-1">Marry</span>
                    <span className="intro-word intro-word-2">day</span>
                </h1>

                {/* 선 그리기 애니메이션 - 큰 폭의 물결 모양 */}
                <svg className="intro-line-svg" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
                    {/* 넓고 부드러운 물결 곡선 */}
                    <path
                        className="intro-line-full"
                        d="M 50 175 
               Q 200 80, 350 175 
               Q 500 270, 650 175
               Q 700 150, 750 120"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* 그라데이션 정의 */}
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f8b4d9" />
                            <stop offset="50%" stopColor="#f5a5ce" />
                            <stop offset="100%" stopColor="#a8d5e2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    )
}

export default IntroAnimation

