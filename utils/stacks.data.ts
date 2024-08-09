import { LaunchpadDataI, TxData, TxRequest, TxType } from "@/interface";
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import {
  StacksMainnet,
  StacksMocknet,
  StacksNetwork,
  StacksTestnet,
} from "@stacks/network";
import axios, { AxiosError, AxiosResponse } from "axios";
import { instance } from "./api";
import { cleanIPFS, getTokenURI, splitToken } from "./helpers";
import { ITokenMetadata } from "@/interface";
import { dummyMetadata, emptyMetadata } from "@/data/constants";
import config from "./config";
import { splitColons } from "./format";

export const pointsAPI =
  "https://memegoat-referral-backend.onrender.com/points";
export const referralLink = "https://app.memegoat.io/stake/refer";

export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });
export const appDetails = {
  name: "MEMEGOAT Finance",
  icon: `${config.BASE_URL}/logo.png`,
};

export const ApiURLS = {
  devnet: {
    getBlocks: "http://localhost:3999/extended/v2/blocks?limit=1",
    getTxnInfo: "http://localhost:3999/extended/v1/tx/",
  },
  testnet: {
    getBlocks: "https://api.testnet.hiro.so/extended/v2/blocks?limit=1",
    getTxnInfo: "https://api.testnet.hiro.so/extended/v1/tx/",
  },
  mainnet: {
    getBlocks: "https://api.mainnet.hiro.so/extended/v2/blocks?limit=1",
    getTxnInfo: "https://api.mainnet.hiro.so/extended/v1/tx/",
  },
};

export const getTokenMetadataUrl = (network: string, token: string) => {
  switch (network) {
    case "mainnet":
      return `https://api.hiro.so/metadata/v1/ft/${token}`;
    case "testnet":
      return `https://api.testnet.hiro.so/metadata/v1/ft/${token}`;
    default:
      return `https://api.hiro.so/metadata/v1/ft/${token}`;
  }
};

export const getContractLink = (
  network: string,
  address: string,
  contractName: string
) => {
  switch (network) {
    case "mainnet":
      return `https://api.mainnet.hiro.so/v2/contracts/source/${address}/${contractName}`;
    case "testnet":
      return `https://api.testnet.hiro.so/v2/contracts/source/${address}/${contractName}`;
    case "devnet":
      return `http://localhost:3999/v2/contracts/source/${address}/${contractName}`;
    default:
      return `https://api.mainnet.hiro.so/v2/contracts/source/${address}/${contractName}`;
  }
};

export const getExplorerLink = (network: string, txId: string) => {
  switch (network) {
    case "mainnet":
      return `https://explorer.hiro.so/txid/${txId}`;
    case "testnet":
      return `https://explorer.hiro.so/txid/${txId}?chain=testnet`;
    case "devnet":
      return `https://explorer.hiro.so/txid/${txId}?chain=testnet&api=http://localhost:3999`;
    default:
      return `https://explorer.hiro.so/txid/${txId}`;
  }
};

export const getAddressLink = (network: string, addr: string) => {
  switch (network) {
    case "mainnet":
      return `https://explorer.hiro.so/address/${addr}`;
    case "testnet":
      return `https://explorer.hiro.so/address/${addr}?chain=testnet`;
    case "devnet":
      return `https://explorer.hiro.so/address/${addr}?chain=testnet&api=http://localhost:3999`;
    default:
      return `https://explorer.hiro.so/address/${addr}`;
  }
};

export const getUserAssetsLink = (network: string, principal: string) => {
  switch (network) {
    case "mainnet":
      return `https://api.mainnet.hiro.so/extended/v1/address/${principal}/assets`;
    case "testnet":
      return `https://api.mainnet.hiro.so/extended/v1/address/${principal}/assets`;
    case "devnet":
      return `http://localhost:3999/extended/v1/address/${principal}/assets`;
    default:
      return `https://api.mainnet.hiro.so/extended/v1/address/${principal}/assets`;
  }
};

export const getTokenData = (network: string, symbol: string) => {
  switch (network) {
    case "mainnet":
      return `https://api.hiro.so/metadata/v1/ft?symbol=${symbol}`;
    case "testnet":
      return `https://api.testnet.hiro.so/metadata/v1/ft?symbol=${symbol}`;
    default:
      return `https://api.hiro.so/metadata/v1/ft?symbol=${symbol}`;
  }
};

const getNetwork = (network: string) => {
  switch (network) {
    case "mainnet":
      return new StacksMainnet();
    case "testnet":
      return new StacksTestnet();
    case "devnet":
      return new StacksMocknet();
    default:
      return new StacksMainnet();
  }
};

