import React, { useState } from 'react';
import styles from './MiniGame.module.css';

function calculateWinner(squares: Array<string | null>): { winner: string | null; line: number[] | null } {
 const lines = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
 ];
 for (let i = 0; i < lines.length; i++) {
   const [a, b, c] = lines[i];
   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
     return { winner: squares[a], line: lines[i] };
   }
 }
 return { winner: null, line: null };
}

function findAIMove(squares: Array<string | null>): number {
 const possibleWinningMove = findWinningMove(squares, 'X');
 if (possibleWinningMove !== -1) return possibleWinningMove;

 const blockingMove = findWinningMove(squares, 'O');
 if (blockingMove !== -1) return blockingMove;

 if (squares[4] === null) return 4;

 if (Math.random() < 0.7) {
   const emptySquares = squares
     .map((square, index) => (square === null ? index : -1))
     .filter(index => index !== -1);
   return emptySquares[Math.floor(Math.random() * emptySquares.length)];
 }

 const corners = [0, 2, 6, 8];
 const emptyCorners = corners.filter(corner => squares[corner] === null);
 if (emptyCorners.length > 0) {
   return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
 }

 const emptySquares = squares
   .map((square, index) => (square === null ? index : -1))
   .filter(index => index !== -1);
 return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}

function findWinningMove(squares: Array<string | null>, player: string): number {
 const lines = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
 ];

 for (const line of lines) {
   const [a, b, c] = line;
   const squares2 = squares.slice();
   if (squares2[a] === player && squares2[b] === player && squares2[c] === null) return c;
   if (squares2[a] === player && squares2[c] === player && squares2[b] === null) return b;
   if (squares2[b] === player && squares2[c] === player && squares2[a] === null) return a;
 }
 return -1;
}

const MiniGame: React.FC = () => {
 const [squares, setSquares] = useState<Array<string | null>>(Array(9).fill(null));
 const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

 const handleClick = (i: number) => {
   if (!isPlayerTurn || squares[i] || calculateWinner(squares).winner) return;

   const newSquares = squares.slice();
   newSquares[i] = 'X';
   setSquares(newSquares);
   setIsPlayerTurn(false);

   setTimeout(() => {
     if (!calculateWinner(newSquares).winner && newSquares.includes(null)) {
       const aiMove = findAIMove(newSquares);
       newSquares[aiMove] = 'O';
       setSquares([...newSquares]);
       setIsPlayerTurn(true);
     }
   }, 700);
 };

 const renderSquare = (i: number) => {
   const winResult = calculateWinner(squares);
   const isWinningSquare = winResult.line?.includes(i);
   const value = squares[i];
   const squareClass = `${styles.minigame_square} ${
     value === 'X' ? styles.minigame_x : value === 'O' ? styles.minigame_o : ''
   } ${isWinningSquare ? styles.minigame_winning_square : ''}`;

   return (
     <button 
       className={squareClass}
       onClick={() => handleClick(i)}
     >
       {value}
     </button>
   );
 };

 const winResult = calculateWinner(squares);
 const status = winResult.winner 
   ? `승리자: ${winResult.winner}` 
   : !squares.includes(null)
   ? "무승부 입니다!"
   : `${isPlayerTurn ? "사용자 턴.." : "AI 생각중이에요..."}`;

 const resetGame = () => {
   setSquares(Array(9).fill(null));
   setIsPlayerTurn(true);
 };

 return (
   <div className={styles.minigame_game}>
     <div className={styles.minigame_status}>{status}</div>
     <div className={styles.minigame_board_row}>
       {renderSquare(0)}
       {renderSquare(1)}
       {renderSquare(2)}
     </div>
     <div className={styles.minigame_board_row}>
       {renderSquare(3)}
       {renderSquare(4)}
       {renderSquare(5)}
     </div>
     <div className={styles.minigame_board_row}>
       {renderSquare(6)}
       {renderSquare(7)}
       {renderSquare(8)}
     </div>
     <button className={styles.minigame_reset_button} onClick={resetGame}>
       다시하기
     </button>
   </div>
 );
};

export default MiniGame;