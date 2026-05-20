import { useState, useEffect, useRef } from 'react'
import '../styles/VideoBackground.css'

const VideoBackground = ({ onNavigateToFitting, skipIntro = false }) => {
    const [isVisible, setIsVisible] = useState(skipIntro)
    const videoRef = useRef(null)

    useEffect(() => {
        // skipIntro가 true면 바로 표시, 아니면 인트로 후 표시
        if (skipIntro) {
            setIsVisible(true)
            return
        }

        // 인트로가 끝난 후 동영상 표시 (3.5초 후)
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 3500)

        return () => clearTimeout(timer)
    }, [skipIntro])

    // 비디오가 로드되면 재생 속도 설정 및 재생
    useEffect(() => {
        const video = videoRef.current
        if (!video || !isVisible) return

        const handleLoadedMetadata = () => {
            video.playbackRate = 0.5 // 절반 속도로 느리게 재생
            video.play().catch(err => console.error('Video play error:', err))
        }

        // 이미 메타데이터가 로드된 경우
        if (video.readyState >= 1) {
            handleLoadedMetadata()
        } else {
            video.addEventListener('loadedmetadata', handleLoadedMetadata)
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
    }, [isVisible])

    if (!isVisible) return null

    return (
        <div className="video-background">
            <video
                ref={videoRef}
                className="video-background-video"
                muted
                loop
                playsInline
            >
                <source src="/Image/Main-video.mp4" type="video/mp4" />
            </video>
            <div className="video-background-overlay"></div>
            <div className={`video-text-overlay ${skipIntro ? 'no-delay' : ''}`}>
                <h1 className="video-text-line1">입어보지 않아도, 느껴지는 설렘</h1>
                <h2 className="video-text-line2">AI가 완성하는 나만의 웨딩드레스 피팅룸</h2>
                <button className="video-fitting-button" onClick={onNavigateToFitting}>
                    피팅하러 가기
                </button>
            </div>
        </div>
    )
}

export default VideoBackground

