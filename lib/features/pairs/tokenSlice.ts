import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../store";
import { ITokenMetadata } from "@/interface";

type actionType = ITokenMetadata;

export interface TokenSliceState {
  value: ITokenMetadata | null;
}

const initialState: TokenSliceState = {
  value: null,
};

export const tokenMetadataSlice = createAppSlice({
  name: "tokenMetadata",
  initialState,
  reducers: (create) => ({
    setTokenMetadata: create.reducer(
      (state, action: PayloadAction<actionType>) => {
        state.value = action.payload;
      }
    ),
  }),
  selectors: {
    getTokenMetadata: (tokenMetadata) => tokenMetadata.value,
  },
});

export const { setTokenMetadata } = tokenMetadataSlice.actions;

export const { getTokenMetadata } = tokenMetadataSlice.selectors;
