import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as loadingJson from "../public/lottie/loading.json";
import Lottie from "react-lottie";
import { scrapeData } from "./generateMails";
import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { EmailConfig, addToEmails } from "../redux/slices/steps";

const ProcessorContext = React.createContext({
  startProcessing: () => {},
  stopProcessing: () => {},
  progress: 0,
  status: "",
  metadata: {},
  processing: false,
  setEmailConfig: (s: EmailConfig) => {},
  emailConfig: undefined,
});

export function ProcessorProvider({ children }) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [status, setStatus] = useState("");
  const [emailConfig, setEmailConfig] = useState<EmailConfig | undefined>(
    undefined
  );
  const [metadata, setMetadata] = useState({});
  const csv = useAppSelector((s) => s.state.csv);
  const dispatch = useDispatch();

  const increaseFailedCount = () => {
    setFailedCount((prevState) => prevState + 1);
  };

  const startProcessing = () => {
    if (processing) return;
    setProcessing(true);
    scrapeData(
      csv.labels.website,
      csv.parseData,
      setProgress,
      setStatus,
      setMetadata,
      addEmail,
      increaseFailedCount
    );
  };

  const addEmail = (x: { email: string; metadata: any; data: any }) => {
    dispatch(addToEmails({...x}));
  };

  const stopProcessing = () => {
    console.log("STOP PROCESSING");
    // setLoading(false);
  };

  const value = React.useMemo(
    () => ({
      processing,
      startProcessing,
      stopProcessing,
      progress,
      status,
      metadata,
      setEmailConfig,
      emailConfig,
    }),
    [
      startProcessing,
      stopProcessing,
      metadata,
      progress,
      status,
      setEmailConfig,
      emailConfig,
    ]
  );

  return (
    <ProcessorContext.Provider value={value}>
      {children}
    </ProcessorContext.Provider>
  );
}

export const useProcessor = () => React.useContext(ProcessorContext);
