import React, { useState } from 'react';

interface GamePlaytime {
  gameId: number;
  averagePlaytimeInSeconds: number;
}

interface GenrePlaytime {
  genre: string;
  averagePlaytimeInSeconds: number;
}

interface PlaytimeStatsProps {
  gamePlaytimes: GamePlaytime[];
  genrePlaytimes: GenrePlaytime[];
}

const PlaytimeStats: React.FC<PlaytimeStatsProps> = ({ gamePlaytimes, genrePlaytimes }) => {
  const [showGenreStats, setShowGenreStats] = useState(false);
  const allGenres = ['Survival', 'Mystery', 'Romance', 'Simulation'];
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
    }
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const getGenreData = (genre: string) => {
    const genreData = genrePlaytimes.find(g => g.genre === genre);
    return genreData ? genreData.averagePlaytimeInSeconds : 0;
  };

  const calculateTotalAverage = () => {
    if (gamePlaytimes.length === 0) return 0;
    return gamePlaytimes.reduce((acc, curr) => acc + curr.averagePlaytimeInSeconds, 0) / gamePlaytimes.length;
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-2xl font-contents font-bold text-pointer">
          {formatTime(calculateTotalAverage())}
        </p>
      </div>
      <div>
        <button
          onClick={() => setShowGenreStats(!showGenreStats)}
          className={`px-3 py-1 font-contents text-sm rounded-md transition-all ${
            showGenreStats
              ? 'bg-pointer2 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          장르별
        </button>
      </div>
      
      {showGenreStats && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-3 text-sm font-title font-medium text-gray-500">장르</th>
                <th className="text-right pb-3 text-sm font-title font-medium text-gray-500">평균 플레이타임</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allGenres.map((genre) => (
                <tr key={genre} className="hover:bg-gray-50">
                  <td className="py-3 text-sm font-contents text-gray-900">{genre}</td>
                  <td className="py-3 text-sm font-contents text-gray-900 text-right">
                    {formatTime(getGenreData(genre))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlaytimeStats;