import React from "react";
import { Button } from "../../../components/button";
import { GmailStep1 } from "../../../components/pageComponents/accounts/link/stepsToAddAccount/gmail/step1";
import { GmailStep2 } from "../../../components/pageComponents/accounts/link/stepsToAddAccount/gmail/step2";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import { EmailProvider, prevAddEmailStep } from "../../../redux/slices/steps";
import { useRouter } from "next/router";
import { SelectProvider } from "../../../components/pageComponents/accounts/link/stepsToAddAccount/selectProvider";
import { SMTPStep1 } from "../../../components/pageComponents/accounts/link/stepsToAddAccount/smtp/step1";

const LinkAccount = () => {
  const currentStep = useAppSelector(
    (state) => state.state.addEmailState.currentStep
  );
  const router = useRouter();

  const dispatch = useAppDispatch();

  const CurrentStep = () => {
    if (currentStep.step === 0) return <SelectProvider />;
    switch (currentStep.type) {
      case EmailProvider.null:
        return <SelectProvider />;
      case EmailProvider.Gmail:
        switch (currentStep.step) {
          case 1:
            return <GmailStep1 />;
          case 2:
            return <GmailStep2 />;
        }
      case EmailProvider.Any:
        switch (currentStep.step) {
          case 1:
            return <SMTPStep1 />;
        }
    }
  };

  return (
    <div className="flex flex-1 flex-col p-5">
      <Button
        title="Back"
        iconSrc="/svg/arrow-left.svg"
        preset="secondary"
        onPress={() =>
          currentStep.step === 1 ? router.back() : dispatch(prevAddEmailStep())
        }
      />
      <div className="flex flex-1 flex-col p-5 items-center">
        <CurrentStep />
      </div>
    </div>
  );
};

export default LinkAccount;
