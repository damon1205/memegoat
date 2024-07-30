import { TokenMinterProgressI } from "@/interface";
import { AppConfig, UserSession } from "@stacks/connect";
import {
  StacksMainnet,
  StacksMocknet,
  StacksNetwork,
  StacksTestnet,
} from "@stacks/network";
import axios from "axios";
import { instance } from "./api";
import { cleanIPFS, getTokenURI, splitToken } from "./helpers";
import { ITokenMetadata } from "@/interface";
import { dummyMetadata, emptyMetadata } from "@/data/constants";
import config from "./config";

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
export const network: NetworkType = "testnet";
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
  if (!token) return;
  try {
    if ((network as NetworkType) === "devnet") {
      return dummyMetadata;
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: getTokenMetadataUrl(network, token),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    const metadata: ITokenMetadata = {
      ...response.data,
      tokenAddress: token,
    };
    return metadata;
  } catch (error) {
    try {
      const response = await instance().get(`/campaign-requests/${token}`);
      const tokenInfo: TokenMinterProgressI = response.data.data;
      const metadata: ITokenMetadata = {
        ...emptyMetadata,
        name: tokenInfo.token_name,
        symbol: tokenInfo.token_ticker,
        decimals: 6,
        total_supply: tokenInfo.token_supply,
        description: tokenInfo.token_desc,
        image_uri: tokenInfo.token_image,
        sender_address: tokenInfo.user_addr,
        tokenAddress: token,
      };
      return metadata;
    } catch (error) {
      const data = await getTokenURI(token, networkInstance);
      const metadata: ITokenMetadata = {
        ...emptyMetadata,
        tokenAddress: token,
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