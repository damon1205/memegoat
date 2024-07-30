import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../store";
import { TokenInfo } from "alex-sdk";
import { dummyToken } from "@/data/constants";

export interface PairData {
  pair1: TokenInfo;
  pair2: TokenInfo;
  factor: number;
}

type actionType = PairData;

export interface PairSliceState {
  value: PairData;
  status: "active" | "inactive";
}

const initialState: PairSliceState = {
  value: { pair1: dummyToken, pair2: dummyToken, factor: 0 },
  status: "inactive",
};

export const tokenPairSlice = createAppSlice({
  name: "tokenPair",
  initialState,
  reducers: (create) => ({
    updatePair: create.reducer((state, action: PayloadAction<actionType>) => {
      state.value = action.payload;
      state.status = "active";
    }),
  }),
  selectors: {
    getTokenPair: (tokenPair) => tokenPair.value,
    getStatus: (tokenPair) => tokenPair.status,
  },
});

export const { updatePair } = tokenPairSlice.actions;

export const { getTokenPair, getStatus } = tokenPairSlice.selectors;
