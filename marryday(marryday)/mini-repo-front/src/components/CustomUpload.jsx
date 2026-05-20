import { useState, useRef, useEffect } from 'react'
import '../styles/CustomUpload.css'

const CustomUpload = ({ onFullBodyUpload, onDressUpload, onRemoveBackground, onMatch, fullBodyImage, dressImage, isProcessing, isBackgroundRemoved }) => {
    const [fullBodyPreview, setFullBodyPreview] = useState(null)
    const [dressPreview, setDressPreview] = useState(null)
    const [isDraggingFullBody, setIsDraggingFullBody] = useState(false)
    const [isDraggingDress, setIsDraggingDress] = useState(false)
    const fullBodyInputRef = useRef(null)
    const dressInputRef = useRef(null)

    // 전신사진 업로드
    const handleFullBodyFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFullBodyFile(file)
        }
    }

    const handleFullBodyFile = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setFullBodyPreview(reader.result)
            onFullBodyUpload(file)
        }
        reader.readAsDataURL(file)
    }

    // fullBodyImage가 변경되면 프리뷰 업데이트
    useEffect(() => {
        if (fullBodyImage instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFullBodyPreview(reader.result)
            }
            reader.readAsDataURL(fullBodyImage)
        } else if (!fullBodyImage) {
            setFullBodyPreview(null)
        }
    }, [fullBodyImage])

    const handleFullBodyDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFullBody(true)
    }

    const handleFullBodyDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY

        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            setIsDraggingFullBody(false)
        }
    }

    const handleFullBodyDrop = (e) => {
        e.preventDefault()
        setIsDraggingFullBody(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            handleFullBodyFile(file)
        }
    }

    const handleFullBodyClick = () => {
        fullBodyInputRef.current?.click()
    }

    const handleFullBodyRemove = () => {
        setFullBodyPreview(null)
        onFullBodyUpload(null)
        if (fullBodyInputRef.current) {
            fullBodyInputRef.current.value = ''
        }
    }

    // 드레스 이미지 업로드
    const handleDressFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            handleDressFile(file)
        }
    }

    const handleDressFile = (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setDressPreview(reader.result)
            onDressUpload(file)
        }
        reader.readAsDataURL(file)
    }

    // dressImage가 변경되면 프리뷰 업데이트 (배경 제거 후)
    useEffect(() => {
        if (dressImage instanceof File) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setDressPreview(reader.result)
            }
            reader.readAsDataURL(dressImage)
        } else if (!dressImage) {
            setDressPreview(null)
        }
    }, [dressImage])

    const handleDressDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingDress(true)
    }

    const handleDressDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY

        if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
            setIsDraggingDress(false)
        }
    }

    const handleDressDrop = (e) => {
        e.preventDefault()
        setIsDraggingDress(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            handleDressFile(file)
        }
    }

    const handleDressClick = () => {
        dressInputRef.current?.click()
    }

    const handleDressRemove = () => {
        setDressPreview(null)
        onDressUpload(null)
        if (dressInputRef.current) {
            dressInputRef.current.value = ''
        }
    }

    return (
        <div className="custom-upload">
            {/* 전신사진 업로드 영역 */}
            <div className="upload-section">
                <input
                    ref={fullBodyInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFullBodyFileChange}
                    style={{ display: 'none' }}
                />

                {!fullBodyPreview ? (
                    <div
                        className={`custom-upload-area ${isDraggingFullBody ? 'dragging' : ''}`}
                        onDragOver={handleFullBodyDragOver}
                        onDragLeave={handleFullBodyDragLeave}
                        onDrop={handleFullBodyDrop}
                        onClick={handleFullBodyClick}
                    >
                        <div className="upload-icon">👤</div>
                        <p className="upload-text">전신사진을 업로드 해주세요</p>
                    </div>
                ) : (
                    <div
                        className={`custom-preview-container fullbody ${isDraggingFullBody ? 'dragging' : ''}`}
                        onDragOver={handleFullBodyDragOver}
                        onDragLeave={handleFullBodyDragLeave}
                        onDrop={handleFullBodyDrop}
                    >
                        <img src={fullBodyPreview} alt="Full Body" className="custom-preview-image" />
                        <button className="custom-remove-button" onClick={handleFullBodyRemove}>
                            ✕
                        </button>
                    </div>
                )}
            </div>

            {/* 드레스 이미지 업로드 영역 */}
            <div className="upload-section">
                <input
                    ref={dressInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDressFileChange}
                    style={{ display: 'none' }}
                />

                {!dressPreview ? (
                    <div
                        className={`custom-upload-area ${isDraggingDress ? 'dragging' : ''}`}
                        onDragOver={handleDressDragOver}
                        onDragLeave={handleDressDragLeave}
                        onDrop={handleDressDrop}
                        onClick={handleDressClick}
                    >
                        <div className="upload-icon">👗</div>
                        <p className="upload-text">드레스 사진을 업로드 해주세요</p>
                    </div>
                ) : (
                    <div
                        className={`custom-preview-container ${isDraggingDress ? 'dragging' : ''}`}
                        onDragOver={handleDressDragOver}
                        onDragLeave={handleDressDragLeave}
                        onDrop={handleDressDrop}
                    >
                        <img src={dressPreview} alt="Dress" className="custom-preview-image" />
                        <button className="custom-remove-button" onClick={handleDressRemove}>
                            ✕
                        </button>
                        <button
                            className="remove-bg-button"
                            onClick={onRemoveBackground}
                            disabled={isProcessing || isBackgroundRemoved}
                        >
                            {isBackgroundRemoved ? '✓ 배경 제거 완료' : isProcessing ? '처리 중...' : '배경지우기'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomUpload

