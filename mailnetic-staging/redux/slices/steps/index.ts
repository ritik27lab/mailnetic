import { createSlice } from "@reduxjs/toolkit";
import store, { RootState } from "../../store";
import { HomeSteps } from "../../../pages/home";
import { LinkedEmailAccount, UserConfig, scrapeData } from "../../../utils";

export interface MappedLabels {
  email: string;
  website: string;
  size: string;
  name: string;
}

export enum PurposeType {
  campaign = "New Campaign",
  editEmails = "Edit Emails",
  null = "",
}

export enum EmailProvider {
  Gmail = "Google",
  Outlook = "Outlook",
  Mailchain = "Mailchain",
  Any = "Any",
  null = null,
}
interface CSVDetails {
  parseData: Array<any>;
  rows: Array<any>;
  labels: MappedLabels;
  file: any;
}
interface Email {
  email: string;
  metadata: any;
  data: any;
}

export interface EmailConfig extends LinkedEmailAccount {
  password: string;
}

export interface StepType {
  user: UserConfig;
  csv: CSVDetails;
  emails: Array<Email>;
  addEmailState: {
    currentStep: { type: EmailProvider; step: number };
  };
  homeState: { currentStep: HomeSteps; purpose: PurposeType };
  selectedEmailConfig: EmailConfig;
  processing: {
    progress: number;
    status: string;
    metadata: any;
  };
}

const initialState: StepType = {
  user: {
    email: "",
    name: "",
    jobTitle: "",
    description: [],
    photoUrl: "",
    company: {
      name: "",
      description: "",
    },
  },
  csv: {
    parseData: [],
    rows: [],
    labels: { email: "", website: "", size: "", name: "" },
    file: {},
  },
  emails: [],
  addEmailState: {
    currentStep: { type: EmailProvider.null, step: 0 },
  },
  homeState: {
    currentStep: HomeSteps.emailType,
    purpose: PurposeType.null,
  },
  selectedEmailConfig: {
    password: "",
    type: EmailProvider.Any,
    emailAddress: "",
  },
  processing: {
    progress: 0,
    status: "",
    metadata: {},
  },
};

const stepSlice = createSlice({
  name: "stepState",
  initialState,
  reducers: {
    setUserDetails: (state, action: { payload: UserConfig; type: string }) => {
      state.user = action.payload;
    },
    setCSV: (state, action: { payload: CSVDetails; type: string }) => {
      state.csv = { ...action.payload };
    },
    updateEmails: (state, action: { payload: Array<Email>; type: string }) => {
      state.emails = [...action.payload];
    },
    addToEmails: (state, action: { payload: Email; type: string }) => {
      state.emails = [...state.emails, { ...action.payload }];
    },
    updateEmailAtIndex: (
      state,
      action: { payload: { email: string; index: number }; type: string }
    ) => {
      const temp = [...state.emails];
      temp[action.payload.index] = {
        ...temp[action.payload.index],
        email: action.payload.email,
      };
      state.emails = [...temp];
    },
    nextAddEmailStep: (state) => {
      state.addEmailState.currentStep.step++;
    },
    prevAddEmailStep: (state) => {
      state.addEmailState.currentStep.step--;
    },
    setAddEmailProcessType: (
      state,
      action: { payload: { type: EmailProvider } }
    ) => {
      state.addEmailState.currentStep.type = action.payload.type;
      state.addEmailState.currentStep.step = 1;
    },
    nextHomeState: (state) => {
      // if (state.homeState.currentStep < 5) state.homeState.currentStep++;
    },
    prevHomeState: (state) => {
      // if (state.homeState.currentStep > 1) state.homeState.currentStep--;
    },
    setHomePurposeType: (
      state,
      action: { payload: { purpose: PurposeType } }
    ) => {
      state.homeState.purpose = action.payload.purpose;
    },
    setCurrentHomeStep: (state, action: { payload: { step: HomeSteps } }) => {
      state.homeState.currentStep = action.payload.step;
    },
    mapColumns: (state, action: { payload: MappedLabels }) => {
      state.csv.labels = action.payload;
    },
    setEmailConfig: (state, action: { payload: EmailConfig }) => {
      state.selectedEmailConfig = action.payload;
    },
    setProgress: (state, action: { payload: number }) => {
      state.processing.progress = action.payload;
    },
    setMetadata: (state, action: { payload: any }) => {
      state.processing.metadata = action.payload;
    },
    setStatus: (state, action: { payload: string }) => {
      state.processing.status = action.payload;
    },
    //   startProcessing: (state, action) => {
    //     console.log("startProcessing metadata", action.payload);
    //     const thunkFunction = (dispatch, getState) => {
    //       // logic here that can dispatch actions or read state
    //     }

    //     store.dispatch(thunkFunction)

    //     function syncProgress(progress) {
    //       return function (dispatch) {
    //         dispatch(setProgress(progress));
    //       };
    //     }
    //     function syncMetadata(metadata) {
    //       return function (dispatch) {
    //         dispatch(setMetadata(metadata));
    //       };
    //     }
    //     scrapeData(
    //       state.csv.labels.website,
    //       action.payload,
    //       syncProgress,
    //       syncStatus,
    //       syncMetadata,
    //       addToEmails
    //     );
    //   },
  },
});

export const {
  setCSV,
  mapColumns,
  setUserDetails,
  updateEmails,
  addToEmails,
  setStatus,
  setMetadata,
  updateEmailAtIndex,
  nextAddEmailStep,
  prevAddEmailStep,
  nextHomeState,
  setCurrentHomeStep,
  prevHomeState,
  setHomePurposeType,
  setAddEmailProcessType,
  setProgress,
  setEmailConfig,
} = stepSlice.actions;
export const selectAllSteps = (state: RootState) => state.state;
export default stepSlice.reducer;
