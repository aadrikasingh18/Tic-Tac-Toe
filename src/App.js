import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [blueScore, setBlueScore] = useState(0);
  const [redScore, setRedScore] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('blue');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  useEffect(() => {
    const storedBlueScore = localStorage.getItem('blueScore');
    const storedRedScore = localStorage.getItem('redScore');

    if (storedBlueScore) {
      setBlueScore(parseInt(storedBlueScore));
    }
    if (storedRedScore) {
      setRedScore(parseInt(storedRedScore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('blueScore', blueScore);
  }, [blueScore]);

  useEffect(() => {
    localStorage.setItem('redScore', redScore);
  }, [redScore]);

  const handleCellClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    setBoard(newBoard);

    const nextPlayer = currentPlayer === 'blue' ? 'red' : 'blue';
    setCurrentPlayer(nextPlayer);

    checkWinner(newBoard);
  };

  const checkWinner = (board) => {
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

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine(line);
        updateScore(board[a]);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner('draw');
    }
  };

  const updateScore = (winner) => {
    if (winner === 'blue') {
      setBlueScore(blueScore + 1);
    } else if (winner === 'red') {
      setRedScore(redScore + 1);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
  };

  const renderCell = (index) => {
    return (
      <div
        className={`cell ${board[index]}`}
        onClick={() => handleCellClick(index)}
      >
        {board[index] === 'blue' && <div className="circle blue"></div>}
        {board[index] === 'red' && <div className="cross red"></div>}
      </div>
    );
  };

  const renderWinningLine = () => {
    if (winner && winningLine.length === 3) {
      const [a, b, c] = winningLine;
      return (
        <div className="winning-line">
          <div className={`line line-${a}-${b}-${c}`} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <div className="score">
        <div className="blue-score">Blue: {blueScore}</div>
        <div className="red-score">Red: {redScore}</div>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          renderCell(index)
        ))}
        {renderWinningLine()}
      </div>
      {winner && (
        <div className="popup">
          <div className="popup-content">
            {winner === 'draw' ? (
              <p>It's a draw!</p>
            ) : (
              <p>{winner === 'blue' ? 'Blue' : 'Red'} wins!</p>
            )}
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
