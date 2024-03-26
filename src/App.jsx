// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TNavbar from "./components/TNavbar";

import SudokuSolver from "./components/Sudoko/sudoko";
function App() {
  return (
    <Router>
    
    <Routes>
        <Route path="/" element={<SudokuSolver />} />
        </Routes>
    </Router>
  );
}

export default App;
