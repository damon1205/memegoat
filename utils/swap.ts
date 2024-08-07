import { TokenInfo } from "alex-sdk";
import {
  getTokenInfo,
  TokenData,
  velarSDK,
  VelarTokenLists,
} from "./velar.data";
import { VelarToken } from "@/interface";

const HOPS = ["SBTC", "AEUSDC", "VELAR", "STX"];

export const calculateSwapVelar = async (tokenA: string, tokenB: string) => {
  const routes = await velarSDK.getPairs(tokenA);
  const route = [tokenA];

  if (routes.includes(tokenB)) {
    route.push(tokenB);
    return route;
  }

  const visited = new Set([tokenA]);
  const queue = [[tokenA]];

  while (queue.length > 0) {
    const currentRoute = queue.shift();
    if (!currentRoute) continue;
    const lastToken = currentRoute[currentRoute.length - 1];
    const nextRoutes = await velarSDK.getPairs(lastToken);

    for (const nextToken of nextRoutes) {
      if (visited.has(nextToken)) {
        continue;
      }
      visited.add(nextToken);
      const newRoute = [...currentRoute, nextToken];
      if (nextToken === tokenB) {
        return newRoute;
      }
      queue.push(newRoute);
      // Check HOPS only if the nextToken is not the target
      if (HOPS.includes(nextToken)) {
        const hopRoutes = await velarSDK.getPairs(nextToken);
        if (hopRoutes.includes(tokenB)) {
          return [...newRoute, tokenB];
        }
      }
    }
  }

  return route;
};

export const calculateSwapAlex = () => {};

export const calculateSwapVelarMulti = async (
  tokenA: string,
  tokenB: string
) => {
  const routes = await velarSDK.getPairs("GME");
  const route = [tokenA];
  const allRoutes: string[][] = [];
  const visited = new Set([tokenA]);
  const queue: string[][] = [[tokenA]];

  if (routes.includes(tokenB)) {
    allRoutes.push([...route, tokenB]);
  }

  while (queue.length > 0) {
    const currentRoute = queue.shift();
    if (!currentRoute) continue;

    const lastToken = currentRoute[currentRoute.length - 1];
    const nextRoutes = await velarSDK.getPairs(lastToken);

    for (const nextToken of nextRoutes) {
      if (visited.has(nextToken)) continue;

      const newRoute = [...currentRoute, nextToken];
      visited.add(nextToken);

      if (nextToken === tokenB) {
        if (
          !allRoutes.some((r) => JSON.stringify(r) === JSON.stringify(newRoute))
        ) {
          allRoutes.push(newRoute);
        }
      } else {
        queue.push(newRoute);
      }

      // Check HOPS only if the nextToken is not the target
      if (HOPS.includes(nextToken)) {
        const hopRoutes = await velarSDK.getPairs(nextToken);
        if (hopRoutes.includes(tokenB)) {
          const finalRoute = [...newRoute, tokenB];
          if (
            !allRoutes.some(
              (r) => JSON.stringify(r) === JSON.stringify(finalRoute)
            )
          ) {
            allRoutes.push(finalRoute);
          }
        } else {
          for (const hopToken of hopRoutes) {
            if (!visited.has(hopToken)) {
              const hopRoute = [...newRoute, hopToken];
              queue.push(hopRoute);
            }
          }
        }
      }
    }
  }

  return allRoutes;
};

export const checkInAlex = (symbol: string, alexTokens: TokenInfo[] | null) => {
  if (!alexTokens) return false;
  const token = alexTokens.find((token) => token.id === symbol);
  return token ? true : false;
};

export const checkInAlexName = (
  symbol: string,
  alexTokens: TokenInfo[] | null
) => {
  if (!alexTokens) return false;
  const token = alexTokens.find((token) => token.name === symbol);
  return token ? true : false;
};

export const checkInVelar = (
  symbol: string,
  velarTokens: VelarToken[] | null
) => {
  if (!velarTokens) return false;
  // return (
  //   Object.keys(velarTokens).includes(symbol) &&
  //   !EXCLUDED_TOKENS.includes(symbol)
  // );
  const token = velarTokens.find((token) => token.symbol === symbol);
  return token && !EXCLUDED_TOKENS.includes(symbol) ? true : false;
};

export const getAlexRouteId = (
  symbol: string,
  alexTokens: TokenInfo[] | null
) => {
  if (!alexTokens) return "";
  const token = alexTokens.find((token) => token.name === symbol);
  return token ? token.id : "";
};

export const getAlexName = (id: string, alexTokens: TokenInfo[] | null) => {
  if (!alexTokens) return "";
  const token = alexTokens.find((token) => token.id === id);
  return token ? token.name : "";
};

export const EXCLUDED_TOKENS = [
  "ALEX",
  "$B20",
  "ALL",
  "BANANA",
  "CHAX",
  "DIKO",
  "GUS",
  "HASHIKO",
  "LiALEX",
  "LiSTX",
  "MAX",
  "MEGA",
  "MIA",
  "MICK",
  "NYC",
  "ORDG",
  "ORMM",
  "ORNJ",
  "PLAY",
  "SKO",
  "SLIME",
  "STXOSHI",
  "TRIO",
  "TX20",
  "USDA",
  "VIBES",
  "WIF",
  "aeWBTC",
  "atALEXv2",
  "iQC",
  "nakamoto",
  "sUSDT",
  "Wsbtc",
  "xBTC",
  "xUSD",
  "Mooneeb",
  "NIUB",
  "KIKI",
  "WEN",
];

export const getVelarTokenAddress = (symbol: string) => {
  const token = VelarTokenLists.find((token) => token.symbol === symbol);
  token ? token.contract_principal : "";
};

export const split = (token: string) => {
  const result = token.split("::");
  return result[0];
};

export const getTokenAddressHiro = async (symbol: string) => {
  if (symbol === "STX") return "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.wstx";
  const token: TokenData = await getTokenInfo(symbol);
  return token ? token.contract_principal : "";
};

export const getAlexTokenAddress = (
  symbol: string,
  alexTokens: TokenInfo[] | null
) => {
  if (!alexTokens) return "";
  const token = alexTokens.find((token) => token.id === symbol);
  return token ? split(token.wrapToken) : "";
};

export const splitNGetCA = (token: string) => {
  const result = token.split("::");
  return result[0];
};
