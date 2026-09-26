
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
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Binary Search Simulation</h2>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="Sorted array (e.g. 1, 3, 5, 7, 9)"
          className="border border-gray-300 p-2 rounded-md flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="number"
          value={targetInput}
          onChange={(e) => setTargetInput(e.target.value)}
          placeholder="Target"
          className="border border-gray-300 p-2 rounded-md w-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-sm transition-colors"
        >
          Run
        </button>
      </form>

      {/* Simulation */}
      {steps.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Midpoint
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-sm"></div> L/R Bounds
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div> Active Space
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-dashed border-gray-300 rounded-sm"></div> Discarded
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Found!
            </div>
          </div>

          {/* Array Visualization */}
          <div className="flex flex-wrap gap-3 mt-4 min-h-[4rem] items-center">
            {arrayInput.split(",").map((num, idx) => {
              const { left, mid, right, found } = steps[currentStep] || {};
              
              // Default styling (Active Space)
              let colorClasses = "bg-gray-300 text-gray-800 shadow-sm"; 
              let transformClasses = "scale-100";
              let borderClasses = "border border-transparent";

              // 1. Out of bounds (Discarded)
              if (idx > right || idx < left) {
                colorClasses = "bg-gray-50 text-gray-300";
                borderClasses = "border border-dashed border-gray-300";
              }
              // 2. Left / Right Pointers
              if (idx === left || idx === right) {
                colorClasses = "bg-blue-400 text-white shadow-md font-semibold";
              }
              // 3. Midpoint
              if (idx === mid) {
                colorClasses = "bg-yellow-400 text-yellow-900 shadow-md font-bold";
                transformClasses = "scale-110 z-10"; // Make the midpoint pop out slightly
              }
              // 4. Target Found
              if (found && idx === mid) {
                colorClasses = "bg-green-500 text-white shadow-lg font-bold";
                transformClasses = "scale-110 animate-bounce z-10";
              }

              return (
                <div
                  key={idx}
                  className={`w-12 h-12 flex items-center justify-center rounded-md transition-all duration-300 ${colorClasses} ${transformClasses} ${borderClasses}`}
                >
                  {num.trim()}
                </div>
              );
            })}
          </div>

          {/* Explanation Step */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
            <h3 className="text-sm font-bold text-blue-800 mb-1">What's happening?</h3>
            <p className="text-gray-700">
              {(() => {
                const step = steps[currentStep];
                if (!step) return null;

                const { left, mid, right, found } = step;
                const array = arrayInput.split(",").map((num) => parseInt(num.trim()));
                const target = parseInt(targetInput);
                const midValue = array[mid];

                if (found) {
                  return <span><strong>{midValue}</strong> matches the target. Target found!</span>;
                } else if (left > right) {
                  return <span>Left pointer is greater than Right pointer. Target is not in the array.</span>;
                } else if (midValue < target) {
                  return <span><strong>{midValue}</strong> (midpoint) &lt; <strong>{target}</strong> (target), so Left bound becomes midpoint + 1 (index {mid + 1}).</span>;
                } else if (midValue > target) {
                  return <span><strong>{midValue}</strong> (midpoint) &gt; <strong>{target}</strong> (target), so Right bound becomes midpoint - 1 (index {mid - 1}).</span>;
                }
                return null;
              })()}
            </p>
          </div>


          {/* Controls */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="font-medium text-gray-600">
              Step <span className="text-gray-900">{currentStep + 1}</span> of {steps.length}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={previousStep}
                disabled={currentStep === 0}
                className="px-5 py-2 bg-gray-800 text-white rounded-md font-medium transition-colors hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
