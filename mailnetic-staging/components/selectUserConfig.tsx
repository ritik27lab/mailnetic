import React, { useState } from "react";
import Modal from "./Modal";
import { AddUserConfig } from "./addUserConfig";

const options = [
  {
    name: "Jirazo J",
    position: "Technical Director",
    company: "Sight3",
    email: "sid@sight3.io",
  },
  {
    name: "John Doe",
    position: "Technical Director",
    company: "Linkites",
    email: "sid@link.com",
  },
];

export const SelectUserConfig = ({ show, setShow }) => {
  const [selected, setSelected] = useState(options?.[0]);
  const [addModalShow, setAddModalShow] = useState(false);

  return (
    <>
      <Modal title="Select User :" onClose={() => setShow(false)} show={show}>
        <div className="flex flex-col">
          {options.map((i) => (
            <div
              className={`cursor-pointer inline p-2 mb-1 border-2 ${
                selected === i && "border-yellow-400"
              }`}
              onClick={() => setSelected(i)}
            >
              <p className="ml-1">{i.email}</p>
              <p className="ml-1">Name : {i.name}</p>
              <p className="ml-1">position : {i.position}</p>
              <p className="ml-1">Company : {i.company}</p>
            </div>
          ))}
          <button onClick={() => setShow(false)}>Continue</button>
          <button onClick={() => setAddModalShow(true)}>Add</button>
        </div>
      </Modal>
      <AddUserConfig show={addModalShow} setShow={setAddModalShow} />
    </>
  );
};
