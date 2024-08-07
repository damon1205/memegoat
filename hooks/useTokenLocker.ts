"use client";
import { emptyMetadata } from "@/data/constants";
import { ITokenMetadata } from "@/interface";
import { useLocalStorage } from "usehooks-ts";

const useTokenLocker = () => {
  const [tokenLockerDetails, setTokenLockerDetails] =
    useLocalStorage<ITokenMetadata>("token-locker-details", emptyMetadata, {
      initializeWithValue: false,
    });
  return { tokenLockerDetails, setTokenLockerDetails };
};

export { useTokenLocker };
