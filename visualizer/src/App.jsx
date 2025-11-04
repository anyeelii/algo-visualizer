import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BinarySearchSimulation from "./pages/ArrayAlgorithms/BinarySearchSimulation";
import DFSSimulation from "./pages/GraphAlgorithms/DFSSimulation"; 
import Array from "./pages/ArrayAlgorithms/ArrayHomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/array/" element={<Array />} />
        <Route path="/array/binary-search" element={<BinarySearchSimulation />} />
        <Route path="/graph/dfs" element={<DFSSimulation />} />
      </Routes>
    </Router>
  );
}

export default App;
