export interface GamePlaytime {
    gameId: number;
    averagePlaytimeInSeconds: number;
  }
  
  export interface GenrePlaytime {
    genre: string;
    averagePlaytimeInSeconds: number;
  }
  
  export interface HourlyTraffic {
    hour: number;
    count: number;
  }
  
  export interface BasicStats {
    timestamp: string;
    totalGames: number;
    totalUsers: number;
    totalPlayTime: number;
    gamesByGenre: Record<string, number>;
    dailyTraffic: Record<string, number>;
    weeklyTraffic: Record<string, number>;
    hourlyTraffic: HourlyTraffic[];
    totalDailyTraffic: number;
    totalWeeklyTraffic: number;
    gamePlaytimes: GamePlaytime[];
    genrePlaytimes: GenrePlaytime[];
  }
  export interface DailyStats {
    date: string;
    count: number;
  }
  
  export interface ActiveUserStats {
    dauStats: DailyStats[];
    mauStats: DailyStats[];
  }