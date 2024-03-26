import React, { useState, useEffect } from 'react';
import '../Sudoko/sudoko.css';

const SudokuSolver = () => {
  const [grid, setGrid] = useState([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [conflictCells, setConflictCells] = useState([]);
  const [solvedGrid, setSolvedGrid] = useState([]);

  useEffect(() => {
    let interval;
    if (timerOn) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  const isValid = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  };

  const solve = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const solveSudoku = () => {
    setTimerOn(true);
    setIsSolved(false);
    const copiedGrid = JSON.parse(JSON.stringify(grid));
    const solved = solve(copiedGrid);
    if (solved) {
      setSolvedGrid(copiedGrid);
      setIsSolved(true);
      setTimerOn(false);
    } else {
      alert("No solution exists!");
    }
  };

  const checkSolution = () => {
    const conflicts = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 || !isValid(grid, row, col, grid[row][col])) {
          conflicts.push({ row, col });
        }
      }
    }
    setConflictCells(conflicts);
    if (conflicts.length === 0) {
      alert("Correct solution!");
    } else {
      alert("Incorrect solution!");
    }
  };

  const resetPuzzle = () => {
    setTimer(0);
    setTimerOn(false);
    setIsSolved(false);
    setConflictCells([]);
    setGrid([
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]);
    setSolvedGrid([]);
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (selectedCell && !isSolved) {
      const { row, col } = selectedCell;
      if (isValid(grid, row, col, num)) {
        const newGrid = [...grid];
        newGrid[row][col] = num;
        setGrid(newGrid);
      } else {
        alert("Invalid move!");
      }
    }
  };

  const renderGrid = (currentGrid) => {
    return currentGrid.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, colIndex) => (
          <td
            key={colIndex}
            className={`cell ${selectedCell &&
              selectedCell.row === rowIndex &&
              selectedCell.col === colIndex &&
              "selected"} ${cell === 0 && "empty"} ${
              conflictCells.find(
                (conflict) => conflict.row === rowIndex && conflict.col === colIndex
              ) &&
              "conflict"
            }`}
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell !== 0 && cell}
          </td>
        ))}
      </tr>
    ));
  };
  
  
  const pauseResumeTimer = () => {
    setTimerOn((prevTimerOn) => !prevTimerOn);
  };

  return (
    <div className='bg'>
      <h1>Sudoku Solver</h1>
      <div className="buttons">
        <button onClick={solveSudoku}>Solve Sudoku</button>
        <button onClick={checkSolution}>Check Solution</button>
        <button onClick={resetPuzzle}>Reset Puzzle</button>
        <button onClick={pauseResumeTimer}>
          {timerOn ? "Pause Timer" : "Resume Timer"}
        </button>
      </div>
      <div className="timer">Timer: {timer} seconds</div>
      <div className="grid-container">
        <div className="grid">
          <h2>Input Sudoku</h2>
          <table>
            <tbody>{renderGrid(grid)}</tbody>
          </table>
        </div>
        {isSolved && (
          <div className="grid">
            <h2>Solved Sudoku</h2>
            <table>
              <tbody>{renderGrid(solvedGrid)}</tbody>
            </table>
          </div>
        )}
      </div>
      {isSolved && <div className="message">Puzzle Solved!</div>}
    </div>
  );
};

export default SudokuSolver;




























































































































































































































// import React, { useState, useEffect } from 'react';
// import '../Sudoko/sudoko.css';

// const SudokuSolver = () => {
//   const [grid, setGrid] = useState([
//     [5, 3, 0, 0, 7, 0, 0, 0, 0],
//     [6, 0, 0, 1, 9, 5, 0, 0, 0],
//     [0, 9, 8, 0, 0, 0, 0, 6, 0],
//     [8, 0, 0, 0, 6, 0, 0, 0, 3],
//     [4, 0, 0, 8, 0, 3, 0, 0, 1],
//     [7, 0, 0, 0, 2, 0, 0, 0, 6],
//     [0, 6, 0, 0, 0, 0, 2, 8, 0],
//     [0, 0, 0, 4, 1, 9, 0, 0, 5],
//     [0, 0, 0, 0, 8, 0, 0, 7, 9],
//   ]);
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [isSolved, setIsSolved] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [timerOn, setTimerOn] = useState(false);
//   const [conflictCells, setConflictCells] = useState([]);

//   useEffect(() => {
//     let interval;
//     if (timerOn) {
//       interval = setInterval(() => {
//         setTimer((prevTimer) => prevTimer + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timerOn]);

//   const isValid = (grid, row, col, num) => {
//     for (let i = 0; i < 9; i++) {
//       if (grid[row][i] === num || grid[i][col] === num) return false;
//     }

