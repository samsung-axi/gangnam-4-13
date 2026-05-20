import { useState } from 'react';
import { Genre } from '../types/music';

const GENRES: Genre[] = ['MYSTERY', 'SURVIVAL', 'ROMANCE', 'SIMULATION'];

export const useGenreSelect = () => {
    const [selectedGenre, setSelectedGenre] = useState<Genre>(GENRES[0]);

    return {
        genres: GENRES,
        selectedGenre,
        setSelectedGenre
    };
};