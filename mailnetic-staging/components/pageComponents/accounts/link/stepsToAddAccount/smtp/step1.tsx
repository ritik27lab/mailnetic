import React, { useEffect, useState } from "react";
import Button from "../../../../../button";
import Router from "next/router";
import { updateEmails } from "../../../../../../utils";
import { EmailProvider } from "../../../../../../redux/slices/steps";

const validateEmail = (value) => {
  // Regular expression pattern for email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Return true if the value matches the email pattern, otherwise return false
  return emailPattern.test(value);
};
export const SMTPStep1 = () => {
  const [email, setEmail] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const onSubmit = async () => {
    setButtonLoading(true);
    await updateEmails({
      emailAddress: email,
      host,
      port,
      type: EmailProvider.Any,
    });
    Router.push({ pathname: "/accounts" });
    setButtonLoading(false);
  };

  useEffect(() => {
    if (isValid && host?.length > 0 && port.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [isValid, host, port]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Perform email validation logic and update `isValid` state accordingly
    setIsValid(validateEmail(event.target.value));
  };

  const handleHostChange = (event) => {
    setHost(event.target.value);
  };
  const handlePortChange = (event) => {
    setPort(event.target.value);
  };

  return (
    <div className="accounts_add-account-container">
      <p
        className="border-bottom-light"
        style={{
          fontSize: "24px",
          lineHeight: "44px",
          textAlign: "center",
          fontWeight: "600",
          paddingBottom: "20px",
          paddingInline: "10px",
          width: "100%",
        }}
      >
        Configure SMTP
      </p>
      <div className="flex flex-col" style={{ width: "100%" }}>
        <div className="flex flex-row mt-8 flex-1 items-center p-1  cursor-pointer">
          <input
            className={`input-default`}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email (Eg : sid@sight3.io)"
          />
        </div>
        <div className="flex flex-row flex-1 items-center p-1  cursor-pointer">
          <input
            className={`input-default`}
            type="email"
            value={host}
            onChange={handleHostChange}
            placeholder="Host (Eg: imap.secureserver.net)"
          />
        </div>
        <div className="flex flex-row flex-1 items-center p-1  cursor-pointer">
          <input
            className={`input-default`}
            type="number"
            value={port}
            onChange={handlePortChange}
            placeholder="Port (Eg: 997)"
          />
        </div>
        <p style={{ textAlign: "center", color: "red" }}>
          You will be asked for password on on every campaign.
        </p>
      </div>
      <Button
        loading={buttonLoading}
        title="Continue"
        onPress={onSubmit}
        preset="primary"
        containerStyle={{
          marginTop: "20px",
          width: "100%",
          justifyContent: "center",
        }}
        disabled={isButtonDisabled}
      />
    </div>
  );
};
