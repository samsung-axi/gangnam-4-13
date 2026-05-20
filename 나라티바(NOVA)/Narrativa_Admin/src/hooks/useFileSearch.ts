import { useState, useMemo } from 'react';
import { MusicFile } from '../types/music';

export const useFileSearch = (files: MusicFile[]) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFiles = useMemo(() => 
        files.filter(file => 
            file.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [files, searchTerm]
    );

    return {
        searchTerm,
        setSearchTerm,
        filteredFiles
    };
};