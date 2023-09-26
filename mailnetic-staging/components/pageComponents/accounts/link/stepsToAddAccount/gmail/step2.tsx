import React, { useState } from "react";
import { colors } from "../../../../../../styles";
import { useAppDispatch } from "../../../../../../redux/store";
import { prevAddEmailStep } from "../../../../../../redux/slices/steps";

const options = [
  {
    title: "Option 1: oAuth",
    bulletPoints: [
      { content: "Easier to setup", available: true },
      { content: "More stable and less disconnects", available: true },
      { content: "Available for G-Suite accounts", available: true },
    ],
    recommended: true,
  },
  {
    title: "Option 2: App Password",
    bulletPoints: [
      { content: "Available for personal accounts", available: true },
      { content: "Requires 2-factor authentication", available: false },
      { content: "More prone to disconnects", available: false },
    ],
    recommended: false,
  },
];

export const GmailStep2 = () => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const dispatch = useAppDispatch();

  return (
    <div className="accounts_select-connection-options-container">
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
      <p
        className="py-7"
        style={{
          fontSize: "16px",
          lineHeight: "19px",
          fontWeight: "600",
          color: "#6666FF",
          textAlign: "center",
          paddingInline: "20px",
          whiteSpace: "normal",
          display: "inline",
        }}
      >
        Select a connection option
      </p>

      <div className="flex flex-row mb-7">
        {options.map((i, index) => (
          <div
            className="accounts_select-connection-options-option-container cursor-pointer"
            onClick={() => setSelectedOptionIndex(index)}
            style={{
              backgroundColor:
                selectedOptionIndex === index ? colors.primary : "#FFF",
              marginRight: index === 0 && "15px",
              marginLeft: index === 1 && "15px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                lineHeight: "22px",
                fontWeight: "700",
                color: selectedOptionIndex === index ? "#FFF" : colors.primary,
                textAlign: "center",
              }}
            >
              {i.title}
            </p>
            <div style={{ marginTop: "30px", marginBottom: "20px" }}>
              {i.bulletPoints.map((j) => (
                <div
                  style={{ width: "100%", marginBottom: "10px" }}
                  className="flex flex-row items-center"
                >
                  {j.available ? (
                    <div
                      className=" flex items-center justify-center"
                      style={{
                        height: "20px",
                        width: "20px",
                        borderRadius: "10px",
                        backgroundColor:
                          selectedOptionIndex === index
                            ? "#FFF"
                            : colors.primary,
                        marginRight: "10px",
                      }}
                    >
                      <img
                        src={
                          selectedOptionIndex === index
                            ? "/svg/tick-primary.svg"
                            : "/svg/tick-white.svg"
                        }
                        style={{ height: "10px", width: "10px" }}
                      />
                    </div>
                  ) : (
                    <img
                      src="/svg/alert-circle.svg"
                      className=" h-5 w-5"
                      style={{ marginRight: "10px" }}
                    />
                  )}
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "17px",
                      fontWeight: "600",
                      color:
                        selectedOptionIndex === index
                          ? "#FFF"
                          : colors.blackLogo,
                    }}
                  >
                    {j.content}
                  </p>
                </div>
              ))}
            </div>
            {i.recommended && (
              <div
                className="accounts_option-recommended-tag-container"
                style={{
                  backgroundColor:
                    selectedOptionIndex === index ? "#FFF" : colors.primary,
                  color:
                    selectedOptionIndex === index ? colors.blackLogo : "#FFF",
                }}
              >
                Recommended
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="flex flex-row  cursor-pointer"
        style={{
          alignSelf: "baseline",
          fontSize: "16px",
          lineHeight: "20px",
          fontWeight: "500",
          color: "#7D7D7D",
        }}
      >
        <img
          src="/svg/arrow-right-gray.svg"
          className="rotate-180"
          style={{ marginRight: "5px" }}
        />
        Back
      </div>
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
