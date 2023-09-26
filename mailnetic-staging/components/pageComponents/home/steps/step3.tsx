import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactModal from "react-modal";
import Select from "react-select";
import Router from "next/router";
import { Menu, MenuItem } from "@szhsin/react-menu";

import Button from "../../../button";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import {
  mapColumns,
  setCurrentHomeStep,
  setEmailConfig,
} from "../../../../redux/slices/steps";
import { HomeSteps } from "../../../../pages/home";
import { colors } from "../../../../styles";
import { updateEmailSetting, validateEmail } from "../../../../utils";
import { useProcessor } from "../../../../utils/processorProvider";
import { index } from "cheerio/lib/api/traversing";

const columns = [
  {
    label: "Company",
    exampleDescription: "Sight3 Technologies Ltd.",
  },
  {
    label: "Size",
    exampleDescription: "1-15",
  },
  {
    label: "Website",
    exampleDescription: "https://sight3.io",
  },
  {
    label: "Email",
    exampleDescription: "matt@sight3.io",
  },
];

const getDescription = (mode) => {
  switch (mode) {
    case "delete":
      return (
        <>
          By clicking <span style={{ color: colors.danger400 }}>DELETE</span>{" "}
          you confirm that you would like
          <br />
          to remove this email address from your account.
        </>
      );

    case "edit":
      return (
        <>
          Having issues sending out emails? Check that your
          <br />
          configuration settings are correctly written.
        </>
      );
    case "select":
      return (
        <>
          Please enter the password that you would
          <br />
          use to login to this email address.
        </>
      );
  }
};