//     const startRow = Math.floor(row / 3) * 3;
//     const startCol = Math.floor(col / 3) * 3;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         if (grid[startRow + i][startCol + j] === num) return false;
//       }
//     }

//     return true;
//   };

//   const solve = (grid) => {
//     for (let row = 0; row < 9; row++) {
//       for (let col = 0; col < 9; col++) {
//         if (grid[row][col] === 0) {
//           for (let num = 1; num <= 9; num++) {
//             if (isValid(grid, row, col, num)) {
//               grid[row][col] = num;
//               if (solve(grid)) return true;
//               grid[row][col] = 0;
//             }
//           }
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const solveSudoku = () => {
//     setTimerOn(true);
//     setIsSolved(false);
//     const copiedGrid = JSON.parse(JSON.stringify(grid));
//     if (solve(copiedGrid)) {
//       setGrid(copiedGrid);
//       setIsSolved(true);
//       setTimerOn(false);
//     } else {
//       alert("No solution exists!");
//     }
//   };

//   const checkSolution = () => {
//     const conflicts = [];
//     for (let row = 0; row < 9; row++) {
//       for (let col = 0; col < 9; col++) {
//         if (grid[row][col] === 0 || !isValid(grid, row, col, grid[row][col])) {
//           conflicts.push({ row, col });
//         }
//       }
//     }
//     setConflictCells(conflicts);
//     if (conflicts.length === 0) {
//       alert("Correct solution!");
//     } else {
//       alert("Incorrect solution!");
//     }
//   };

//   const resetPuzzle = () => {
//     setTimer(0);
//     setTimerOn(false);
//     setIsSolved(false);
//     setConflictCells([]);
//     setGrid([
//       [5, 3, 0, 0, 7, 0, 0, 0, 0],
//       [6, 0, 0, 1, 9, 5, 0, 0, 0],
//       [0, 9, 8, 0, 0, 0, 0, 6, 0],
//       [8, 0, 0, 0, 6, 0, 0, 0, 3],
//       [4, 0, 0, 8, 0, 3, 0, 0, 1],
//       [7, 0, 0, 0, 2, 0, 0, 0, 6],
//       [0, 6, 0, 0, 0, 0, 2, 8, 0],
//       [0, 0, 0, 4, 1, 9, 0, 0, 5],
//       [0, 0, 0, 0, 8, 0, 0, 7, 9],
//     ]);
//   };

//   const handleCellClick = (row, col) => {
//     setSelectedCell({ row, col });
//   };

//   const handleNumberInput = (num) => {
//     if (selectedCell && !isSolved) {
//       const { row, col } = selectedCell;
//       if (isValid(grid, row, col, num)) {
//         const newGrid = [...grid];
//         newGrid[row][col] = num;
//         setGrid(newGrid);
//       } else {
//         alert("Invalid move!");
//       }
//     }
//   };

//   const renderGrid = () => {
//     return grid.map((row, rowIndex) => (
//       <tr key={rowIndex}>
//         {row.map((cell, colIndex) => (
//           <td
//             key={colIndex}
//             className={`cell ${selectedCell &&
//               selectedCell.row === rowIndex &&
//               selectedCell.col === colIndex &&
//               "selected"} ${cell === 0 && "empty"} ${
//               conflictCells.find(
//                 (conflict) => conflict.row === rowIndex && conflict.col === colIndex
//               ) &&
//               "conflict"
//             }`}
//             onClick={() => handleCellClick(rowIndex, colIndex)}
//           >
//             {cell === 0 ? (
//               <input
//                 type="number"
//                 min="1"
//                 max="9"
//                 onChange={(e) => handleNumberInput(parseInt(e.target.value))}
//               />
//             ) : (
//               cell
//             )}
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   const pauseResumeTimer = () => {
//     setTimerOn((prevTimerOn) => !prevTimerOn);
//   };

//   return (
//     <div className='bg'>
//     <br/>  
//       <h1>Sudoku Solver</h1>
//       <div className="buttons">
//         <button onClick={solveSudoku}>Solve Sudoku</button>
//         <button onClick={checkSolution}>Check Solution</button>
//         <button onClick={resetPuzzle}>Reset Puzzle</button>
//         <button onClick={pauseResumeTimer}>
//           {timerOn ? "Pause Timer" : "Resume Timer"}
//         </button>
//       </div>
//       <div className="timer">Timer: {timer} seconds</div> {/* Added className="timer" */}
//       <table>
//         <tbody>{renderGrid()}</tbody>
//       </table>
//       {isSolved && <div className="message">Puzzle Solved!</div>}
//     </div>
//   );
// };

// export default SudokuSolver;
