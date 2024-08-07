import { TokenData, TokenDataMeta } from "@/interface";
import { getTokens } from "@velarprotocol/velar-sdk";
import { splitNGetCA } from "./swap";
import { alexSDK, getTokenInfo } from "./velar.data";

export const fetchTokens = async () => {
  const [alexTokens, velarTokens] = await Promise.all([
    alexSDK.fetchSwappableCurrency(),
    getTokens(),
  ]);
  // setAlexTokens(alexTokens);
  // setVelarTokens(velarTokens);
  const vTokens = velarTokens || {};
  const alexTokenMap = new Map(alexTokens.map((token) => [token.name, token]));
  const tokensData: TokenData[] = alexTokens.map((token) => ({
    symbol: token.id,
    name: token.name,
    address: splitNGetCA(token.underlyingToken),
    icon: token.icon,
    decimals: token.name === "ALEX" || "LiALEX" ? token.wrapTokenDecimals : 6,
  }));
  const missingTokens = Object.keys(vTokens).filter(
    (token) => !alexTokenMap.has(token)
  );
  const missingTokenData: TokenDataMeta[] = await Promise.all(
    missingTokens.map(getTokenInfo)
  );
  missingTokenData.forEach((tokenData) => {
    if (tokenData) {
      tokensData.push({
        symbol: tokenData.symbol,
        name: tokenData.name,
        address: tokenData.contract_principal,
        icon: tokenData.image_uri,
        decimals: tokenData.decimals,
      });
    }
  });
  // setAllTokens(tokensData);
  return { alexTokens, velarTokens, tokensData };
};
