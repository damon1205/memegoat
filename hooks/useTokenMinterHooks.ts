"use client";
import { initialData, pendingInitial } from "@/data/constants";
import { PendingTxnsI, LaunchpadDataI } from "@/interface";
import { useLocalStorage } from "usehooks-ts";

const useTokenMinterFields = () => {
  const [tokenMintProgress, setTokenMintProgress] =
    useLocalStorage<LaunchpadDataI>("token-minter-fields", initialData, {
      initializeWithValue: false,
    });
  return { tokenMintProgress, setTokenMintProgress };
};

const usePendingTxnFields = () => {
  const [pendingTxnProgress, setPendingTxnProgress] =
    useLocalStorage<PendingTxnsI>("pending-txn-fields", pendingInitial, {
      initializeWithValue: false,
    });
  return { pendingTxnProgress, setPendingTxnProgress };
};

export { useTokenMinterFields, usePendingTxnFields };
