import { useState, useRef, useEffect } from 'react'
import '../styles/ImageUpload.css'

const ImageUpload = ({ onImageUpload, uploadedImage, onDressDropped, isProcessing, onImageUploadRequired, canDownload = false, resultImage = null }) => {
    const [preview, setPreview] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [showCheckmark, setShowCheckmark] = useState(false)
    const fileInputRef = useRef(null)
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

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFile(file)
        }
    }

    const handleFile = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
            onImageUpload(file)
        }
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()

        // preview-container를 실제로 벗어났을 때만 isDragging을 false로 설정
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY

        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            setIsDragging(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        // 드레스 카드 드롭 확인
        const dressData = e.dataTransfer.getData('application/json')
        if (dressData) {
            try {
                const dress = JSON.parse(dressData)

                // 이미지가 없으면 모달 띄우기
                if (!preview && onImageUploadRequired) {
                    onImageUploadRequired(dress)
                    return
                }

                // 이미지가 있으면 드레스 매칭 실행
                if (onDressDropped) {
                    onDressDropped(dress)
                }
                return
            } catch (error) {
                console.error('드레스 데이터 파싱 오류:', error)
            }
        }

        // 이미지 파일 드롭
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFile(file)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = () => {
        setPreview(null)
        onImageUpload(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const imageSrc = resultImage || preview

    return (
        <div className="image-upload">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {!preview ? (
                <div
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <div className="upload-icon">📷</div>
                    <p className="upload-text">전신 사진을 업로드 해주세요</p>
                    <p className="upload-subtext">JPG, PNG, JPEG 형식 지원</p>
                </div>
            ) : (
                <div
                    className={`preview-container ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <img src={imageSrc} alt="Preview" className="preview-image" />
                    {isProcessing && (
                        <div className="processing-overlay">
                            <div className="spinner"></div>
                            <p>매칭 중...</p>
                        </div>
                    )}
                    {showCheckmark && (
                        <div className="processing-overlay">
                            <div className="completion-icon">✓</div>
                            <p>매칭완료</p>
                        </div>
                    )}
                    {isDragging && (
                        <div className="drop-overlay">
                            <p>드레스를 여기에 드롭하세요</p>
                        </div>
                    )}
                    <button className="remove-button" onClick={handleRemove}>
                        ✕
                    </button>
                    {canDownload && imageSrc && !isProcessing && (
                        <button
                            className="download-button"
                            onClick={(e) => {
                                e.stopPropagation()
                                try {
                                    const link = document.createElement('a')
                                    link.href = imageSrc
                                    link.download = 'match_result.png'
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                } catch (err) {
                                    console.error('다운로드 실패:', err)
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
    )
}

export default ImageUpload

