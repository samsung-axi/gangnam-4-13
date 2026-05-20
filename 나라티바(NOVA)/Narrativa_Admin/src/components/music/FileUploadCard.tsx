import React, { useCallback, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { X } from 'lucide-react';
import { FileUploadCardProps, Genre } from '../../types/music';
import { useToast } from '../../hooks/useToast';
import { formatGenre } from '../../utils/formatUtils';

const FileUploadCard: React.FC<FileUploadCardProps> = ({
    genres,
    selectedGenre,
    onGenreChange,
    onFileSelect
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { showToast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetForm = useCallback(() => {
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).filter(file => {
                if (file.size > 52428800) {
                    showToast(`${file.name}의 크기가 50MB를 초과합니다.`, 'error');
                    return false;
                }
                if (!file.type.startsWith('audio/')) {
                    showToast(`${file.name}은 오디오 파일이 아닙니다.`, 'error');
                    return false;
                }
                return true;
            });

            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    }, [showToast]);

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));

        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach((file, i) => {
                if (i !== index) {
                    dataTransfer.items.add(file);
                }
            });
            fileInputRef.current.files = dataTransfer.files;
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            showToast('업로드할 파일을 선택해주세요.', 'error');
            return;
        }

        try {
            for (const file of selectedFiles) {
                await onFileSelect(file);
            }
            showToast('모든 파일이 업로드되었습니다.', 'success');
            resetForm();
        } catch (error) {
            showToast('일부 파일 업로드에 실패했습니다.', 'error');
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onGenreChange(e.target.value as Genre);
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="font-contents text-lg sm:text-xl">음악 파일 업로드</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 sm:space-y-4">
                    {/* 장르 선택 */}
                    <div>
                        <label className="block text-sm font-contents font-medium text-gray-700 mb-1">
                            장르
                        </label>
                        <select
                            value={selectedGenre}
                            onChange={handleGenreChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base font-contents"
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {formatGenre(genre)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 파일 업로드 영역 */}
                    <div className="min-h-[30dvh] sm:min-h-[40dvh] max-h-[30dvh] sm:max-h-[40dvh] mt-3 sm:mt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            multiple
                            className="block w-full text-xs sm:text-sm text-gray-500
                                file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4
                                file:rounded-full file:border-0
                                file:text-xs sm:file:text-sm file:font-semibold
                                file:bg-pointer2 file:text-white
                                hover:file:bg-pointer1"
                        />
                    </div>

                    {/* 선택된 파일 목록 */}
                    {selectedFiles.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                            <h3 className="text-xs sm:text-sm font-contents font-medium text-gray-700 mb-2">
                                선택된 파일 ({selectedFiles.length})
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded-md"
                                    >
                                        <span className="text-xs sm:text-sm font-contents text-gray-600 truncate max-w-[85%]">
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 업로드 버튼 */}
                    {selectedFiles.length > 0 && (
                        <button
                            onClick={handleUpload}
                            className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-pointer2 text-white rounded-md
                                text-sm sm:text-base font-contents hover:bg-pointer1 transition-colors"
                        >
                            {selectedFiles.length}개 파일 업로드
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default FileUploadCard;