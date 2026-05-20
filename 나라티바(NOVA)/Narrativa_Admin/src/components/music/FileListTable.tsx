import React from 'react';
import { MusicFile, GENRE_DISPLAY_NAMES, Genre } from '../../types/music';

interface FileListTableProps {
    files: MusicFile[];
    onDelete: (filename: string) => void;
}

const getGenreColor = (genre: string) => {
    switch (genre) {
        case 'MYSTERY':
            return 'bg-purple-100 text-purple-800';
        case 'SURVIVAL':
            return 'bg-red-100 text-red-800';
        case 'ROMANCE':
            return 'bg-pink-100 text-pink-800';
        case 'SIMULATION':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

const FileListTable: React.FC<FileListTableProps> = ({ files, onDelete }) => {
    return (
        <div className="bg-white min-h-[50dvh] sm:min-h-[60dvh] max-h-[50dvh] sm:max-h-[60dvh] rounded-xl sm:rounded-2xl overflow-auto flex flex-col">
            {/* 고정 헤더 */}
            <div className="sticky top-0 z-10">
                <div className="grid grid-cols-12 sm:grid-cols-12 gap-2 sm:gap-4 bg-pointer2 px-3 sm:px-6 py-2 sm:py-3 border-b">
                    <div className="col-span-7 sm:col-span-4 text-left text-xs font-contents font-medium text-white uppercase">파일명</div>
                    <div className="col-span-3 sm:col-span-2 text-left text-xs font-contents font-medium text-white uppercase">장르</div>
                    <div className="hidden sm:block col-span-2 text-left text-xs font-contents font-medium text-white uppercase">크기</div>
                    <div className="hidden sm:block col-span-3 text-left text-xs font-contents font-medium text-white uppercase">수정일</div>
                    <div className="col-span-2 sm:col-span-1 text-right text-xs font-contents font-medium text-white uppercase">삭제</div>
                </div>
            </div>

            {/* 스크롤 가능한 본문 */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                    {files
                        .filter(file => !file.name.endsWith('/'))
                        .map((file) => (
                        <div key={file.name} className="grid grid-cols-12 sm:grid-cols-12 gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 hover:bg-gray-50">
                            <div className="col-span-7 sm:col-span-4 overflow-hidden text-ellipsis whitespace-nowrap">
                                <a
                                    href={file.presignedUrl}
                                    className="font-contents text-sm sm:text-base text-blue-600 hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {file.name}
                                </a>
                            </div>
                            <div className="col-span-3 sm:col-span-2 text-left">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    ${file.genre === 'MYSTERY' && 'bg-blue-100 text-blue-800'}
                                    ${file.genre === 'SURVIVAL' && 'bg-red-100 text-red-800'}
                                    ${file.genre === 'ROMANCE' && 'bg-pink-100 text-pink-800'}
                                    ${file.genre === 'SIMULATION' && 'bg-green-100 text-green-800'}
                                `}>
                                    {GENRE_DISPLAY_NAMES[file.genre as Genre] || file.genre}
                                </span>
                            </div>
                            <div className="hidden sm:block col-span-2 font-contents text-gray-600 text-sm">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                            <div className="hidden sm:block col-span-3 font-contents text-gray-600 text-sm">
                                {new Date(file.lastModified).toLocaleDateString()}
                            </div>
                            <div className="col-span-2 sm:col-span-1 font-contents text-right pr-2">
                                <button
                                    onClick={() => onDelete(file.name)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <svg className="h-4 w-4 sm:h-5 sm:w-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileListTable;