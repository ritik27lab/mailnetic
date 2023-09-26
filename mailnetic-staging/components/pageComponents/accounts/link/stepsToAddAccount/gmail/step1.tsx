import React from "react";
import Button from "../../../../../button";
import {
  nextAddEmailStep,
  prevAddEmailStep,
} from "../../../../../../redux/slices/steps";
import { useAppDispatch } from "../../../../../../redux/store";

export const GmailStep1 = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="accounts_add-account-container">
      <div
        onClick={() => dispatch(prevAddEmailStep())}
        className="flex flex-row border-bottom-light cursor-pointer"
        style={{ width: "100%" }}
      >
        <img src="/svg/arrow-left-gray.svg" className=" w-5 h-5" />
        <p
          style={{
            fontSize: "16px",
            lineHeight: "19px",
            fontWeight: "600",
            paddingBottom: "20px",
            paddingInline: "10px",
            color: "#7D7D7D",
          }}
        >
          Select Another Provider
        </p>
      </div>
      <div className="flex flex-col" style={{ width: "100%" }}>
        <div className="flex flex-row mt-8 flex-1 items-center p-1  cursor-pointer">
          <img src="/svg/google-provider.svg" className="h-11 w-11 mr-4" />
          <div>
            <p
              style={{
                fontSize: "20px",
                lineHeight: "24px",
                fontWeight: "500",
                color: "#000",
                marginBottom: "2px",
              }}
            >
              Connect Your Google Account
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "19px",
                fontWeight: "600",
                color: "#7D7D7D",
              }}
            >
              Gmail / G-Suite
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row border-bottom-light py-5"
        style={{ width: "100%" }}
      >
        <p
          style={{
            fontSize: "16px",
            lineHeight: "19px",
            fontWeight: "600",
            color: "#7D7D7D",
            textAlign: "center",
            paddingInline: "20px",
            whiteSpace: "normal",
            display: "inline",
          }}
        >
          First, let’s <span style={{ color: "#6666FF" }}>enable IMAP</span>{" "}
          access for your Google account.
        </p>
      </div>
      <div className="flex flex-col py-5" style={{ width: "100%" }}>
        <p>1. On your computer, open Gmail.</p>
        <p>2. Click the gear icon in the top right corner.</p>
        <p> 3. Click All settings.</p>
        <p>
          4. Click the{" "}
          <span style={{ color: "#6666FF" }}>Forwarding and POP/IMAP</span> tab.
        </p>
        <p>5. Within “IMAP access”, select Enable IMAP.</p>
        <p> 6. Click Save Changes.</p>
      </div>
      <div
        className="flex flex-row cursor-pointer"
        style={{
          fontSize: "16px",
          lineHeight: "20px",
          fontWeight: "500",
          color: "#7D7D7D",
        }}
      >
        Show me how{" "}
        <img src="/svg/arrow-right-gray.svg" style={{ marginLeft: "2px" }} />
      </div>
      <Button
        onPress={() => dispatch(nextAddEmailStep())}
        containerStyle={{
          padding: "15px",
          paddingInline: "20px",
          marginTop: "30px",
          alignSelf: "center",
        }}
        title="Yes, IMAP has been enabled"
        iconSrc="/svg/arrow-right-white.svg"
        preset={"primary"}
        iconPosition="right"
      />
      <div className="mt-8 cursor-pointer">
        <p
          style={{
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "700",
            color: "#6666FF",
          }}
        >
          Cancel
        </p>
      </div>
    </div>
  );
};