const address = (network: string) => {
  switch (network) {
    case "mainnet":
      return "SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14";
    case "testnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    case "devnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    default:
      return "SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14";
  }
};

type NetworkType = "mainnet" | "devnet" | "testnet";
export const network: NetworkType = "mainnet";
export const networkInstance = getNetwork(network);
export const contractAddress = address(network);

export const traitAddress = (network: string) => {
  switch (network) {
    case "mainnet":
      return "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE";
    case "testnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    case "devnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    default:
      return "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE";
  }
};

export const getUserPrincipal = (): string => {
  const userPrincipal = userSession.isUserSignedIn()
    ? (network as NetworkType) === "mainnet"
      ? userSession.loadUserData().profile.stxAddress.mainnet
      : userSession.loadUserData().profile.stxAddress.testnet
    : "";
  return userPrincipal;
};

export const fetchUserBalance = async (
  network: StacksNetwork,
  userPrincipal: string
) => {
  const maxRetries = 2;
  let retries = 0;
  while (retries < maxRetries) {
    const balanceURL = network.getAccountExtendedBalancesApiUrl(userPrincipal);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: balanceURL,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "b28d0f9f8fe9fefa3b3c2f952643ecb2",
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      retries++;
      if (axios.isAxiosError(error)) {
        console.log(
          `Timeout error occurred, retrying (${retries}/${maxRetries})...`
        );
        continue;
      } else {
        console.error(error);
      }
    }
  }
};

export const fetchTokenMetadata = async (token: string) => {
  if (!token) return null;
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: getTokenMetadataUrl(network, token),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "10a0b6d06387564651f3c26a75474a82",
      },
    };
    const response = await axios.request(config);
    const metadata: ITokenMetadata = {
      ...response.data,
      address: token,
    };
    return metadata;
  } catch (error) {
    try {
      const response = await instance().get(`/minted-tokens/${token}`);
      const tokenInfo: LaunchpadDataI = response.data.data;
      const metadata: ITokenMetadata = {
        ...emptyMetadata,
        name: tokenInfo.token_name,
        symbol: tokenInfo.token_ticker,
        decimals: 6,
        total_supply: tokenInfo.token_supply,
        description: tokenInfo.token_desc,
        image_uri: tokenInfo.token_image,
        sender_address: tokenInfo.user_addr,
        address: token,
      };
      return metadata;
    } catch (error) {
      const data = await getTokenURI(token, networkInstance);
      const metadata: ITokenMetadata = {
        ...emptyMetadata,
        address: token,
        symbol: splitToken(token)[1],
        name: data.name,
        image_uri: cleanIPFS(data.image),
        description: data.description,
        decimals: 6,
      };
      return metadata;
    }
  }
};

export const fetchCurrNoOfBlocks = async () => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: ApiURLS[network].getBlocks,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    return response.data.results[0].height;
  } catch (error) {
    console.error(error);
  }
};

export const fetchSTXBalance = async () => {
  const network = networkInstance;
  const userPrincipal = getUserPrincipal();
  if (userPrincipal == "") {
    return 0;
  }
  const balanceURL = network.getAccountExtendedBalancesApiUrl(userPrincipal);
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: balanceURL,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "10a0b6d06387564651f3c26a75474a82",
      },
    };
    const response = await axios.request(config);
    const stxBal = response.data.stx;
    return stxBal ? (stxBal.balance as number) / 1e6 : 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getUserTokenBalance = async (
  stake_token: string,
  decimals?: number
) => {
  if (!stake_token) return 0;

  const data = await fetchUserBalance(networkInstance, getUserPrincipal());
  if (stake_token[1].toLowerCase() === "stx") {
    return Number(data.stx.balance) / 1000000;
  }

  for (const key of Object.keys(data.fungible_tokens)) {
    if (key.includes(stake_token)) {
      const divisor = decimals ? 10 ** decimals : 1e6;
      return Number(data.fungible_tokens[key].balance) / divisor;
    }
  }
  return 0;
};

export const getAllUserTokens = async () => {
  if (!userSession.isUserSignedIn()) return [];
  const url =
    networkInstance.getAccountExtendedBalancesApiUrl(getUserPrincipal());
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "bb2d18f57a4486d69bf13e5be6a1239b",
    },
  };
  const response = await axios.request(config);
  const data = response.data.fungible_tokens;
  const tokenList = [];
  for (const ft in data) {
    if (Number(data[ft].balance) == 0) continue;
    const ftSplit = splitColons(ft);
    const token = {
      address: ftSplit[0],
      name: ftSplit[1],
    };
    tokenList.push(token);
  }
  return tokenList;
};

export const onConnectWallet = () => {
  showConnect({
    appDetails,
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
};
