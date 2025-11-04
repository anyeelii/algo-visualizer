import { useState } from "react";

export default function DFSSimulation() {
  const [graphInput, setGraphInput] = useState("");
  const [startNode, setStartNode] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSteps([]);
    setCurrentStep(0);

    // Example input format: A:B,C; B:D; C:D,E; D:; E:
    // Converts to { A: ["B", "C"], B: ["D"], C: ["D", "E"], D: [], E: [] }
    const graph = Object.fromEntries(
      graphInput.split(";").map((pair) => {
        const [node, neighbors] = pair.split(":");
        return [node.trim(), neighbors ? neighbors.split(",").map(n => n.trim()) : []];
      })
    );

    const response = await fetch("http://localhost:8000/algorithms/api/graph-searches/dfs/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ graph, start: startNode }),
    });

    const data = await response.json();

    setSteps(data.steps || []);

  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Depth-First Search Simulation</h2>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          value={graphInput}
          onChange={(e) => setGraphInput(e.target.value)}
          placeholder="Enter graph, e.g. A:B,C; B:D; C:D,E"
          className="border p-2 rounded w-96"
        />
        <input
          type="text"
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
          placeholder="Start Node"
          className="border p-2 rounded w-20"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-400 text-white rounded"
        >
          Run
        </button>
      </form>

      {/* Simulation */}
      {steps.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2 mt-4">
            {steps[currentStep]?.visited.map((node, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded text-white font-bold ${
                  idx === steps[currentStep].current ? "bg-yellow-400" : "bg-blue-500"
                }`}
              >
                {node}
              </div>
            ))}
          </div>

          <p className="mt-4">Step {currentStep + 1} / {steps.length}</p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Back
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
