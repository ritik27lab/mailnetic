import { useEffect, useState } from "react";
import { colors } from "../../../../styles";
import { useRouter } from "next/router";
import { sendSignInLink } from "../../../../utils";
import Router from "next/router";
import { LoginSteps } from "../../../../pages/login";
import Button from "../../../button";

export const VerifyEmail = () => {
  const router = useRouter();
  const { email , code} = router.query;
  const [emailJustSent, setEmailJustSent] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(60);

  useEffect(() => {
    if (emailJustSent) {
      setTimeout(() => setCurrentTimer(currentTimer - 1),1000)
    }
    if (currentTimer === 0) {
      setEmailJustSent(false);
    }
  }, [currentTimer]);

  const resendEmail = async () => {
    setSending(true)
    const code = await sendSignInLink(email as string);
    Router.push({
      pathname: "/login",
      query: { step: LoginSteps.verifyEmail, email, code },
    });
    setSending(false)
    setCurrentTimer(60);
    setEmailJustSent(true);
  };

  const goToInbox = () => {
    const newWindow = window.open(
      "https://mail.google.com/mail/u/0/#inbox",
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <>
      <div className="content-child-container-pre-login">
        <p className="text-5xl text-center font-medium">
          🔓 Please verify
          <br />
          your email account
        </p>
        <p className="text-5xl my-16 text-center font-medium">{code}</p>
        <Button
          title="Go to Inbox"
          preset="primary"
          containerStyle={{ width: "100%", marginBottom: "20px" }}
          onPress={goToInbox}
        />
        <p className="text-light">
          Please confirm that the email sent to <br />
          {email} has the same login code
        </p>
      </div>
      <p className="text-light">
        Didn’t receive an email?{" "}
        <p style={{ color: emailJustSent  ? colors.lightGrey :colors.primary }} onClick={resendEmail}>
          Resend {emailJustSent && (currentTimer)}
        </p>
      </p>
    </>
  );
};
