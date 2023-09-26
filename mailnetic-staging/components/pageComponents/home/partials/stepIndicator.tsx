import React from "react";

export interface StepConfig {
  variant: 0 | 0.5 | 1;
}

const getStepBackground = (index: number, currentStep: number) => {
  if (index < currentStep) return "#6666FF";
  if (index > currentStep) return "#D0D5DD";
  if (index === currentStep) return "rgba(102, 102, 255, 0.5)";
};

export const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  totalSteps: number;
  currentStep: number;
}) => {
  return (
    <div>
      <div className="flex-row flex ">
        {Array(totalSteps)
          .fill(null)
          .map((i, index) => {
            // return <div className={getStepClass(i.variant)}></div>;
            return (
              <div
                className="step blinking"
                style={{
                  backgroundColor: getStepBackground(index+1, currentStep),
                }}
              ></div>
            );
          })}
      </div>
      <p className="descriptive-2 mt-4">
        {currentStep} of {totalSteps}
      </p>
    </div>
  );
};
