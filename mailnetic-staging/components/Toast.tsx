import { colors } from "../styles";
import { DefaultToast } from "react-toast-notifications";
import { AnimatePresence, motion } from "framer-motion";

const getColorPallete = (appearance: AppearanceType) => {
  switch (appearance) {
    case "error":
      return { border: colors.danger400, background: colors.danger50 };
    case "info":
      return { border: colors.info100, background: colors.info50 };
    case "success":
      return { border: colors.success300, background: colors.success50 };
    case "warning":
      return { border: colors.warn300, background: colors.warn50 };
  }
};
export type AppearanceType = "success" | "warning" | "info" | "error";

export interface ToastProps {
  appearance: AppearanceType;
  title: string;
  message: string;
  id?: number;
}

interface ToastCompProps extends ToastProps {
  dismiss: () => void;
}

export const Toast = ({
  appearance,
  title,
  message,
  dismiss,
}: ToastCompProps) => {
  const colorPallete = getColorPallete(appearance);
  return (
    // <DefaultToast {...props} appearance={undefined}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className="toast-container"
        style={{
          borderColor: colorPallete.border,
          backgroundColor: colorPallete.background,
        }}
      >
        <img src={`/svg/${appearance}.svg`} />
        <div className="ml-5 flex flex-col flex-1">
          <p className="toast-title">{title}</p>
          <p className="toast-message">{message}</p>
        </div>
        <img
          src="svg/x-light.svg"
          className=" cursor-pointer"
          onClick={dismiss}
        />
      </div>
    </motion.div>
    // </DefaultToast>
  );
};
