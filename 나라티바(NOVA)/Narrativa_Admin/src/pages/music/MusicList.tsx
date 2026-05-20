import React from "react";
import PageLayout from "../../components/ui/PageLayout";
import { useMusicApi } from "../../hooks/useMusicApi";
import LoadingAnimation from "../../components/ui/LoadingAnimation";
import FileListTable from "../../components/music/FileListTable";
import { Genre, GENRE_DISPLAY_NAMES } from "../../types/music";

const MusicList: React.FC = () => {
    const {
        selectedGenre,
        genres,
        groupedFiles,
        filteredFiles,
        setSelectedGenre,
        fetchFiles,
        deleteMusic,
        isLoading
    } = useMusicApi();

    React.useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <PageLayout title="Music List">
            <div className="space-y-4 sm:space-y-6">
                {/* 장르 필터 버튼 */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <div className="font-contents font-bold text-lg sm:text-xl text-gray-700 mb-2 sm:mb-3">장르 필터</div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(GENRE_DISPLAY_NAMES).map(([genre, displayName]) => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre as Genre)}
                                className={`px-3 py-1.5 rounded-full text-sm font-contents transition-colors
                                    ${selectedGenre === genre
                                        ? 'bg-pointer2 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {displayName} ({groupedFiles[genre]?.length || 0})
                            </button>
                        ))}
                    </div>
                </div>

                {/* 파일 목록 */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[50dvh] sm:min-h-[60dvh] max-h-[50dvh] sm:max-h-[60dvh]">
                        <LoadingAnimation />
                    </div>
                ) : selectedGenre ? (
                    <div className="overflow-hidden">
                        <FileListTable
                            files={filteredFiles}
                            onDelete={deleteMusic}
                        />
                    </div>
                ) : (
                    <div className="min-h-[50dvh] sm:min-h-[60dvh] max-h-[50dvh] sm:max-h-[60dvh] flex justify-center items-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8">
                        <p className="text-center font-contents text-sm sm:text-base text-gray-500">장르를 선택하여 파일 목록을 확인하세요</p>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default MusicList;