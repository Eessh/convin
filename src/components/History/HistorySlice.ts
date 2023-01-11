import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type THistory = {
  cardName: string,
  link: string,
  time: string
};

interface IHistoryState {
  value: THistory[]
};

const initialState: IHistoryState = {
  value: []
};

export const HistorySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory: (state, action: PayloadAction<THistory>) => {
      state.value = [...state.value, action.payload];
    }
  }
});

export const { addHistory } = HistorySlice.actions;
export const selectHistory = (state: RootState) => state.history.value;
export default HistorySlice.reducer;