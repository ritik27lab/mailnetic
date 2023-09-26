import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as loadingJson from "../public/lottie/loading.json";
import Lottie from "react-lottie";

const LoaderContext = React.createContext({
  startLoader: () => {},
  stopLoader: () => {},
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingJson,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const startLoader = () => {
    console.log("START LOADING");
    setLoading(true);
  };
  const stopLoader = () => {
    console.log("STOP LOADING");
    setLoading(false);
  };

  const value = React.useMemo(
    () => ({ startLoader, stopLoader }),
    [startLoader, stopLoader]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {loading && (
          <motion.div
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "absolute",
              zIndex: 999,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              flex: 1,
              opacity: 1,
              display: "flex",
              top: 0,
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            exit={{ opacity: 0 }}
          >
            <Lottie
              options={defaultOptions}
              height={400}
              width={400}
              isStopped={false}
              isPaused={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}

export const useLoader = () => React.useContext(LoaderContext);
