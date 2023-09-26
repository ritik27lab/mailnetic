import {
  combineReducers,
  configureStore,
  applyMiddleware,
} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import stepSlice from "./slices/steps";

const rootReducer = combineReducers({
  state: stepSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: rootReducer,
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;