import { initializeApp } from "firebase/app";
import { User, getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  getFirestore,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { LinkedEmailAccount, UserConfig } from ".";
import store from "../redux/store";
import { setUserDetails } from "../redux/slices/steps";

export const firebaseConfig = {
  apiKey: "AIzaSyBc80D7CHOpJvlEnlaGbj4RUC32hHFZKlU",
  authDomain: "mailpilot-61ae7.firebaseapp.com",
  projectId: "mailpilot-61ae7",
  storageBucket: "mailpilot-61ae7.appspot.com",
  messagingSenderId: "715857902073",
  appId: "1:715857902073:web:28dee0dde8b52c60c06528",
  measurementId: "G-1X1EYDQ0X7",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);

export const checkEmailVerification = async (user: firebase.User) => {
  if (user && !user.emailVerified) {
    try {
      await user.sendEmailVerification();
      console.log("Verification email sent!");
    } catch (error) {
      console.log("Error sending verification email:", error);
    }
  }
};

export const getUser = async (defaultUID?: string) => {
  try {
    const uid = firebase.auth().currentUser?.uid;
    console.log("UUIIDDD", defaultUID || uid);
    const userDocRef = doc(firestoreDB, "users", uid);

    const docSnap = await getDoc(userDocRef);
    return docSnap.data() as UserConfig;
  } catch (err) {
    return undefined;
  }
};

export const updateUser = async (userDetails: UserConfig) => {
  const uid = firebase.auth().currentUser?.uid;

  console.log("UID", uid);
  const userDocRef = doc(firestoreDB, "users", uid);
  const docSnap = await getDoc(userDocRef);
  // Add a new document in collection "cities"
  console.log("USER DOC : ", docSnap.data());
  // dispatch(setUserDetails({ ...userDetails }));
  try {
    await setDoc(doc(firestoreDB, "users", uid), userDetails);
  } catch (err) {
    console.log("updateUserConfig ERR : ", err);
  }
};

export const updateUserConfig = async (config: UserConfig, uid: string) => {
  try {
    await setDoc(doc(firestoreDB, uid), config);
    syncUser();
  } catch (err) {
    console.log("updateUserConfig ERR : ", err);
  }
};

export const updateEmails = async (emailAccount: LinkedEmailAccount) => {
  const uid = firebase.auth().currentUser?.uid;
  const userDocRef = doc(firestoreDB, "users", uid);
  // Atomically add a new region to the "regions" array field.
  await updateDoc(userDocRef, {
    emailAccounts: arrayUnion(emailAccount),
  });
};

export const updateEmailSetting = async (
  newEmailAccounts: LinkedEmailAccount[]
) => {
  const uid = firebase.auth().currentUser?.uid;
  const userDocRef = doc(firestoreDB, "users", uid);
  // Atomically add a new region to the "regions" array field.
  await updateDoc(userDocRef, {
    emailAccounts: newEmailAccounts,
  });
  syncUser();
};

export const syncUser = async (uid?: string) => {
  const user = await getUser(uid);
  if (user) {
    console.log("USER SYNC USER : ", user);
    store.dispatch(setUserDetails(user as UserConfig));
  }
  return user;
};
