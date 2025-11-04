import { useNavigate } from "react-router-dom";
import { Split, Search, Network, Layers } from "lucide-react"; // icon library (lucide-react)
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();

  const algorithms = [
    {
      title: "Array Algorithms",
      description: "Visualize alogorithms with array inputs.",
      path: "/array/"
    },
    {
      title: "Merge Sort",
      category: "Array Algorithms",
      description: "Visualize how merge sort sorts an array through divide and conquer.",
      icon: <Split className="w-10 h-10 text-orange-500" />,
      path: "/array/merge-sort",
    },
    {
      title: "Binary Search",
      category: "Array Algorithms",
      description: "Visualize how binary search divides and conquers a sorted array.",
      icon: <Search className="w-10 h-10 text-green-500" />,
      path: "/array/binary-search",
    },
    {
      title: "Depth-First Search (DFS)",
      category: "Graph Algorithms",
      description: "Explore how DFS traverses graphs deeply before backtracking.",
      icon: <Network className="w-10 h-10 text-blue-500" />,
      path: "/graph/dfs",
    },
    {
      title: "Breadth-First Search (BFS)",
      category: "Graph Algorithms",
      description: "Watch BFS explore all neighboring nodes level by level.",
      icon: <Layers className="w-10 h-10 text-purple-500" />,
      path: "/graph/bfs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-10">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-800 mb-2"
        >
          Algorithm Visualizer
        </motion.h1>

        <p className="text-gray-600 mb-10">
          Learn how algorithms work through step-by-step visual simulations.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
         {algorithms.map((algo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-lg rounded-2xl p-6 cursor-pointer hover:shadow-2xl transition"
              onClick={() => navigate(algo.path)}
            >
              <div className="flex justify-center mb-4">{algo.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {algo.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{algo.category}</p>
              <p className="text-gray-600 text-sm">{algo.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
