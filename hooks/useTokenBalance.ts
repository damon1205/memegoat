import { TokenData } from "@/interface";
import { fetchSTXBalance, getUserTokenBalance } from "@/utils/stacks.data";
import { useQuery } from "react-query";

export const useTokenBalance = (token: TokenData) => {
  return useQuery(
    ["tokenBalance", token.name],
    async () => {
      if (token.name.toLowerCase() === "stx") {
        return fetchSTXBalance();
      } else {
        return getUserTokenBalance(token.address, token.decimals);
      }
    },
    {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
  );
};
