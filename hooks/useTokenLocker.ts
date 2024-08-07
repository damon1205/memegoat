"use client";
import { initialTokenData } from "@/data/constants";
import { TokenData } from "@/interface";
import { useLocalStorage } from "usehooks-ts";

const useTokenLocker = () => {
  const [tokenLockerDetails, setTokenLockerDetails] =
    useLocalStorage<TokenData>("token-locker-details", initialTokenData, {
      initializeWithValue: false,
    });
  return { tokenLockerDetails, setTokenLockerDetails };
};

export { useTokenLocker };
