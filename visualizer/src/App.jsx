import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BinarySearchSimulation from "./pages/ArrayAlgorithms/BinarySearchSimulation";
import DFSSimulation from "./pages/GraphAlgorithms/DFSSimulation"; 
// import Array from "./pages/ArrayAlgorithms/ArrayHomePage";

function App() {
  return (

    <Router>
      {/* Global Navigation Bar */}
      <nav className="bg-green-900 text-white px-8 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400 transition-colors">
          Algorithm Visualizer
        </Link>
        <div className="flex space-x-6">
          <Link to="/" className="font-medium hover:text-blue-400 transition-colors">
            Home
          </Link>
          {/* <Link to="/array/" className="font-medium hover:text-blue-400 transition-colors">
            Arrays
          </Link> */}
        </div>
      </nav>


    {/* Main Page Content */}
      <main className="min-h-screen bg-gray-50 pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/array/" element={<Array />} /> */}
          <Route path="/array/binary-search" element={<BinarySearchSimulation />} />
          <Route path="/graph/dfs" element={<DFSSimulation />} />
        </Routes>
      </main>
    </Router>
    
  );
}

export default App;
