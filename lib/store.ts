import { combineSlices, configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { tokenPairSlice } from "./features/pairs/pairsSlice";
import { tokenMetadataSlice } from "./features/pairs/tokenSlice";
import storage from "./noOpStore";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineSlices(tokenPairSlice, tokenMetadataSlice);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      });
    },
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
