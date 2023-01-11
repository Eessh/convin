import { configureStore } from "@reduxjs/toolkit";
import HistorySliceReducer from "../components/History/HistorySlice";
import BucketsSliceReducer from "../components/Beautiful_DnD/BucketsSlice";

export const store = configureStore({
  reducer: {
    history: HistorySliceReducer,
    buckets: BucketsSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;