export const Step3 = () => {
  // const { setEmailConfig } = useProcessor();
  const dispatch = useAppDispatch();
  const selectRefs = useRef([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const rows = useAppSelector((s) => s.state.csv.rows);
  const labels = useAppSelector((s) => s.state.csv.labels);
  const linkedEmails = useAppSelector((s) => s.state.user.emailAccounts);
  const [tempLinkedEmails, setTempLinkedEmails] = useState(
    linkedEmails?.map((i) => {
      return { ...i, password: "" };
    })
  );
  const [mappedCols, setMappedCols] = useState(columns.map((i) => undefined));
  const photoUrl = useAppSelector((s) => s.state.user.photoUrl);
  const [selectedEmail, setSelectedEmail] = useState<{
    index: undefined | number;
    mode: "select" | "edit" | "delete" | undefined;
  }>({ index: undefined, mode: undefined });
  const passwordInputRefs = useRef([]);
  const hostEditRefs = useRef([]);
  const portEditRefs = useRef([]);
  const emailEditRefs = useRef([]);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [continueLoading, setContinueLoading] = useState(false);

  const next = () => {
    console.log("next");
    setContinueLoading(true);
    mapCols();
    dispatch(setCurrentHomeStep({ step: HomeSteps.brainstorming }));
    setTimeout(() => {
      setContinueLoading(false);
      Router.push({
        pathname: "/home",
        query: { step: HomeSteps.brainstorming },
      });
    }, 1000);
  };

  const prev = () => {
    dispatch(setCurrentHomeStep({ step: HomeSteps.uploadCSV }));
    Router.push({
      pathname: "/home",
      query: { step: HomeSteps.uploadCSV },
    });
  };

  useEffect(() => {
    if (selectRefs?.current?.length > 0) {
      selectRefs.current[2].setValue({
        label: labels.website,
        value: labels.website,
      });
      selectRefs.current[3].setValue({
        label: labels.email,
        value: labels.email,
      });
    }
  }, [selectRefs]);

  const mapCols = () => {
    dispatch(
      mapColumns({
        name: selectRefs.current[0].getValue()[0]?.value,
        size: selectRefs.current[1].getValue()[0]?.value,
        website: selectRefs.current[2].getValue()[0]?.value,
        email: selectRefs.current[3].getValue()[0]?.value,
      })
    );
  };

  const onContinue = async () => {
    if (selectedEmail.index !== undefined && selectedEmail.index !== -1) {
      if (selectedEmail?.mode === "edit") {
        setContinueLoading(true);
        await updateEmailSetting(
          tempLinkedEmails.map((i) => {
            return {
              host: i.host,
              emailAddress: i.emailAddress,
              port: i.port,
              type: i.type,
            };
          })
        );
        setContinueLoading(false);
        setSelectedEmail({ index: undefined, mode: undefined });
      }
      if (selectedEmail?.mode === "delete") {
        setContinueLoading(true);
        const res = tempLinkedEmails
          .map((i) => {
            return {
              host: i.host,
              emailAddress: i.emailAddress,
              port: i.port,
              type: i.type,
            };
          })
          .filter((i, index) => index !== selectedEmail.index);
        await updateEmailSetting(res);
        setTempLinkedEmails(
          tempLinkedEmails.filter((i, index) => index !== selectedEmail.index)
        );
        setContinueLoading(false);
        setSelectedEmail({ index: undefined, mode: undefined });
      }
      if (selectedEmail?.mode === "select") {
        // dispatch(setEmailConfig());
        dispatch(setEmailConfig(tempLinkedEmails[selectedEmail.index]));
        next();
      }
    }
  };

  const onSelectChange = () => {};

  useEffect(() => {
    console.log(
      "passwordInputRefs.current[selectedEmail.index]?.value",
      passwordInputRefs.current[selectedEmail.index]?.value
    );
    if (selectedEmail.index !== undefined && selectedEmail.index !== -1) {
      if (selectedEmail?.mode === "edit") {
        if (
          hostEditRefs.current[selectedEmail.index]?.value?.length > 0 &&
          portEditRefs.current[selectedEmail.index]?.value?.length > 0 &&
          validateEmail(emailEditRefs.current[selectedEmail.index]?.value)
        ) {
          setContinueDisabled(false);
        } else {
          setContinueDisabled(true);
        }
      }
      if (selectedEmail?.mode === "delete") {
        setContinueDisabled(false);
      }
      if (selectedEmail?.mode === "select") {
        if (passwordInputRefs.current[selectedEmail.index]?.value?.length > 0) {
          setContinueDisabled(false);
        } else {
          setContinueDisabled(true);
        }
      }
    } else {
      setContinueDisabled(true);
    }
  }, [
    selectedEmail,
    hostEditRefs.current[selectedEmail.index]?.value,
    portEditRefs.current[selectedEmail.index]?.value,
    emailEditRefs.current[selectedEmail.index]?.value,
    passwordInputRefs.current[selectedEmail.index]?.value,
  ]);

  const handleChange = (
    inputType: "host" | "port" | "password" | "emailAddress",
    index: number,
    value: string
  ) => {
    const temp = [...tempLinkedEmails];
    temp[index][inputType] = value;
    setTempLinkedEmails(temp);
  };

  return (
    <div className="flex flex-1 flex-col">
      <p className="header-1 mt-7">Map The Columns</p>
      <p className="descriptive-1">
        If not automatically detected, please assign the correct columns.
      </p>
      <div className="home_mail-content-container p-8 flex-col">
        <div className="flex flex-row justify-between pb-5 ">
          <p
            style={{
              fontWeight: "500",
              fontSize: "20px",
              lineHeight: "24px",
              alignItems: "center",
              color: "#000000",
            }}
          >
            Excel Columns
          </p>
          <p
            style={{
              fontWeight: "500",
              fontSize: "20px",
              lineHeight: "24px",
              alignItems: "center",
              color: "#000000",
            }}
          >
            Required Columns
          </p>
        </div>
        <div className="flex flex-1 flex-col overflow-scroll">
          {columns.map((i, index) => (
            <div className="flex flex-row justify-between py-6">
              <div className="flex flex-1 flex-col">
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "19px",
                    color: "#000000",
                    marginBottom: "6px",
                  }}
                >
                  {i.label}
                </p>
                <p
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                    lineHeight: "17px",
                    color: "#667085",
                  }}
                >
                  {i.exampleDescription}
                </p>
              </div>
              <img src="/svg/arrow-right.svg" className=" h-9 w-9" />
              <div className="flex flex-1 flex-col items-end">
                <Select
                  isMulti
                  ref={(el) => {
                    selectRefs.current[index] = el;
                  }}
                  options={rows.map((i) => {
                    return {
                      value: i,
                      label: i,
                    };
                  })}
                  unstyled
                  // defaultValue={{
                  //   label: getDefaultSelectValueFromIndex(index),
                  //   value: getDefaultSelectValueFromIndex(index),
                  // }}
                  isClearable
                  // onChange={(e) => {if(selectRefs.current[2].getValue()?.length ===) e.values[0]} }
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? colors.primary : "red",
                    }),
                    container: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused
                        ? colors.primary
                        : colors.light200,
                      borderWidth: "1px",
                      borderRadius: "12px",
                      backgroundColor: colors.neutral100,
                      height: 17 + 14 + 14,
                      paddingInline: 20,
                      alignItems: "center",
                      display: "flex",
                    }),
                    valueContainer: (baseStyles, state) => ({
                      ...baseStyles,
                      height: 26,
                    }),
                    menuPortal: (base, props) => ({
                      ...base,
                      position: "absolute",
                      // offset: 10,
                    }),
                    menuList: (base, props) => ({
                      ...base,
                      width: "290px",

                    }),
                    option: (base, props) => ({
                      ...base,
                      backgroundColor: colors.neutral100,
                      borderBottomWidth: "0.5px",
                      borderRightWidth:"0.5px",

borderLeftWidth     :"0.5px",                 bordeColor: colors.light200,
                      paddingInline: "10px",
                      paddingBlock: "5px",
                      width: "290px",
                    }),
                  }}
                  placeholder="Choose Coloumn"
                  classNamePrefix="home_custom-select"
                  hideSelectedOptions
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row mt-5">
        <Button
          title="Back"
          iconSrc="/svg/arrow-left.svg"
          preset="secondary"
          containerStyle={{ marginRight: "20px" }}
          onPress={prev}
        />
        <Button
          title="Edit Emails"
          iconSrc="/svg/cursor-click-white.svg"
          preset="primary"
          onPress={() => setModalOpen(true)}
        />
      </div>

      <ReactModal isOpen={isModalOpen} className="z-20">
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="home_select-email-modal-container z-20"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
              style={{ zIndex: 99999 }}
            >
              <div
                className="home_select-emial-modal-content-container relative z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-bottom-light pb-7 px-5 relative ">
                  <motion.p
                    className="h6 mb-3"
                    style={{
                      color: colors.neutral900,
                      textAlign: "center",
                    }}
                  >
                    {selectedEmail.index !== undefined
                      ? selectedEmail.mode === "edit"
                        ? "Edit Email Settings"
                        : selectedEmail.mode === "select"
                        ? "Enter Your Password"
                        : "Select Email Account"
                      : "Select Email Account"}
                  </motion.p>
                  <motion.p className="home_body-light-medium">
                    {selectedEmail.index !== undefined ? (
                      getDescription(selectedEmail.mode)
                    ) : (
                      <>
                        Please select an email to confirm your password
                        <br />
                        due to having chosen a manual connection.
                      </>
                    )}
                  </motion.p>
                  <img
                    onClick={() => setModalOpen(false)}
                    className=" absolute h-6 w-6 right-0 top-0 cursor-pointer"
                    src="/svg/x-light.svg"
                  />
                </div>
                <div className=" mt-7">
                  {tempLinkedEmails.map((i, index) => {
                    return (
                      <>
                        <motion.div
                          onClick={(e) => {
                            e.stopPropagation();
                            selectedEmail?.mode === undefined &&
                              setSelectedEmail({ index, mode: "select" });
                          }}
                          // custom={index}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          initial={{
                            opacity: 1,
                            height: 71,
                            marginBottom: "10px",
                          }}
                          animate={{
                            opacity:
                              selectedEmail.index === undefined
                                ? 1
                                : index === selectedEmail.index
                                ? 1
                                : 0,
                            height:
                              selectedEmail.index === undefined
                                ? 71
                                : index === selectedEmail.index
                                ? 71
                                : 0,
                            marginBottom:
                              selectedEmail.index === undefined
                                ? "10px"
                                : index === selectedEmail.index
                                ? "10px"
                                : "0px",
                          }}
                          layout
                          key={i.emailAddress}
                          className="home_email-option-container"
                        >
                          <div
                            className="flex flex-row items-center justify-between"
                            style={{ width: "100%" }}
                          >
                            <div className="flex flex-row items-center">
                              <img
                                src={photoUrl}
                                alt={i?.name}
                                className=" h-10 w-10"
                                style={{
                                  borderRadius: "20px",
                                  marginRight: "15px",
                                }}
                              />

                              <div className="flex-col flex">
                                <p
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {i?.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: colors.light300,
                                  }}
                                >
                                  {i.emailAddress}
                                </p>
                              </div>
                            </div>
                            <Menu
                              menuClassName={
                                "home_email-options-menu-container"
                              }
                              menuButton={
                                <img
                                  onClick={(e) => e.stopPropagation()}
                                  src="/svg/more.svg"
                                  className="h-6 w-6"
                                />
                              }
                            >
                              <MenuItem
                                className="flex flex-row items-center mb-1"
                                onClick={(e) => {
                                  e.syntheticEvent.stopPropagation();
                                  setSelectedEmail({ index, mode: "edit" });
                                }}
                              >
                                <img
                                  src="/svg/edit-white.svg"
                                  className="h-4 w-4 mr-1"
                                />
                                <p
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    letterSpacing: "-0.12px",
                                  }}
                                >
                                  Edit
                                </p>
                              </MenuItem>
                              <MenuItem
                                className="flex flex-row items-center"
                                onClick={(e) => {
                                  e.syntheticEvent.stopPropagation();
                                  setSelectedEmail({ index, mode: "delete" });
                                }}
                              >
                                <img
                                  src="/svg/trash.svg"
                                  className="h-4 w-4 mr-1"
                                />
                                <p
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    letterSpacing: "-0.12px",
                                  }}
                                >
                                  Delete
                                </p>
                              </MenuItem>
                            </Menu>
                          </div>
                        </motion.div>
                        {selectedEmail.index === index &&
                          selectedEmail.mode === "select" && (
                            <motion.input
                              initial={{ opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              animate={{ opacity: 1 }}
                              onChange={(e) => {
                                handleChange("password", index, e.target.value);
                              }}
                              security="true"
                              className="input-default"
                              placeholder="Enter Password"
                              defaultValue={i?.password}
                              ref={(el) =>
                                (passwordInputRefs.current[index] = el)
                              }
                            ></motion.input>
                          )}
                        {selectedEmail.index === index &&
                          selectedEmail.mode === "edit" && (
                            <>
                              <motion.input
                                initial={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                animate={{ opacity: 1 }}
                                className="input-default"
                                placeholder="Email"
                                ref={(el) =>
                                  (emailEditRefs.current[index] = el)
                                }
                                value={i.emailAddress}
                                onChange={(e) => {
                                  handleChange(
                                    "emailAddress",
                                    index,
                                    e.target.value
                                  );
                                }}
                              ></motion.input>
                              <motion.input
                                initial={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                animate={{ opacity: 1 }}
                                className="input-default"
                                placeholder="Host"
                                ref={(el) => (hostEditRefs.current[index] = el)}
                                value={i.host}
                                onChange={(e) => {
                                  handleChange("host", index, e.target.value);
                                }}
                              ></motion.input>
                              <motion.input
                                initial={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                animate={{ opacity: 1 }}
                                className="input-default"
                                placeholder="Port"
                                value={i.port}
                                ref={(el) => (portEditRefs.current[index] = el)}
                                type="number"
                                onChange={(e) => {
                                  handleChange("port", index, e.target.value);
                                }}
                              ></motion.input>
                            </>
                          )}
                      </>
                    );
                  })}
                  <motion.div
                    custom={-1}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    initial={{
                      opacity: 1,
                      height: 71,
                    }}
                    animate={{
                      opacity:
                        selectedEmail.index === undefined ||
                        selectedEmail.index === -1
                          ? 1
                          : 0,
                      height:
                        selectedEmail.index === undefined ||
                        selectedEmail.index === -1
                          ? 71
                          : 0,
                      marginBottom:
                        selectedEmail.index === undefined ||
                        selectedEmail.index === -1
                          ? "10px"
                          : 0,
                    }}
                    layout
                    key={"add-email"}
                    className="home_email-option-container"
                    onClick={() => Router.push("/accounts/link")}
                  >
                    <div className="flex flex-row items-center">
                      <div
                        className=" h-10 w-10 flex justify-center items-center"
                        style={{
                          borderRadius: "20px",
                          marginRight: "15px",
                          backgroundColor: colors.light200,
                        }}
                      >
                        <img src="/svg/plus-white.svg" className="h-6 w-6" />
                      </div>
                      <div className="flex-col flex">
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          Add Email Account
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: colors.light300,
                          }}
                        >
                          Link another email address
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="flex flex-row mt-5">
                  <Button
                    title="Back"
                    preset="secondary"
                    containerStyle={{ flex: 1, marginRight: "5px" }}
                    onPress={() => {
                      setSelectedEmail({ index: undefined, mode: undefined });
                      if (selectedEmail.index === undefined)
                        setModalOpen(false);
                    }}
                  />
                  <Button
                    title={
                      selectedEmail.index !== undefined &&
                      selectedEmail.mode === "delete"
                        ? "DELETE"
                        : "Continue"
                    }
                    preset={
                      selectedEmail.index !== undefined &&
                      selectedEmail.mode === "delete"
                        ? "delete"
                        : "primary"
                    }
                    containerStyle={{ flex: 1, marginLeft: "5px" }}
                    onPress={onContinue}
                    loading={continueLoading}
                    disabled={continueDisabled}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ReactModal>
    </div>
  );
};
