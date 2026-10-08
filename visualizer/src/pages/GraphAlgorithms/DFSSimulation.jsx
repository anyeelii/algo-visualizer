import { useState, useMemo } from "react";
import { runAlgorithm } from "../../api";

export default function DFSSimulation() {
  const [graphInput, setGraphInput] = useState("");
  const [startNode, setStartNode] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedGraph, setParsedGraph] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSteps([]);
    setCurrentStep(0);

    const graph = Object.fromEntries(
      graphInput.split(";").map((pair) => {
        const [node, neighbors] = pair.split(":");
        return [
          node.trim(),
          neighbors ? neighbors.split(",").map((n) => n.trim()) : [],
        ];
      })
    );

    setParsedGraph(graph);

    try {
      const data = await runAlgorithm("graph", "dfs", { graph, start: startNode });
      setSteps(data.steps || []);
    } catch (error) {
      console.error("Failed to fetch simulation steps:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // --- Graph Layout Calculation ---
  // Memoize this so it only recalculates when the parsedGraph changes
  const { nodes, nodePositions, edges } = useMemo(() => {
    if (!parsedGraph) return { nodes: [], nodePositions: {}, edges: [] };

    // Extract all unique nodes (keys and values)
    const uniqueNodes = Array.from(
      new Set([
        ...Object.keys(parsedGraph),
        ...Object.values(parsedGraph).flat(),
      ])
    );

    // Circular layout math
    const radius = 120;
    const center = 160; 
    const positions = {};
    
    uniqueNodes.forEach((node, i) => {
      const angle = (i / uniqueNodes.length) * 2 * Math.PI - Math.PI / 2;
      positions[node] = {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    });

    // Create edge list for drawing lines
    const edgeList = [];
    Object.entries(parsedGraph).forEach(([source, targets]) => {
      targets.forEach((target) => {
        if (positions[source] && positions[target]) {
          edgeList.push({ source, target });
        }
      });
    });

    return { nodes: uniqueNodes, nodePositions: positions, edges: edgeList };
  }, [parsedGraph]);

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Depth-First Search Simulation</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          placeholder="Adjacency List (e.g., A:B,C; B:D; C:D,E)"
          className="border border-gray-300 p-2 rounded-md flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
          placeholder="Start Node"
          className="border border-gray-300 p-2 rounded-md w-32 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-sm transition-colors"
        >
          Run
        </button>
      </form>

      {steps.length > 0 && parsedGraph && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          
          <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div> Active Node
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div> Visited
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded-full"></div> Unvisited
            </div>
          </div>

          {/* SVG Graph Visualization */}
          <div className="flex justify-center my-8">
            <svg width="320" height="320" className="overflow-visible">
              {/* Define Arrowhead marker for directed edges */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="25" /* Push arrow back so it doesn't hide under the node circle */
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
                </marker>
              </defs>

              {/* Draw Edges */}
              {edges.map((edge, idx) => (
                <line
                  key={`edge-${idx}`}
                  x1={nodePositions[edge.source].x}
                  y1={nodePositions[edge.source].y}
                  x2={nodePositions[edge.target].x}
                  y2={nodePositions[edge.target].y}
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              ))}

              {/* Draw Nodes */}
              {nodes.map((node) => {
                const step = steps[currentStep];
                const visitedNodes = step?.visited || [];
                const activeNode = visitedNodes[step?.current];
                
                const isCurrent = node === activeNode;
                const isVisited = visitedNodes.includes(node);

                let fill = "#f3f4f6"; // gray-100
                let stroke = "#9ca3af"; // gray-400
                let textColor = "#374151"; // gray-700

                if (isCurrent) {
                  fill = "#facc15"; // yellow-400
                  stroke = "#ca8a04"; // yellow-600
                  textColor = "#713f12"; // yellow-900
                } else if (isVisited) {
                  fill = "#3b82f6"; // blue-500
                  stroke = "#2563eb"; // blue-600
                  textColor = "#ffffff";
                }

                return (
                  <g key={`node-${node}`} className="transition-all duration-300">
                    <circle
                      cx={nodePositions[node].x}
                      cy={nodePositions[node].y}
                      r="18"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    <text
                      x={nodePositions[node].x}
                      y={nodePositions[node].y}
                      textAnchor="middle"
                      dy=".3em"
                      fill={textColor}
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Explanation Step */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md shadow-sm">
            <h3 className="text-sm font-bold text-blue-800 mb-2">What's happening?</h3>
            <p className="text-gray-700 text-sm">
              {(() => {
                const step = steps[currentStep];
                if (!step) return null;

                if (step.action === "visit") {
                  if (!step.parent) {
                    return <span>Starting Depth-First Search at root node <strong>{step.node}</strong>. Marking it as visited.</span>;
                  }
                  return <span>Following the edge from <strong>{step.parent}</strong> to explore deeper into <strong>{step.node}</strong>. Marking it as visited.</span>;
                } 
                
                if (step.action === "backtrack") {
                  return <span>Finished exploring all paths from <strong>{step.from_node}</strong>. Backtracking up the tree to <strong>{step.node}</strong> to check for unexplored neighbors.</span>;
                } 
                
                if (step.action === "complete") {
                  return <span>DFS traversal complete! Final visited path: <strong>{step.visited.join(" → ")}</strong>.</span>;
                }

                return null;
              })()}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t pt-4">
            <p className="font-medium text-gray-600">
              Step <span className="text-gray-900">{currentStep + 1}</span> of {steps.length}
            </p>
            <div className="flex space-x-3">
              <button onClick={previousStep} disabled={currentStep === 0} className="px-5 py-2 bg-gray-800 text-white rounded-md font-medium transition-colors hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Back
              </button>
              <button onClick={nextStep} disabled={currentStep === steps.length - 1} className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}