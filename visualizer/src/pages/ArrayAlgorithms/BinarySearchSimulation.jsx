
import { useState, useEffect } from "react";
import { runAlgorithm } from "../../api";

export default function BinarySearchSimulation() {
  const [arrayInput, setArrayInput] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);


  const handleSubmit = async (e) => {
    e.preventDefault(),
    setSteps([]),
    setCurrentStep(0);

    const array = arrayInput.split(",").map(num => parseInt(num.trim()));
    const target = parseInt(targetInput);

    try {
      const data = await runAlgorithm("array", "binary", { array, target });
      setSteps(data.steps || []);
    }
    catch (error) {
      console.error("Failed to fetch simulation steps: ", error);
    }
  };


  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    console.log(currentStep)
  };

  const previousStep = () => {
    if (currentStep >= 0) {
      setCurrentStep(currentStep - 1);
    }
  }


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Binary Search Simulation</h2>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="Enter sorted array, e.g. 1,3,5,7,9"
          className="border p-2 rounded w-80"
        />
        <input
          type="number"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          placeholder="Target"
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
          <div className="flex space-x-4 mt-4">
            {arrayInput.split(",").map((num, idx) => {
              const { left, mid, right, found } = steps[currentStep] || {};
              let color = "bg-gray-400";
              if (idx > right | idx < left) color = "bg-gray-100";
              if (idx === mid) color = "bg-yellow-400";
              if (idx === left) color = "bg-blue-400";
              if (idx === right) color = "bg-blue-400";
              if (found && idx === mid) color = "bg-green-400";


              return (
                <div
                  key={idx}
                  className={`w-12 h-12 flex items-center justify-center rounded ${color}`}
                >
                  {num.trim()}
                </div>
              );
            })}
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
