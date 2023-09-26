import React from "react";
import { EmailProvider } from "../../../../../redux/slices/steps";
import { useAppSelector, useAppDispatch } from "../../../../../redux/store";
import { setAddEmailProcessType } from "../../../../../redux/slices/steps";
import { useRouter } from "next/router";

const options = [
  {
    icon: "/svg/google-provider.svg",
    provider: EmailProvider.Gmail,
    value: EmailProvider.Gmail,
    label: "Gmail / G-Suite",
    disabled: true,
  },
  {
    icon: "/svg/outlook.svg",
    provider: EmailProvider.Outlook,
    value: EmailProvider.Outlook,
    label: "Office 365 / Outlook",
    disabled: true,
  },
  {
    icon: "/svg/mailchain.svg",
    provider: EmailProvider.Mailchain,
    value: EmailProvider.Mailchain,
    label: "Mailchain Web3 Mail",
    disabled: true,
  },
  {
    icon: "/svg/google-provider.svg",
    provider: "Any Provider",
    value: EmailProvider.Any,
    label: "IMAP / SMTP",
    disabled: false,
  },
];

export const SelectProvider = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
        }}
      >
        Connect a new email account
      </p>
      <div className="flex flex-col" style={{ width: "100%" }}>
        {options.map((i) => (
          <div
            onClick={() =>!i.disabled &&  dispatch(setAddEmailProcessType({ type: i.value }))}
            className="flex flex-row mt-8 flex-1 items-center p-1 cursor-pointer"
            style={{ opacity: i.disabled ? 0.3 : 1 }}
          >
            <img src={i.icon} className="h-11 w-11 mr-4" />
            <div>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  fontWeight: "500",
                  color: "#7D7D7D",
                }}
              >
                {i.provider}
              </p>
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "24px",
                  fontWeight: "600",
                  color: "#000",
                }}
              >
                {i.label}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        className=" mt-8 cursor-pointer"
        onClick={() => router.push("/accounts")}
      >
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
