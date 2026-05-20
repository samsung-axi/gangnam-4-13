export const formatGenre = (genre: string): string => {
    // MYSTERY -> Mystery
    return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
};

export const getStoragePath = (genre: string, fileName: string): string => {
    const prefix = 'Detective';
    const formattedGenre = formatGenre(genre);
    return `${prefix}${formattedGenre}/${fileName}`;
}; 