import React, { useRef, useState } from "react";

export const VerifyPhone = () => {
  const [otp, setOTP] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value !== "") {
      if (index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleInputPaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string | any[] };
  }) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 4);
    const newOTP = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 4) {
        newOTP[i] = pastedData[i];
      }
    }
    setOTP(newOTP);
    inputRefs.current[pastedData.length - 1].focus();
  };

  const handleInputKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };
  return (
    <>
      <div className="content-child-container-pre-login">
        <p className="text-5xl text-center font-medium">
          💬 Please enter the
          <br />
          code sent to you
        </p>
        <div className="inline-flex flex-row my-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              className={`otp-input h-16 w-16`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e)}
              onPaste={handleInputPaste}
              onKeyDown={(e) => handleInputKeyDown(index, e)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          ))}
        </div>
        <button
          className={`primary-button ${otp.join("")?.length === 4 && "active"}`}
        >
          Continue
        </button>
        <p className="text-light">
          An OTP has been sent to 🇰🇭 +855 ****1287
          <br />
          Please enter the OTP to continue
        </p>
      </div>
      <p className="text-light">Resend code in 50s</p>
    </>
  );
};
