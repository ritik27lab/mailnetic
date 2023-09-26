import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { checkEmailVerification, firebaseConfig, getUser } from "../../utils";
import { collection, getDocs } from "firebase/firestore/lite";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Image from "next/image";
import "../../styles/login.module.css";
import { colors } from "../../styles";
import { SignIn } from "../../components/pageComponents/login/steps/signIn";
import { VerifyEmail } from "../../components/pageComponents/login/steps/verifyEmail";
import { VerifyPhone } from "../../components/pageComponents/login/steps/verifyPhone";
import { BuildProfile } from "../../components/pageComponents/login/steps/buildProfile";

import { useLoader } from "../../utils/providers";

export enum LoginSteps {
  signin = "sign-in",
  buildProfile = "build-profile",
  verifyEmail = "verify-email",
  verifyPhone = "verify-phone",
}

const GetCurrentStep = (step: string) => {
  switch (step) {
    case LoginSteps.signin:
    case undefined:
      return <SignIn />;
    case LoginSteps.buildProfile:
      return <BuildProfile />;
    case LoginSteps.verifyEmail:
      return <VerifyEmail />;
    case LoginSteps.verifyPhone:
      return <VerifyPhone />;
  }
};

export const Login = () => {
  const { startLoader, stopLoader } = useLoader();
  const router = useRouter();
  const { step } = router.query;
  const auth = firebase.auth();

  const handleAuthStateChange = async (user) => {
    startLoader();
    const res = await getUser();
    if (user?.uid) {
      console.log("RES RES : res", res);
      if (res === undefined) {
        Router.push({
          pathname: "/login",
          query: { step: LoginSteps.buildProfile },
        });
      } else {
        router.push("/home");
      }
    }
    stopLoader();
  };

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      handleAuthStateChange(user);
    });
  }, []);

  return (
    <div className="parent-container-pre-login">
      <Image
        src="/svg/background.svg"
        style={{ objectFit: "cover" }}
        fill
        alt="Background SVG"
      />
      <div className="content-container-pre-login">
        <img
          src="/svg/mail-pilot-logo.svg"
          alt="Logo"
          className="logo-default"
        />
        {GetCurrentStep(step as string)}
      </div>
    </div>
  );
};

export default Login;
