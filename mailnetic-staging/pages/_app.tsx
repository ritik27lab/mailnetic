import "../styles/global.css";
import Router, { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "../redux/store";

import { useEffect } from "react";
import { firebaseConfig, syncUser } from "../utils";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import SideTopbar from "../components/SideTopbar";
import { LoaderProvider, useLoader } from "../utils/providers";
import { LoginSteps } from "./login";
import { ProcessorProvider } from "../utils/processorProvider";
import { ToastProvider, useToast } from "../utils/toastProvider";

firebase.initializeApp(firebaseConfig);

let lastTimeoutId: any;

export default function MyApp({ Component, pageProps }) {
  return (
    <LoaderProvider>
      <MailPilot Component={Component} pageProps={pageProps} />
    </LoaderProvider>
  );
}

const MailPilot = ({ Component, pageProps }) => {
  const router = useRouter();

  const auth = firebase.auth();
  const { startLoader, stopLoader } = useLoader();
  const { addToast } = useToast();

  useEffect(() => {
    auth.onAuthStateChanged(async function (user) {
      startLoader();
      if (lastTimeoutId) clearTimeout(lastTimeoutId);
      const id = setTimeout(async () => {
        console.log("INSIDE TIMEOUT  : ", router.route, user);
        if (user?.uid) {
          const res = await syncUser(user.uid);
          if (res === undefined) {
            Router.push({
              pathname: "/login",
              query: { step: LoginSteps.buildProfile },
            });
          } else {
            addToast({
              title: "Logged In Successfully !",
              message: "Logged in as " + res?.name,
              appearance: "success",
            });
            if (router.route !== "/login") {
              router.push("/home");
            }
          }
        } else {
          if (router.route !== "/login" && router.route !== "/") {
            router.push("/login");
          }
        }
        stopLoader();
      }, 2000);
      lastTimeoutId = id;
    });
  }, []);
  return (
    <Provider store={store}>
      <ToastProvider>
        <ProcessorProvider>
          <main className="main-container">
            <SideTopbar>
              <Component {...pageProps} />
            </SideTopbar>
          </main>
        </ProcessorProvider>
      </ToastProvider>
    </Provider>
  );
};
