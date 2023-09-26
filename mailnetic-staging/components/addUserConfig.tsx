import React, { useState } from "react";
import Modal from "./Modal";

const options = [
  { label: "GMAIL", value: "smtp.gmail.com" },
  { label: "OUTLOOK", value: "smtp.secureserver.com" },
  { label: "OTHERS", value: "" },
];

export const AddUserConfig = ({show, setShow}) => {

  const [smtp, setSmtp] = useState("");

  return (
    <Modal title="Select SMTP :" onClose={() => setShow(false)} show={show}>
      <div className="flex flex-col">
        {options.map((i) => (
          <div
            className="cursor-pointer inline-flex  mb-1"
            onClick={() => setSmtp(i.value)}
          >
            <input
              readOnly
              type="radio"
              checked={smtp === i.value}
              value={i.value}
              name="smtp"
            />
            <p className="ml-1">{i.label}</p>
          </div>
        ))}
        {smtp === "" && (
          <>
            <input placeholder="host (eg: smtp.secureserver.net)" />
            <input placeholder="port (eg: 584)" />
          </>
        )}
      </div>
    </Modal>
  );
};
