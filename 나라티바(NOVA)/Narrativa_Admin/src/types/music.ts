export interface MusicFile {
    name: string;
    size: number;
    contentType: string;
    lastModified: string;
    presignedUrl: string;
    genre: string;
}

export type Genre = 'MYSTERY' | 'SURVIVAL' | 'ROMANCE' | 'SIMULATION';

export interface UploadMusicPayload {
    file: File;
    genre: Genre;
}

export interface FileUploadCardProps {
    genres: Genre[];
    selectedGenre: Genre;
    onGenreChange: (genre: Genre) => void;
    onFileSelect: (file: File) => Promise<boolean>;
    isUploading?: boolean;
}

export type GenrePath = {
  MYSTERY: "DetectiveMystery",
  SURVIVAL: "SurvivalHorror",
  ROMANCE: "RomanticFantasy",
  SIMULATION: "RaisingSimulation"
};

export const GENRE_PATH_MAP: GenrePath = {
  MYSTERY: "DetectiveMystery",
  SURVIVAL: "SurvivalHorror",
  ROMANCE: "RomanticFantasy",
  SIMULATION: "RaisingSimulation"
};

export const GENRE_DISPLAY_NAMES: Record<Genre, string> = {
  MYSTERY: "추리",
  SURVIVAL: "서바이벌",
  ROMANCE: "로맨스",
  SIMULATION: "육성"
};