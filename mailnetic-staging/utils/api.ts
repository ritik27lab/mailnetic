import axios from "axios";
import { EmailConfig } from "../redux/slices/steps";

const BASE_URL = "https://mailpilot-staging-ij6b.vercel.app";

export const sendSignInLink = async (email: string) => {
  try {
    console.log("sending link to ", email);
    const res = await axios.post(BASE_URL + "/send-signin-link", { email });
    console.log("sendSingInLink : ", res);
    return res.data?.code;
  } catch (err) {
    console.log("sendSingInLink : ERR ", err);
    return "- - - -";
  }
};

export const sendEmail = async ({
  emailConfig,
  toAddress,
  email: { subject, email },
}: {
  emailConfig: EmailConfig;
  toAddress: string;
  email: { subject: string; email: string };
}) => {
  try {
    console.log("sendEmail  : emailConfig", emailConfig);
    console.log("sendEmail  : toAddress", toAddress);
    console.log("sendEmail  : email", email);
    console.log("sendEmail  : subject", subject);
    const res = await axios.post(BASE_URL + "/send-email", {
      host: emailConfig.host,
      port: emailConfig.port,
      from: {
        name: emailConfig.name,
        email: emailConfig.emailAddress,
        password: emailConfig.password,
      },
      email: {
        to: toAddress,
        subject,
        html: email,
      },
    });
    return res;
  } catch (err) {
    return undefined;
  }
};
