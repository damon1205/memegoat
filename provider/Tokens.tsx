"use client"
import { TokenData, VelarToken } from '@/interface';
import { TokenInfo } from 'alex-sdk';
import { createContext, useContext, useState, useEffect } from 'react';
import { instance } from '@/utils/api';
import { alexSDK } from '@/utils/velar.data';
import { fetchSTXBalance, getUserTokenBalance } from '@/utils/stacks.data';

type TokenContextI = {
  velarTokens: VelarToken[];
  alexTokens: TokenInfo[];
  allTokens: TokenData[];
  getTokenMeta: (token: string) => TokenData | null
  getTokenMetaBySymbol: (symbol: string) => TokenData | null
  getTokenMetaByAddress: (address: string) => TokenData | null
  getTokenBalance: (symbol: TokenData) => Promise<number | null>;
}

const TokensContext = createContext<TokenContextI>({
  velarTokens: [],
  alexTokens: [],
  allTokens: [],
  getTokenMeta: () => null,
  getTokenMetaBySymbol: () => null,
  getTokenMetaByAddress: () => null,
  getTokenBalance: () => Promise.resolve(null),
});

export const useTokensContext = () => useContext(TokensContext);

type Tokens = { [key: string]: number }

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTokens, setAllTokens] = useState<TokenData[]>([]);
  const [velarTokens, setVelarTokens] = useState<VelarToken[]>([]);
  const [alexTokens, setAlexTokens] = useState<TokenInfo[]>([]);
  const [balances, setBalances] = useState<Tokens>({});

  useEffect(() => {
    const fetchData = async () => {
      const alexTokens = await alexSDK.fetchSwappableCurrency();
      const velarTokens = await instance().get('/velarTokens');
      const allTokens = await instance().get('/allTokens')
      setAlexTokens(alexTokens);
      setAllTokens(allTokens.data.data)
      setVelarTokens(velarTokens.data.data)
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

  const getTokenMetaByAddress = (address: string) => {
    const tokenData = allTokens.find(tokenData => tokenData.address.toLowerCase() === address.toLowerCase());
    return tokenData ? tokenData : null
  }

  const getTokenBalance = async (token: TokenData) => {
    if (balances[token.name] >= 0) {
      return balances[token.name]; // Return cached balance
    }
    let balance;
    if (token.name.toLowerCase() === 'stx') {
      balance = await fetchSTXBalance();
    } else {
      const decimals = getTokenMetaByAddress(token.address)
      const finalDecimals = decimals ? decimals.decimals : token.decimals
      balance = await getUserTokenBalance(token.address, finalDecimals);
    }
    setBalances((prevBalances) => ({
      ...prevBalances,
      [token.name]: balance,
    }));
    return balance;
  }

  return (
    <TokensContext.Provider value={{ allTokens, velarTokens, alexTokens, getTokenMeta, getTokenMetaBySymbol, getTokenMetaByAddress, getTokenBalance }}>
      {children}
    </TokensContext.Provider>
  );
}