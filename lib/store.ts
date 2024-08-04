import { combineSlices, configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { tokenPairSlice } from "./features/pairs/pairsSlice";
import { tokenMetadataSlice } from "./features/pairs/tokenSlice";

const rootReducer = combineSlices(tokenPairSlice, tokenMetadataSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;