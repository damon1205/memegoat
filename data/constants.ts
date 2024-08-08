import { LaunchpadI } from "@/interface";
import { LaunchpadDataI } from "@/interface";
import { address } from "@stacks/transactions/dist/cl";
import { TokenInfo, Currency } from "alex-sdk";

export const dummyToken: TokenInfo = {
  id: "" as Currency,
  name: "STX",
  icon: "https://images.ctfassets.net/frwmwlognk87/4gSg3vYkO4Vg5XXGJJc70W/9aa79522b1118fa14506375fe9fdcfaf/STX.svg",
  wrapToken: "",
  wrapTokenDecimals: 0,
  underlyingToken: "",
  underlyingTokenDecimals: 0,
  isRebaseToken: false,
};

export const devcoinSTX = {
  step: "2",
  tx_id: "",
  tx_status: "",
  action: "",
  user_addr: "SP17KDQNNB39TNQSZ390J0GKPN2TM6D3K496CYAKT",
  token_image:
    "https://ipfs.io/ipfs/bafybeia3f4udvjesg2zmpx3lgpa7ikm7nv57oqm7yfuk6lviatfdpaaxri/",
  token_name: "DevCoinSTX",
  token_desc: `📢 Welcome to Dev the master unicorn 🦄 | Dev coin is a meme coin created to celebrate all developers on Bitcoin pushing the adoption of bitcoin techno-development.`,
  token_supply: "1000000000",
  token_ticker: "DevCoinSTX",
  token_address: "SP17KDQNNB39TNQSZ390J0GKPN2TM6D3K496CYAKT.devcoin",
  token_website: "https://devunicorns.fun",
  twitter: "https://x.com/DevCoinSTX",
  discord: "https://t.me/DevCoinSTX",
  campaign_allocation: "20000000",
  campaign_description: "",
  campaign_twitter: "https://x.com/DevCoinSTX",
  campaign_hashtags: "",
  listing_allocation: "350000000",
  sale_allocation: "600000000",
  sale_description: `📢 Welcome to Dev the master unicorn 🦄 | Dev coin is a meme coin created to celebrate all developers on Bitcoin pushing the adoption of bitcoin techno-development.`,
  hard_cap: "40000",
  soft_cap: "20000",
  maximum_buy: "250",
  minimum_buy: "20",
  start_date: "June 24, 2024 16:00:00 GMT+0000",
  end_date: "June 27, 2024 16:00:00 GMT+0000",
};

export const MoonMuchBTC = {
  step: "2",
  tx_id: "",
  tx_status: "",
  action: "",
  user_addr: "SP2D8X6NYCZR70BD72R345MBDX3ATBKFMX9X12FQ7",
  token_image: "/moonch.jpeg",
  token_name: "MoonMunchBTC",
  token_desc:
    "$MOONCH to the Moon 🌙 a new, one of a very few  #Bitcoin meme coin",
  token_supply: "1000000000",
  token_ticker: "MOONCH",
  token_address: "SP2D8X6NYCZR70BD72R345MBDX3ATBKFMX9X12FQ7.moonchbtc",
  token_website: "www.moonmunchbtc.com ",
  twitter: "https://x.com/MoonMunchBTC",
  discord: "https://t.me/+_AW57A-AYe1jN2Vh",
  campaign_allocation: "",
  campaign_description:
    "$MOONCH to the Moon 🌙 a new, one of a very few  #Bitcoin meme coin",
  campaign_twitter: "https://x.com/MoonMunchBTC",
  campaign_hashtags: "",
  listing_allocation: "300000000",
  sale_allocation: "450000000",
  sale_description:
    "$MOONCH to the Moon 🌙 a new, one of a very few  #Bitcoin meme coin",
  hard_cap: "50000",
  soft_cap: "10000",
  maximum_buy: "1000",
  minimum_buy: "100",
  start_date: "July 03, 2024 15:00:00 GMT+0000",
  end_date: "July 07, 2024 15:00:00 GMT+0000",
};

export const dummyMetadata = {
  name: "memegoatstx",
  symbol: "GOATSTX",
  decimals: 6,
  total_supply: "5000000000",
  token_uri:
    "ipfs://ipfs/bafybeiha6ubrgfvmbd77j6jbmtkpxqhbosvalam2ud3zgnu4vydfw4d5be",
  description:
    "GOATSTX coin is the utility token of MEMEGOAT FINANCE THE MEME FINANCE LAYER OF BITCOIN",
  image_uri:
    "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14.memegoatstx/1.png",
  image_thumbnail_uri:
    "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14.memegoatstx/1-thumb.png",
  image_canonical_uri:
    "https://ipfs.io/ipfs/bafybeiapie2tfa4sxptjpel277x34l3q3r5zsz7zvfgg6alknj3l2aighq",
  tx_id: "0xcc1f9e6e897bfe9af2fa37ea5e8da16b18e056e8578f6eb130734e3c2d61171f",
  sender_address: "SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14",
  metadata: {
    sip: 16,
    name: "memegoatstx",
    description:
      "GOATSTX coin is the utility token of MEMEGOAT FINANCE THE MEME FINANCE LAYER OF BITCOIN",
    image:
      "https://ipfs.io/ipfs/bafybeiapie2tfa4sxptjpel277x34l3q3r5zsz7zvfgg6alknj3l2aighq",
    cached_image:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14.memegoatstx/1.png",
    cached_thumbnail_image:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2F4QC563WN0A0949WPH5W1YXVC4M1R46QKE0G14.memegoatstx/1-thumb.png",
  },
  address: "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W.testSTX",
};

export const emptyMetadata = {
  name: "",
  symbol: "",
  decimals: 6,
  total_supply: "",
  token_uri: "",
  description: "",
  image_uri: "",
  image_thumbnail_uri: "",
  image_canonical_uri: "",
  tx_id: "",
  sender_address: "",
  metadata: {
    sip: 16,
    name: "",
    description: "",
    image: "",
    cached_image: "",
    cached_thumbnail_image: "",
  },
  address: "",
};

export const initialTokenData = {
  symbol: "",
  address: "",
  name: "",
  icon: "",
  decimals: 0,
};

export const initialData: LaunchpadDataI = {
  step: "",
  tx_id: "",
  tx_status: "",
  action: "",
  user_addr: "",
  token_image: "",
  token_name: "",
  token_desc: "",
  token_supply: "",
  token_ticker: "",
  token_address: "",
  token_website: "",
  twitter: "",
  discord: "",
  campaign_allocation: "",
  campaign_description: "",
  campaign_twitter: "",
  campaign_hashtags: "",
  listing_allocation: "",
  sale_allocation: "",
  sale_description: "",
  hard_cap: "",
  soft_cap: "",
  maximum_buy: "",
  minimum_buy: "",
  is_campaign: false,
  start_date: "",
  end_date: "",
};

export const pendingInitial = {
  tag: "",
  txID: "",
  userAddr: "",
  action: "",
  txStatus: "",
  reward_amount: "",
  stake_token: "",
  reward_token: "",
  start_date: "",
  end_date: "",
  token_image: "",
};

export const txMessage =
  "Your transaction is currently being processed and should be confirmed within 10-20 minutes. You can track its progress in the transaction bar.";

export const txFailMessage =
  "An error occurred while processing your transaction.";
