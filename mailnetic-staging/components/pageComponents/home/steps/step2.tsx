import React, { useRef, useState } from "react";
import Button from "../../../button";
import { useAppDispatch, useAppSelector } from "../../../../redux/store";
import {
  nextHomeState,
  prevHomeState,
  setCSV,
  setCurrentHomeStep,
} from "../../../../redux/slices/steps";
import Router, { useRouter } from "next/router";
import { HomeSteps } from "../../../../pages/home";
import { guessEmailTag, guessWebsiteTag } from "../../../../utils";
import Papa from "papaparse";
import { colors } from "../../../../styles";

export const Step2 = () => {
  const drop = React.useRef(null);
  const [over, setOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef(null);

  const defaultFile = useAppSelector((s) => s.state.csv.file);

  // State to store parsed data
  const [parsedData, setParsedData] = useState([]);

  //State to store table Column name
  const [tableRows, setTableRows] = useState([]);

  //State to store the values
  const [values, setValues] = useState([]);
  const [file, setFile] = useState(defaultFile);
  const [selectedEmailLabel, setSelectedEmailLabel] = useState("");
  const [selectedWebsiteLabel, setSelectedWebsiteLabel] = useState("");

  const handleBrowse = () => {
    fileInputRef.current.click();
  };

  const resetCSV = () => {
    setFile({});
    setTableRows([]);
    setSelectedEmailLabel("");
    setSelectedWebsiteLabel("");
    setParsedData([]);
    dispatch(
      setCSV({
        parseData: [],
        labels: { email: "", website: "", size: "", name: "" },
        rows: [],
        file: {},
      })
    );
    fileInputRef.current.value = [];
  };

  const onCSVImport = () => {
    if (!parsedData?.length || !tableRows.length) return;
    dispatch(
      setCSV({
        parseData: parsedData,
        labels: {
          email: selectedEmailLabel,
          website: selectedWebsiteLabel,
          size: "",
          name: "",
        },
        rows: tableRows,
        file,
      })
    );
  };

  const next = () => {
    onCSVImport();
    dispatch(setCurrentHomeStep({ step: HomeSteps.mapColumns }));
    Router.push({
      pathname: "/home",
      query: { step: HomeSteps.mapColumns },
    });
  };

  const prev = () => {
    dispatch(setCurrentHomeStep({ step: HomeSteps.emailType }));
    Router.push({
      pathname: "/home",
      query: { step: HomeSteps.emailType },
    });
  };

  React.useEffect(() => {
    if (!drop.current) return;
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);

    // return () => {
    //   drop.current.removeEventListener("dragover", handleDragOver);
    //   drop.current.removeEventListener("drop", handleDrop);
    //   drop.current.removeEventListener("dragenter", handleDragEnter);
    //   drop.current.removeEventListener("dragleave", handleDragLeave);
    // };
  }, [drop]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const { files } = e.dataTransfer;

    if (files && files.length) {
      console.log("FILENAME", files);
      onCSVSelect(files[0]);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
  };

  const onCSVSelect = (file) => {
    if (!file?.name) return;
    console.log("CSV FILE :", file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });
        console.log("ROWS  : ", rowsArray[0]);
        console.log("setParsedData  : ", results.data);
        console.log("setValues  : ", valuesArray);

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);

        // Filtered Values
        setValues(valuesArray);

        // saving file for later use
        setFile(file);

        setSelectedWebsiteLabel(guessWebsiteTag(rowsArray[0]));
        setSelectedEmailLabel(guessEmailTag(rowsArray[0]));
      },
    });
  };

  return (
    <div>
      <p className="header-1 mt-7">Upload Your CSV</p>
      <p className="descriptive-1">Make sure to use the provided template.</p>
      <div ref={drop} className="drag-container" 
              onClick={handleBrowse}
              >
        {over ? (
          <div className="flex align-middle items-center justify-center">
            <img src="/svg/loader.svg" className="rotating h-40 w-40 " />
            {uploading && (
              <p
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "32px",
                  lineHeight: "39px",
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                }}
                className="absolute"
              >
                50%
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="home_upload-cloud-icon-container">
              <img src="/svg/upload-cloud.svg" />
            </div>
            {/* <p
              style={{
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "30px",
                color: "#101828",
              }}
            >
              Drag CSV here
            </p> */}
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "24px",
                color: "#98A2B3",
                textAlign: "center",
                letterSpacing: "-0.16px",
              }}
              className="cursor-pointer"
            >
              <span style={{ color: colors.primary }}>Click to upload </span>or,
              or drag and drop
              <br />
              CSV or XLSM (max. 10MB)
            </p>
          </>
        )}
      </div>
      {file?.name && (
        <div className="home-step-uploaded-csv-container relative">
          <img src="/svg/csv-format.svg" className=" h-10 w-10 mr-3" />
          <div>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "16px",
                lineHeight: "24px",
                color: "#101828",
              }}
            >
              {file?.name}
            </p>
            <p
              style={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#98A2B3",
              }}
            >
              {(file?.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <img
            src="/svg/x.svg"
            className=" absolute right-3 w-7 h-7 cursor-pointer"
            onClick={resetCSV}
          />
        </div>
      )}
      {/* <div className="or-divider-container my-5">
        <div className="or-divider" />
        <p className="text-light mx-5 text-lg" style={{ color: "#98A2B3" }}>
          OR
        </p>
        <div className="or-divider" />
      </div>
      <div>
        <p
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "18px",
            lineHeight: "22px",
            color: "#171821",
          }}
        >
          Upload from URL
        </p>
      </div> */}
      <div className="flex flex-row mt-5">
        <Button
          title="Back"
          iconSrc="/svg/arrow-left.svg"
          preset="secondary"
          containerStyle={{ marginRight: "20px" }}
          onPress={prev}
        />
        <Button
          title="Import"
          iconSrc="/svg/upload.svg"
          preset="primary"
          onPress={next}
          disabled={!file?.name}
        />
      </div>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={(e) => onCSVSelect(e.target.files[0])}
        placeholder=""
        style={{ display: "none" }}
        aria-selected={false}
        ref={fileInputRef}
      />
    </div>
  );
};
