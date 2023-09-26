import React from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "../../../redux/store";
import Button from "../../../components/button";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const Settings = () => {
  const currentStep = useAppSelector(
    (state) => state.state.addEmailState.currentStep
  );
  const router = useRouter();
  const  auth = firebase.auth()
  const logOut = () => {auth.signOut()};

  return (
    <div className="flex flex-1 flex-col p-5 k">
      <p className="header-1 mb-5">Account Settings</p>

      <div className="home_mail-content-container relative">
        <Button
          title="Log Out"
          preset="primary"
          containerStyle={{ position: "absolute", right: 20, bottom: 10 }}
          onPress={logOut}
        />
      </div>
    </div>
  );
};

export default Settings;
