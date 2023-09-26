import React, { useEffect } from "react";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import {
  StepIndicator,
  StepConfig,
} from "../../components/pageComponents/home/partials/stepIndicator";
import { Step1 } from "../../components/pageComponents/home/steps/step1";
import { Step2 } from "../../components/pageComponents/home/steps/step2";
import { Step3 } from "../../components/pageComponents/home/steps/step3";
import { Step4 } from "../../components/pageComponents/home/steps/step4";
import { Step5 } from "../../components/pageComponents/home/steps/step5";
import { useAppSelector } from "../../redux/store";
import Router, { useRouter } from "next/router";
import { useProcessor } from "../../utils/processorProvider";

export enum HomeSteps {
  emailType = "email-type",
  uploadCSV = "upload-csv",
  mapColumns = "map-columns",
  brainstorming = "brainstorming",
  completed = "completed",
}

const stepConfig: StepConfig[] = [
  { variant: 1 },
  { variant: 1 },
  { variant: 1 },
  { variant: 0.5 },
  { variant: 0 },
];

const CurrentStep = ({
  currentStep,
}: {
  currentStep: HomeSteps | undefined;
}) => {
  console.log("CurrentStepCurrentStep : ", currentStep);
  switch (currentStep) {
    case HomeSteps.emailType:
    case undefined:
      return <Step1 />;
    case HomeSteps.uploadCSV:
      return <Step2 />;
    case HomeSteps.mapColumns:
      return <Step3 />;
    case HomeSteps.brainstorming:
      return <Step4 />;
    case HomeSteps.completed:
      return <Step5 />;
  }
};

const getCurrentStep = (currentStep: HomeSteps) => {
  switch (currentStep) {
    case HomeSteps.emailType:
    case undefined:
      return 1;
    case HomeSteps.uploadCSV:
      return 2;
    case HomeSteps.mapColumns:
      return 3;
    case HomeSteps.brainstorming:
      return 4;
    case HomeSteps.completed:
      return 5;
  }
};

const HomeScreen = () => {
  const router = useRouter();
  const { step } = router.query;
  const { processing } = useProcessor();
  const { currentStep } = router.query;


  // if there is an ongoing process, on home a person should be directed to Brainstorming screen
  useEffect(() => {
    if (
      [
        HomeSteps.mapColumns,
        HomeSteps.uploadCSV,
        HomeSteps.emailType,
      ]?.includes(currentStep as HomeSteps) &&
      processing
    )
      Router.push({
        pathname: "/home",
        query: { step: HomeSteps.brainstorming },
      });
  }, [currentStep]);

  return (
    <div className="flex flex-1">
      <div className="flex flex-1 p-5 flex-col">
        <StepIndicator
          currentStep={getCurrentStep(step as HomeSteps)}
          totalSteps={5}
        />
        <CurrentStep currentStep={step as HomeSteps} />
      </div>
      <div>
        <img
          src="/svg/home-side-vector.svg"
          className="flex flex-1 w-auto h-fit"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
};

export default HomeScreen;
