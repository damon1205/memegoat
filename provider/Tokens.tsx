"use client"
import { TokenData, TokenDataMeta } from '@/interface';
import { splitNGetCA } from '@/utils/swap';
import { alexSDK, getTokenInfo } from '@/utils/velar.data';
import { getTokens } from '@velarprotocol/velar-sdk';
import { TokenInfo } from 'alex-sdk';
import { createContext, useContext, useState, useEffect } from 'react';
import { parseCookies, setCookie } from 'nookies';

type Tokens = { [key: string]: string }

type TokenContextI = {
  velarTokens: Tokens | null;
  alexTokens: TokenInfo[];
  allTokens: TokenData[];
  getTokenMeta: (token: string) => TokenData | null
  getTokenMetaBySymbol: (symbol: string) => TokenData | null
}

const TokensContext = createContext<TokenContextI>({
  velarTokens: null,
  alexTokens: [],
  allTokens: [],
  getTokenMeta: () => null,
  getTokenMetaBySymbol: () => null
});

export const useTokensContext = () => useContext(TokensContext);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [velarTokens, setVelarTokens] = useState<Tokens | null>(null);
  const [alexTokens, setAlexTokens] = useState<TokenInfo[]>([]);

  function setArrayCookie(name: string, value: string) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    setCookie(null, name, value, {
      path: '/',
      expires,
    });
  }

  function getArrayCookie(name: string) {
    const cookies = parseCookies();
    const cookieValue = cookies[name];

    return cookieValue ? JSON.parse(cookieValue) : null;
  }

  useEffect(() => {
    const fetchData = async () => {
      const allTokens = getArrayCookie("alltokens");
      const alexTokens = getArrayCookie('alexTokens');
      const velarTokens = getArrayCookie('velarTokens');

      if ((allTokens && alexTokens && velarTokens)) {
        setAlexTokens(alexTokens);
        setVelarTokens(velarTokens);
        setAllTokens(allTokens)
      } else {
        const [alexTokens, velarTokens] = await Promise.all([
          alexSDK.fetchSwappableCurrency(),
          getTokens(),
        ]);
        setAlexTokens(alexTokens);
        setVelarTokens(velarTokens);
        const vTokens = velarTokens || {};
        const alexTokenMap = new Map(alexTokens.map(token => [token.name, token]));
        const tokensData: TokenData[] = alexTokens.map(token => ({
          symbol: token.id,
          name: token.name,
          address: splitNGetCA(token.underlyingToken),
          icon: token.icon,
          decimals: token.wrapTokenDecimals
        }));
        const missingTokens = Object.keys(vTokens).filter(token => !alexTokenMap.has(token));
        const missingTokenData: TokenDataMeta[] = await Promise.all(missingTokens.map(getTokenInfo));
        missingTokenData.forEach(tokenData => {
          if (tokenData) {
            tokensData.push({
              symbol: tokenData.symbol,
              name: tokenData.name,
              address: tokenData.contract_principal,
              icon: tokenData.image_uri,
              decimals: tokenData.decimals
            });
          }
        });
        setAllTokens(tokensData);
        setArrayCookie('allTokens', JSON.stringify(tokensData));
        setArrayCookie('velarTokens', JSON.stringify(velarTokens));
        setArrayCookie('alexTokens', JSON.stringify(alexTokens));
      }
    };
    fetchData();
  }, []);


  const getTokenMeta = (token: string) => {
    const tokenData = allTokens.find(tokenData => tokenData.name.toLowerCase() === token.toLowerCase());
    return tokenData ? tokenData : null
  }

  const getTokenMetaBySymbol = (symbol: string) => {
    const tokenData = allTokens.find(tokenData => tokenData.symbol?.toLowerCase() === symbol.toLowerCase());
    return tokenData ? tokenData : null
  }

  return (
    <TokensContext.Provider value={{ allTokens, velarTokens, alexTokens, getTokenMeta, getTokenMetaBySymbol }}>
      {children}
    </TokensContext.Provider>
  );
}