import { useState, useEffect, useRef } from 'react'
import '../styles/CustomResult.css'

const CustomResult = ({ resultImage, isProcessing, onProcess }) => {
    const [showCheckmark, setShowCheckmark] = useState(false)
    const prevProcessingRef = useRef(isProcessing)

    // 매칭 완료 감지
    useEffect(() => {
        if (prevProcessingRef.current && !isProcessing && resultImage) {
            // 로딩이 끝나고 결과 이미지가 있을 때
            setShowCheckmark(true)
            const timer = setTimeout(() => {
                setShowCheckmark(false)
            }, 1500) // 1.5초 후 사라짐
            return () => clearTimeout(timer)
        }
        prevProcessingRef.current = isProcessing
    }, [isProcessing, resultImage])

    return (
        <div className="custom-result">
            <h3 className="result-title">매칭 결과</h3>
            <div className={`result-container ${resultImage ? 'has-result' : ''}`}>
                {!resultImage && !isProcessing ? (
                    <div className="result-placeholder">
                        <div className="placeholder-icon">✨</div>
                        <p className="placeholder-text">전신사진과 드레스를 업로드하세요</p>
                        <p className="placeholder-subtext">AI가 자동으로 매칭해드립니다</p>
                    </div>
                ) : isProcessing ? (
                    <div className="processing-container">
                        <div className="spinner"></div>
                        <p className="processing-text">AI 매칭 중...</p>
                        <p className="processing-subtext">잠시만 기다려주세요</p>
                    </div>
                ) : showCheckmark ? (
                    <div className="processing-container">
                        <div className="completion-icon">✓</div>
                        <p className="processing-text">매칭완료</p>
                    </div>
                ) : (
                    <div className="result-image-container">
                        <img src={resultImage} alt="Matching Result" className="result-image" />
                        {!isProcessing && resultImage && (
                            <button
                                className="download-button"
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    try {
                                        // Base64 이미지인 경우 바로 다운로드
                                        if (resultImage.startsWith('data:')) {
                                            const link = document.createElement('a')
                                            link.href = resultImage
                                            link.download = 'custom_match_result.png'
                                            document.body.appendChild(link)
                                            link.click()
                                            document.body.removeChild(link)
                                        } else {
                                            // 외부 URL인 경우 fetch로 blob 변환 후 다운로드
                                            const response = await fetch(resultImage)
                                            const blob = await response.blob()
                                            const url = window.URL.createObjectURL(blob)
                                            const link = document.createElement('a')
                                            link.href = url
                                            link.download = 'custom_match_result.png'
                                            document.body.appendChild(link)
                                            link.click()
                                            document.body.removeChild(link)
                                            window.URL.revokeObjectURL(url)
                                        }
                                    } catch (err) {
                                        console.error('다운로드 실패:', err)
                                        alert('다운로드에 실패했습니다. 다시 시도해주세요.')
                                    }
                                }}
                                title="결과 이미지를 다운로드"
                            >
                                ⬇ 다운로드
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomResult

