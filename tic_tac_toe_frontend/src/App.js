import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Constants for colors based on the provided requirements.
 */
const COLORS = {
  primary: "#1976d2",
  secondary: "#424242",
  accent: "#ffd600",
};

// Helper for initial empty grid
function getEmptyGrid() {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
}

const MODES = {
  PvP: "Player vs Player",
  PvC: "Player vs Computer",
};

const DIFFICULTIES = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
};

/**
 * Determines if there is a winner on the board.
 * Returns { winner: "X" | "O" | null, winningSquares: [[row, col], ...] }
 *
 * PUBLIC_INTERFACE
 */
function calculateWinner(grid) {
  // All possible winning lines (row, col)
  const lines = [
    // rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // columns
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // diagonals
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  for (let line of lines) {
    const [[aX, aY], [bX, bY], [cX, cY]] = line;
    if (
      grid[aX][aY] &&
      grid[aX][aY] === grid[bX][bY] &&
      grid[aX][aY] === grid[cX][cY]
    ) {
      return { winner: grid[aX][aY], winningSquares: line };
    }
  }
  return { winner: null, winningSquares: [] };
}

/**
 * Returns true if every cell of the grid is occupied.
 *
 * PUBLIC_INTERFACE
 */
function isDraw(grid) {
  for (let row of grid) {
    for (let cell of row) {
      if (!cell) return false;
    }
  }
  return true;
}

/**
 * Returns [row, col] for a random empty cell, or null if board is full.
 *
 * PUBLIC_INTERFACE
 */
function getRandomEmptyCell(grid) {
  const empties = [];
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[r].length; ++c) {
      if (!grid[r][c]) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}

/**
 * Returns all empty cells as [row, col] pairs.
 */
function getAllEmptyCells(grid) {
  const empties = [];
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid[r].length; ++c) {
      if (!grid[r][c]) empties.push([r, c]);
    }
  }
  return empties;
}

/**
 * Try to find a winning move for the specified marker ("O" or "X").
 * Returns [row, col] if found, else null.
 */
function findWinningMove(grid, marker) {
  // For each empty cell, if putting 'marker' there wins, return it.
  const emptyCells = getAllEmptyCells(grid);
  for (let [row, col] of emptyCells) {
    const temp = grid.map(row => row.slice());
    temp[row][col] = marker;
    const { winner } = calculateWinner(temp);
    if (winner === marker) return [row, col];
  }
  return null;
}

/**
 * Minimax algorithm for Tic Tac Toe AI (returns {score, move})
 *
 * - board: 3x3 array
 * - depth: integer
 * - isMaximizing: boolean (true for "O"/AI, false for "X"/player)
 * - aiMarker: "O" (computer)
 * - humanMarker: "X" (player)
 */
function minimax(board, depth, isMaximizing, aiMarker, humanMarker) {
  const { winner } = calculateWinner(board);
  if (winner === aiMarker) return { score: 10 - depth };
  if (winner === humanMarker) return { score: depth - 10 };
  if (isDraw(board)) return { score: 0 };

  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  let empties = getAllEmptyCells(board);
  for (let [row, col] of empties) {
    const temp = board.map(r => r.slice());
    temp[row][col] = isMaximizing ? aiMarker : humanMarker;
    const { score } = minimax(temp, depth + 1, !isMaximizing, aiMarker, humanMarker);
    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }
  return { score: bestScore, move: bestMove };
}

/**
 * Computer Move Logic: Easy (random), Medium (block/win), Hard (minimax optimal)
 *
 * PUBLIC_INTERFACE
 */
function getComputerMove(grid, difficulty) {
  if (difficulty === "Easy") {
    return getRandomEmptyCell(grid);
  }
  if (difficulty === "Medium") {
    // 1. Can win? win.
    let winMove = findWinningMove(grid, "O");
    if (winMove) return winMove;
    // 2. Can block player? block.
    let blockMove = findWinningMove(grid, "X");
    if (blockMove) return blockMove;
    // 3. Else random.
    return getRandomEmptyCell(grid);
  }
  if (difficulty === "Hard") {
    // minimax
    const { move } = minimax(grid, 0, true, "O", "X");
    if (move) return move;
    else return getRandomEmptyCell(grid); // fallback
  }
  return getRandomEmptyCell(grid);
}

/**
 * Main App component for Tic Tac Toe with difficulty selection.
 *
 * PUBLIC_INTERFACE
 */
function App() {
  const [theme] = useState("light"); // Fixed light theme as per requirements.
  const [mode, setMode] = useState("PvP");
  const [difficulty, setDifficulty] = useState("Easy");
  const [grid, setGrid] = useState(getEmptyGrid());
  const [activeX, setActiveX] = useState(true); // X always goes first
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState({ X: 0, O: 0, Draws: 0 });
  const [winningLine, setWinningLine] = useState([]);

  // Always apply 'light' theme explicitly
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // Determine winner or draw after grid changes
  useEffect(() => {
    const { winner, winningSquares } = calculateWinner(grid);
    if (winner) {
      setStatus(`Winner: ${winner === "X" ? "Player 1 (X)" : mode === "PvP" ? "Player 2 (O)" : "Computer (O)"}`);
      setGameOver(true);
      setWinningLine(winningSquares);
      setScore(s => ({
        ...s,
        [winner]: s[winner] + 1,
      }));
    } else if (isDraw(grid)) {
      setStatus("Draw! 🤝");
      setGameOver(true);
      setScore(s => ({
        ...s,
        Draws: s.Draws + 1,
      }));
      setWinningLine([]);
    } else {
      setStatus(
        mode === "PvP"
          ? `Turn: ${activeX ? "Player 1 (X)" : "Player 2 (O)"}`
          : `Turn: ${activeX ? "Player (X)" : "Computer (O)"}`
      );
      setWinningLine([]);
    }
  }, [grid, mode, activeX]);

  // Computer move, according to selected difficulty
  useEffect(() => {
    if (
      mode === "PvC" &&
      !gameOver &&
      !activeX // Computer is always O
    ) {
      const timer = setTimeout(() => {
        const move = getComputerMove(grid, difficulty);
        if (move) {
          const [row, col] = move;
          handleCellClick(row, col, true);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [activeX, grid, gameOver, mode, difficulty]);

  /**
   * Handles cell click for play; if computer turn, force isComputer=true.
   */
  const handleCellClick = (row, col, isComputer = false) => {
    if (gameOver || grid[row][col]) return;
    // PvC: Player can only move on X's turn
    if (mode === "PvC" && !activeX && !isComputer) return;

    setGrid(prevGrid => {
      const copy = prevGrid.map(row => row.slice());
      copy[row][col] = activeX ? "X" : "O";
      return copy;
    });
    setActiveX(prev => !prev);
  };

  /**
   * Handles restart functionality.
   */
  const handleRestart = () => {
    setGrid(getEmptyGrid());
    setActiveX(true);
    setGameOver(false);
    setWinningLine([]);
  };

  /**
   * Handles changes in game mode, resetting game & scores.
   */
  const handleModeChange = e => {
    setMode(e.target.value);
    setScore({ X: 0, O: 0, Draws: 0 });
    handleRestart();
  };

  /**
   * Handles difficulty change and resets board, but does not reset score (like mode change does).
   */
  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
    handleRestart();
  };

  // Highlight winning cell helper
  const isWinningCell = (row, col) =>
    winningLine.some(([r, c]) => r === row && c === col);

  // For responsive design, wrap everything in a centered flex container
  return (
    <div className="app-tictactoe-root" style={{
      minHeight: "100vh",
      background: "#f7f9fc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "32px 18px 22px 18px",
          boxShadow: "0 6px 36px 0 rgba(30,40,50,.20)",
          minWidth: 312,
          width: "90vw",
          maxWidth: 370,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Controls */}
        <div className="controls-section">
          <h1 className="ttt-heading">
            Tic Tac Toe
          </h1>

          {/* Section: Game Mode */}
          <div className="controls-row controls-mode">
            <label htmlFor="game-mode" className="ttt-label">
              Mode:
            </label>
            <select
              id="game-mode"
              value={mode}
              aria-label="Game mode selection"
              onChange={handleModeChange}
              className="ttt-select"
            >
              <option value="PvP">{MODES.PvP}</option>
              <option value="PvC">{MODES.PvC}</option>
            </select>
          </div>

          {/* Section: Difficulty */}
          {mode === "PvC" && (
            <div className="controls-row controls-difficulty">
              <label htmlFor="ai-difficulty" className="ttt-label">
                Difficulty:
              </label>
              <select
                id="ai-difficulty"
                value={difficulty}
                aria-label="Computer difficulty selection"
                onChange={handleDifficultyChange}
                className="ttt-select ttt-select-secondary"
              >
                <option value="Easy">{DIFFICULTIES.Easy}</option>
                <option value="Medium">{DIFFICULTIES.Medium}</option>
                <option value="Hard">{DIFFICULTIES.Hard}</option>
              </select>
            </div>
          )}

          {/* Section: Restart Button */}
          <div className="controls-row controls-restart">
            <button
              className="restart-btn"
              onClick={handleRestart}
              aria-label="Restart game"
            >
              <span className="restart-icon" role="img" aria-label="Refresh">&#x21bb;</span> Restart
            </button>
          </div>
        </div>
        {/* Game Board */}
        <div
          className="tictactoe-board"
          style={{
            display: "grid",
            gridTemplateRows: "repeat(3, 1fr)",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            width: "min(66vw, 278px)",
            height: "min(66vw, 278px)",
            margin: "10px 0 9px 0",
            background: "#f5f6fa",
            borderRadius: 18,
            border: `3px solid ${COLORS.primary}`,
            boxShadow: `0 2px 16px -10px ${COLORS.accent}50`,
            overflow: "hidden",
          }}
        >
          {grid.map((rowArr, row) =>
            rowArr.map((cell, col) => {
              let borderRight = col < 2 ? `2.5px solid ${COLORS.secondary}` : "none";
              let borderBottom = row < 2 ? `2.5px solid ${COLORS.secondary}` : "none";
              return (
                <button
                  key={`cell-${row}-${col}`}
                  className="cell-btn"
                  aria-label={`Grid cell ${row + 1},${col + 1}${cell ? `, contains ${cell}` : ""}`}
                  onClick={() => handleCellClick(row, col)}
                  disabled={Boolean(cell) || gameOver || (mode === "PvC" && !activeX)}
                  style={{
                    fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
                    fontSize: "32px",
                    fontWeight: 700,
                    background: isWinningCell(row, col)
                      ? COLORS.accent
                      : "#fafafc",
                    color: cell === "X" ? COLORS.primary : cell === "O" ? COLORS.secondary : "#a0a0ad",
                    border: "none",
                    outline: "none",
                    borderRight,
                    borderBottom,
                    borderRadius: 0,
                    height: "93px",
                    width: "93px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor:
                      !cell &&
                      !gameOver &&
                      (mode === "PvP" || (mode === "PvC" && activeX))
                        ? "pointer"
                        : "not-allowed",
                    transition: "background 0.2s, color 0.2s",
                    boxShadow: isWinningCell(row, col)
                      ? `0 3px 25px -7px ${COLORS.accent}66`
                      : "none",
                  }}
                >
                  {cell ? (cell === "X" ? "X" : "O") : ""}
                </button>
              );
            })
          )}
        </div>
        {/* Status and Scoreboard */}
        <div
          style={{
            width: "100%",
            margin: "10px 0 4px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            className="status-display"
            aria-live="polite"
            style={{
              fontSize: "20px",
              color: gameOver
                ? (status.startsWith("Winner") ? COLORS.primary : COLORS.secondary)
                : COLORS.primary,
              fontWeight: 700,
              minHeight: "24px",
              marginBottom: 5,
              letterSpacing: ".012em",
              textShadow: gameOver
                ? `0 2px 15px ${COLORS.accent}44`
                : "none",
            }}
          >
            {status}
          </div>
          <div
            className="scoreboard"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              marginTop: 6,
              marginBottom: 2,
              gap: 6,
            }}
          >
            <ScoreBox
              title={mode === "PvP" ? "Player 1 (X)" : "You (X)"}
              value={score.X}
              color={COLORS.primary}
            />
            <ScoreBox
              title={mode === "PvP" ? "Player 2 (O)" : "Computer (O)"}
              value={score.O}
              color={COLORS.secondary}
            />
            <ScoreBox title="Draws" value={score.Draws} color={COLORS.accent} />
          </div>
        </div>
      </div>
      {/* Footer credit */}
      <div style={{
        marginTop: 28,
        textAlign: "center",
        fontSize: 14,
        color: "#b4b9c2",
        letterSpacing: ".015em",
      }}>
        <span>
          Tic Tac Toe game &copy; {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

/**
 * ScoreBox - Small component for displaying current score per player/type.
 *
 * PUBLIC_INTERFACE
 */
function ScoreBox({ title, value, color }) {
  return (
    <div
      style={{
        background: "#fdfdfd",
        boxShadow: `0 0.5px 8px 0 ${color}16`,
        border: `1.5px solid ${color}`,
        borderRadius: "8px",
        minWidth: 74,
        padding: "5px 5px 4px 5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontWeight: 600,
        fontSize: 15,
      }}
      aria-label={`${title}: ${value}`}
      role="status"
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 400,
          marginBottom: 2,
          color: color,
        }}
      >
        {title}
      </span>
      <span style={{ fontSize: 18, color: color }}>{value}</span>
    </div>
  );
}

export default App;
