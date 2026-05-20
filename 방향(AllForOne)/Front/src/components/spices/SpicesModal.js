import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../../css/spices/SpicesModal.module.css';
import line_ from '../../data/line_.json';

const SpicesModal = ({
    show,
    onClose,
    spice,
    onSubmit,
    isEditing,
}) => {
    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        nameEn: '',
        nameKr: '',
        lineName: 'Spicy',
        contentKr: '',
        imageUrlList: []
    });

    // 이미지 미리보기 상태
    const [imagePreview, setImagePreview] = useState(null);
    const [editingImage, setEditingImage] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (spice) {
            setFormData({
                ...spice,
                imageUrlList: spice.imageUrlList || [spice.imageUrl] || []
            });
            setImagePreview(spice.imageUrlList?.[0] || spice.imageUrl);
        }
    }, [spice]);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (field, value) => {
        if (field === 'imageUrl') {
            setFormData(prev => ({
                ...prev,
                imageUrlList: [value]
            }));
            setImagePreview(value);
            setImageError(false);
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = isEditing ? { ...formData, id: spice.id } : formData;
        onSubmit(submitData);
    };

    if (!show) return null;

    return (
        <>
            <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                    {/* 모달 헤더 */}
                    <div className={styles.modalHeader}>
                        <h2>{isEditing ? '향료 수정' : '향료 추가'}</h2>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* 모달 폼 */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <label className={styles.label}>영문명</label>
                            <input
                                type="text"
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleChange}
                                placeholder="영문명"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.label}>한글명</label>
                            <input
                                type="text"
                                name="nameKr"
                                value={formData.nameKr}
                                onChange={handleChange}
                                placeholder="한글명"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.label}>계열</label>
                            <select
                                name="lineName"
                                value={formData.lineName}
                                onChange={handleChange}
                                className={styles.select}
                                required
                            >
                                {line_.map(line => (
                                    <option key={line.name} value={line.name}>
                                        {line.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.label}>설명</label>
                            <textarea
                                name="contentKr"
                                value={formData.contentKr}
                                onChange={handleChange}
                                placeholder="설명"
                                className={styles.textarea}
                                required
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label className={styles.label}>이미지</label>
                            <div className={styles.imageUploadContainer}>
                                <div
                                    className={styles.imagePreviewContainer}
                                    onClick={() => setEditingImage(true)}
                                >
                                    <img
                                        src={imagePreview || formData.imageUrlList?.[0] || 'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MDZfMTk3/MDAxNTg4Nzc1MjcwMTQ2.l8lHrUz8ZfSDCShKbMs8RzQj37B3jxpwRnQK7byS9k4g.OORSv5IlMThMSNj20nz7_OYBzSTkxwnV9QGGV8a3tVkg.JPEG.herbsecret/essential-oils-2738555_1920.jpg?type=w800'}
                                        alt="미리보기"
                                        className={styles.previewImage}
                                        onError={(e) => {
                                            e.target.src = 'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MDZfMTk3/MDAxNTg4Nzc1MjcwMTQ2.l8lHrUz8ZfSDCShKbMs8RzQj37B3jxpwRnQK7byS9k4g.OORSv5IlMThMSNj20nz7_OYBzSTkxwnV9QGGV8a3tVkg.JPEG.herbsecret/essential-oils-2738555_1920.jpg?type=w800';
                                            setImageError(true);
                                        }}
                                    />
                                </div>

                                {editingImage && (
                                    <input
                                        type="text"
                                        className={styles.imageUrlInput}
                                        placeholder="이미지 URL을 입력하세요"
                                        value={formData.imageUrlList?.[0] || 'https://mblogthumb-phinf.pstatic.net/MjAyMDA1MDZfMTk3/MDAxNTg4Nzc1MjcwMTQ2.l8lHrUz8ZfSDCShKbMs8RzQj37B3jxpwRnQK7byS9k4g.OORSv5IlMThMSNj20nz7_OYBzSTkxwnV9QGGV8a3tVkg.JPEG.herbsecret/essential-oils-2738555_1920.jpg?type=w800'}
                                        onChange={(e) => {
                                            handleInputChange('imageUrl', e.target.value);
                                            setImagePreview(e.target.value);
                                            setImageError(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setEditingImage(false);
                                            }
                                        }}
                                        autoFocus
                                    />
                                )}
                            </div>
                        </div>

                        {/* 버튼 영역 */}
                        <div className={styles.modalActions}>
                            <button type="submit" className={styles.submitButton}>
                                {isEditing ? '수정' : '추가'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SpicesModal;