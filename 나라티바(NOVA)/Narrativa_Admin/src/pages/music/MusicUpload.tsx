import React, { useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import FileUploadCard from "../../components/music/FileUploadCard";
import { useMusicApi } from "../../hooks/useMusicApi";
import { useGenreSelect } from "../../hooks/useGenreSelect";
import { Genre } from "../../types/music";
import { useToast } from "../../hooks/useToast";

const MusicUpload: React.FC = () => {
    const { uploadMusic } = useMusicApi();
    const { genres, selectedGenre, setSelectedGenre } = useGenreSelect();
    const { showToast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    const handleGenreChange = (genre: string) => {
        setSelectedGenre(genre as Genre);
    };

    const handleUpload = async (file: File): Promise<boolean> => {
        if (!selectedGenre) {
            showToast('장르를 선택해주세요.', 'error');
            return false;
        }

        setIsUploading(true);
        try {
            await uploadMusic(file, selectedGenre);
            showToast('파일이 성공적으로 업로드되었습니다.', 'success');
            
            // 업로드 성공 후 초기화
            setSelectedGenre('' as Genre);
            return true;
        } catch (error) {
            console.error('File upload error:', error);
            showToast('파일 업로드 중 오류가 발생했습니다.', 'error');
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <PageLayout title="Music Upload">
            <div className="flex justify-center px-4 sm:px-0">
                <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
                    <FileUploadCard
                        genres={genres as Genre[]}
                        selectedGenre={selectedGenre}
                        onGenreChange={handleGenreChange}
                        onFileSelect={handleUpload}
                        isUploading={isUploading}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default MusicUpload;