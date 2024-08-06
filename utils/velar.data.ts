import { VelarSDK } from "@velarprotocol/velar-sdk";
import { getTokenData } from "./stacks.data";
import axios from "axios";
import { AlexSDK } from "alex-sdk";
import { ITokenMetadata } from "@/interface";

export const velarSDK = new VelarSDK();

export const alexSDK = new AlexSDK();

export const getPrice = async (symbol: string) => {
  if (!symbol) return;
  const maxRetries = 2;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "https://api.velar.co/tickers",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(config);
      console.log(response.data);
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

export const velarCA = (network: string) => {
  switch (network) {
    case "mainnet":
      return "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1";
    case "testnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    case "devnet":
      return "STHSSNNW4X73WMDB5XZV387WME91DQCNZMEK833W";
    default:
      return "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1";
  }
};

export const getTokenInfo = async (symbol: string) => {
  const maxRetries = 2;
  const retries = 0;

  try {
    if (symbol[0] === "$") {
      symbol = symbol.slice(1, symbol.length - 1);
    }
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: getTokenData("mainnet", symbol),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "bb2d18f57a4486d69bf13e5be6a1239b",
      },
    };
    const response = await axios.request(config);
    return response.data.results[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        `Timeout error occurred, retrying (${retries}/${maxRetries})...`
      );
    } else {
      console.error(error);
    }
  }
};

export interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  token_uri: string;
  description: string;
  image_uri: string;
  image_canonical_uri: string;
  tx_id: string;
  sender_address: string;
  contract_principal: string;
}

export const VelarTokenLists: TokenData[] = [
  {
    name: "New Hashiko",
    symbol: "HSHKO",
    decimals: 6,
    total_supply: "44000000000000000",
    token_uri:
      "https://gaia.hiro.so/hub/1NjjWAuUCVjQG9z9dSKNPtkpmkHCMbwrGT/new-hashiko-6-decimals.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP28NB976TJHHGF4218KT194NPWP9N1X3WY516Z1P.new-hashiko/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1NjjWAuUCVjQG9z9dSKNPtkpmkHCMbwrGT/newhashiko.png",
    tx_id: "0x49c70cc731fafda7b0d40abc0e992eadda5b44cc749711e0b1f515d8a1d87749",
    sender_address: "SP28NB976TJHHGF4218KT194NPWP9N1X3WY516Z1P",
    contract_principal: "SP28NB976TJHHGF4218KT194NPWP9N1X3WY516Z1P.new-hashiko",
  },
  {
    name: "Liquid Staked Charisma",
    symbol: "sCHA",
    decimals: 6,
    total_supply: "1",
    token_uri: "https://charisma.rocks/liquid-staked-charisma.json",
    description:
      "Liquid Staked Charisma represents a staked version of Charisma that allows holders to earn staking rewards while retaining liquidity.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-charisma/1.png",
    image_canonical_uri: "https://charisma.rocks/liquid-staked-charisma.png",
    tx_id: "0x968306215a046336d5bbf625707225e098b14800d7a1ba421fd844c1ef021551",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-charisma",
  },
  {
    name: "Viking",
    symbol: "VIKI",
    decimals: 6,
    total_supply: "1000000000000000",
    token_uri:
      "https://raw.githubusercontent.com/VIKITOKEN/Vkg/main/viking.json",
    description:
      "Viking is created by ODIN and ODIN is the world's first and only GOD memecoin. It is built on Bitcoin. With this feature, it has opened a new category in the crypto ecosystem and has taken its place in the leading position.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.viking/1.png",
    image_canonical_uri:
      "https://raw.githubusercontent.com/VIKITOKEN/Vkg/main/viking.png",
    tx_id: "0x0ed710bdea13c3e9c5248d3c79f853e6d2371dfb0bccf2a838a42b18b33861e5",
    sender_address: "SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY",
    contract_principal: "SP31BV8VGBSGAR453P6PEQ9SB3AMYMZ1ATBPWDGKY.viking",
  },
  {
    name: "HAWK THUA",
    symbol: "SPIT",
    decimals: 0,
    total_supply: "69000000",
    token_uri:
      "https://gaia.hiro.so/hub/1KGbedma7jYAENbnhoL3i9WiYqhnFvkbXc/hawk-thua-0-decimals.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP1NSCD02EE377W77JA5RHXF9S6RT6A6CA7K039DH.hawk-thua/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1KGbedma7jYAENbnhoL3i9WiYqhnFvkbXc/Screenshot-2024-06-23-2-56-02-PM.png",
    tx_id: "0xeaca4daec13a15b030e39223999c4155a2d8ed0bc6ef9f173161e2e9bc5e5ba8",
    sender_address: "SP1NSCD02EE377W77JA5RHXF9S6RT6A6CA7K039DH",
    contract_principal: "SP1NSCD02EE377W77JA5RHXF9S6RT6A6CA7K039DH.hawk-thua",
  },
  {
    name: "Charismatic Corgi",
    symbol: "iCC",
    decimals: 6,
    total_supply: "10000",
    token_uri: "https://charisma.rocks/indexes/charismatic-corgi.json",
    description:
      "An index fund composed of sWELSH and sCHA at a fixed 100:1 ratio.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charismatic-corgi/1.png",
    image_canonical_uri:
      "https://charisma.rocks/indexes/charismatic-corgi-logo.png",
    tx_id: "0xaf52453043f4c8b769cd2b2a8d4187ddeac88888186bad4f00c35af5fb291a63",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.charismatic-corgi",
  },
  {
    name: "Quiet Confidence",
    symbol: "iQC",
    decimals: 6,
    total_supply: "10000",
    token_uri:
      "https://charisma.rocks/api/metadata/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.quiet-confidence.json",
    description:
      "Time-locked sCHA tokens with vesting, allowing for liquidity removal once every 10 blocks.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.quiet-confidence/1.png",
    image_canonical_uri:
      "https://www.charisma.rocks/indexes/quiet-confidence-logo.png",
    tx_id: "0xfb62a70986d09d9b032d554dd5e79cc96dce61b11f254912b626582b51e3ce7b",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.quiet-confidence",
  },
  {
    name: "Magic Mojo",
    symbol: "iMM",
    decimals: 6,
    total_supply: "10000",
    token_uri:
      "https://charisma.rocks/api/metadata/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.magic-mojo.json",
    description:
      "An index token composed of MOJO and sCHA at a fixed 4:1 ratio.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.magic-mojo/1.png",
    image_canonical_uri:
      "https://www.charisma.rocks/indexes/magic-mojo-logo.png",
    tx_id: "0xe3929f6a5378068f238565fe3e461317c0b295553187b0950d49068b6a292120",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.magic-mojo",
  },
  {
    name: "EdmundFitzgeraldCoin",
    symbol: "EDMUND",
    decimals: 4,
    total_supply: "11101975290000",
    token_uri:
      "https://gaia.hiro.so/hub/1NFtGv6a2WSd6YKLhP2KNnJnPQZxMRDMJX/edmundfitzgeraldcoin.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP1MJPVQ6ZE408ZW4JM6HET50S8GYTYRZ7PC6RKH7.edmundfitzgeraldcoin/1.png",
    image_canonical_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP1MJPVQ6ZE408ZW4JM6HET50S8GYTYRZ7PC6RKH7.edmundfitzgeraldcoin/1.png",
    tx_id: "0x12e60f730aae07df810505e5c97a783f5f6c513f15890038c7f941a403c0fb6c",
    sender_address: "SP1MJPVQ6ZE408ZW4JM6HET50S8GYTYRZ7PC6RKH7",
    contract_principal:
      "SP1MJPVQ6ZE408ZW4JM6HET50S8GYTYRZ7PC6RKH7.edmundfitzgeraldcoin",
  },
  {
    name: "sbtc",
    symbol: "sbtc",
    decimals: 6,
    total_supply: "10000",
    token_uri:
      "https://ipfs.io/ipfs/QmaT2x7Qvov7vLHgGkquHdL6qYKNc2Q1pne4kHyXK38cNh",
    description: "https://stacksinscription.com/#/stx10",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP3R4MHK99JAAM0N3T0CBZRZVSVQFG1N75DQ08JSD.sbtc/1.png",
    image_canonical_uri:
      "https://ipfs.io/ipfs/Qmc67nU3ANzq1bGLssAEGSoy51Kx6VCoyRR1jyUT72E5jg",
    tx_id: "0x5ca09af809a2c82bdb720bf84974595d9f55d01468a82e749680d236e65737be",
    sender_address: "SP3R4MHK99JAAM0N3T0CBZRZVSVQFG1N75DQ08JSD",
    contract_principal: "SP3R4MHK99JAAM0N3T0CBZRZVSVQFG1N75DQ08JSD.sbtc",
  },

  {
    name: "Blitz",
    symbol: "Blitz",
    decimals: 8,
    total_supply: "8000000000000000000",
    token_uri:
      "https://gaia.hiro.so/hub/1NpgSJFwmmgQzr9YeFkWmVVPxyxsy2Wwy6/blitz-8-decimals.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP3PGDSH8P2VJA5RX4BY0GBP867Y4C9955KX97A4V.blitz/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1NpgSJFwmmgQzr9YeFkWmVVPxyxsy2Wwy6/Blitz-logo.jpg",
    tx_id: "0x14dfb6ac997135b45b86c5e2e1069b524cb73ee203975d5ecec11491c0063c8a",
    sender_address: "SP3PGDSH8P2VJA5RX4BY0GBP867Y4C9955KX97A4V",
    contract_principal: "SP3PGDSH8P2VJA5RX4BY0GBP867Y4C9955KX97A4V.blitz",
  },
  {
    name: "Golf is Boring",
    symbol: "GOLF",
    decimals: 4,
    total_supply: "1000000000000",
    token_uri:
      "https://gaia.hiro.so/hub/1C7c3Rj4LRXhFq3CJW7uR3QqanHvhXoTvz/hj.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP1CYY7BKYD60R08K734K9SC6GRZD4ZSN4WCDE5BD.golf-is-boring/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1C7c3Rj4LRXhFq3CJW7uR3QqanHvhXoTvz/hj.jpg",
    tx_id: "0xbef71ee628b6642e489bffbc97f991d1978a4394a041ca1bbb9462d97e7a273b",
    sender_address: "SP1CYY7BKYD60R08K734K9SC6GRZD4ZSN4WCDE5BD",
    contract_principal:
      "SP1CYY7BKYD60R08K734K9SC6GRZD4ZSN4WCDE5BD.golf-is-boring",
  },
  {
    name: "NoCodeClarity-Token",
    symbol: "NOCC",
    decimals: 3,
    total_supply: "10",
    token_uri:
      "https://ipfs.io/ipfs/QmREqqK1eJ8QJg3ciVKqSZqNQpLiWto7A3DHhMgkNTdUgb",
    description: "Democratize Development!",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP12JCJYJJ31C59MV94SNFFM4687H9A04Q3BHTAJM.NoCodeClarity-Token/1.png",
    image_canonical_uri:
      "ipfs://QmRrx5WSMsqfcoDuAzKgjj1d84s6Ttb6aVifsEfzwDqaBA",
    tx_id: "0x6dc833ec1717f9b2d4b33bd34282196d4aa1d2c35d5e5c8385b64fa61830750c",
    sender_address: "SP12JCJYJJ31C59MV94SNFFM4687H9A04Q3BHTAJM",
    contract_principal:
      "SP12JCJYJJ31C59MV94SNFFM4687H9A04Q3BHTAJM.NoCodeClarity-Token",
  },
  {
    name: "Dog Wif Knife",
    symbol: "KNFE",
    decimals: 6,
    total_supply: "1000000000000000",
    token_uri:
      "https://gaia.hiro.so/hub/1PT3koMxBshJ1WKSyCHnixx8hnfNZnSHmQ/screenshot-2024-05-27-at-7-36-39-pm.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV.dog-wif-knife/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1PT3koMxBshJ1WKSyCHnixx8hnfNZnSHmQ/Screenshot-2024-05-27-at-7-36-39-PM.png",
    tx_id: "0xb2b780f5ed0e12aa5244da21949d5dea844e7bc28a69dc05974d6dbddb60cf0d",
    sender_address: "SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV",
    contract_principal:
      "SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV.dog-wif-knife",
  },
  {
    name: "Dog Wif Knife",
    symbol: "KNFE",
    decimals: 6,
    total_supply: "1000000000000000",
    token_uri:
      "https://gaia.hiro.so/hub/1PT3koMxBshJ1WKSyCHnixx8hnfNZnSHmQ/screenshot-2024-05-27-at-7-36-39-pm.json",
    description: "",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV.dog-wif-knife/1.png",
    image_canonical_uri:
      "https://gaia.hiro.so/hub/1PT3koMxBshJ1WKSyCHnixx8hnfNZnSHmQ/Screenshot-2024-05-27-at-7-36-39-PM.png",
    tx_id: "0xb2b780f5ed0e12aa5244da21949d5dea844e7bc28a69dc05974d6dbddb60cf0d",
    sender_address: "SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV",
    contract_principal:
      "SP3CE7FKKBEWX36RHDMNE8WV5807GQA5SQBT8YXFV.dog-wif-knife",
  },
  {
    name: "Hat",
    symbol: "Hat",
    decimals: 6,
    total_supply: "1000",
    token_uri: "https://www.hatonstacks.com/hat.json",
    description: "Hat on Stacks",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP8FRWVKE42DY9XW26SGJ7XPWGVYX9M3FG7KTZNX.Hat/1.png",
    image_canonical_uri: "https://www.hatonstacks.com/icon.jpg",
    tx_id: "0x0f2e17403d3baeae66fcf4a901301898af0b0553390518cca27a1f92a00ddb70",
    sender_address: "SP8FRWVKE42DY9XW26SGJ7XPWGVYX9M3FG7KTZNX",
    contract_principal: "SP8FRWVKE42DY9XW26SGJ7XPWGVYX9M3FG7KTZNX.Hat",
  },
  {
    name: "PomeranianBoo",
    symbol: "POMBOO",
    decimals: 6,
    total_supply: "2000000000000000",
    token_uri: "https://jsonkeeper.com/b/6OPD",
    description: "Pomboo is awesome!",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP17Q8MKYSW1XKWBFVYVMHKG2JZRX7DMJZQCS8YR9.Pomboo-Stacks/1.png",
    image_canonical_uri:
      "https://bafkreicvz5fwc3if522hp2s2rkgisxfdwvazxwyrjponnr6747wd5g5pvy.ipfs.nftstorage.link/",
    tx_id: "0x386ac7e56e5c79c1da186038c260f0105c51fe2b0c14f3620daef7816b98f702",
    sender_address: "SP17Q8MKYSW1XKWBFVYVMHKG2JZRX7DMJZQCS8YR9",
    contract_principal:
      "SP17Q8MKYSW1XKWBFVYVMHKG2JZRX7DMJZQCS8YR9.Pomboo-Stacks",
  },
  {
    name: "Liquid Staked Odin",
    symbol: "sODIN",
    decimals: 6,
    total_supply: "1",
    token_uri: "https://charisma.rocks/liquid-staked-odin.json",
    description:
      "Liquid Staked Odin represents a staked version of Odin that allows holders to earn staking rewards while retaining liquidity.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin/1.png",
    image_canonical_uri: "https://charisma.rocks/liquid-staked-odin.png",
    tx_id: "0xa280b47afeb56bc7ee1ad5f07910d6f9164a8867f5e4121901ab2b4c715288d0",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-odin",
  },
  {
    name: "Liquid Staked Roo v2",
    symbol: "sROO",
    decimals: 6,
    total_supply: "1",
    token_uri: "https://charisma.rocks/liquid-staked-roo.json",
    description:
      "Liquid Staked Roo represents a staked version of Roo that allows holders to earn staking rewards while retaining liquidity.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-roo-v2/1.png",
    image_canonical_uri: "https://charisma.rocks/liquid-staked-roo.png",
    tx_id: "0x6bc6a436901a4c6f7d2cb05d5372311a4dc2c7606244be450767c4756c3bb693",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-roo-v2",
  },
  {
    name: "Liquid Staked Welsh",
    symbol: "sWELSH",
    decimals: 6,
    total_supply: "1",
    token_uri: "https://charisma.rocks/liquid-staked-welshcorgicoin.json",
    description:
      "Liquid Staked Welshcorgicoin represents a staked version of Welshcorgicoin that allows holders to earn staking rewards while retaining liquidity.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh/1.png",
    image_canonical_uri:
      "https://charisma.rocks/liquid-staked-welshcorgicoin.png",
    tx_id: "0xb3cc4738eac47c5e74fba8eaf208edf3850aebaa8d1984cb44be1e7f638dbc6d",
    sender_address: "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS",
    contract_principal:
      "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.liquid-staked-welsh",
  },
  {
    name: "Odin",
    symbol: "ODIN",
    decimals: 6,
    total_supply: "21000000000000000",
    token_uri: "https://token-metadat.s3.eu-central-1.amazonaws.com/asset.json",
    description:
      "ODIN is the world's first and only GOD memecoin. It is built on Bitcoin. With this feature, it has opened a new category in the crypto ecosystem and has taken its place in the leading position.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn/1.png",
    image_canonical_uri:
      "https://token-metadat.s3.eu-central-1.amazonaws.com/logo.png",
    tx_id: "0x9c94af247bb9f433011bf2ef94ac62db85078e39dde77294365016220a630b18",
    sender_address: "SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C",
    contract_principal: "SP2X2Z28NXZVJFCJPBR9Q3NBVYBK3GPX8PXA3R83C.odin-tkn",
  },
  {
    name: "Something",
    symbol: "SOME",
    decimals: 6,
    total_supply: "88975877083900",
    token_uri:
      "https://raw.githubusercontent.com/mafakajan/something/main/something.json",
    description: "Some token",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP3MRT36YWK7R0SKFCQ1TDJB3Y3XBAVRFXPYBQ33E.Something-v420/1.png",
    image_canonical_uri:
      "https://github.com/mafakajan/something/blob/main/Stacks_Logo_png(1).png?raw=true",
    tx_id: "0x31a230cb18204bcb2275ccfe7f9260f0dc7734b14aeb495155c6d37738ea7de9",
    sender_address: "SP3MRT36YWK7R0SKFCQ1TDJB3Y3XBAVRFXPYBQ33E",
    contract_principal:
      "SP3MRT36YWK7R0SKFCQ1TDJB3Y3XBAVRFXPYBQ33E.Something-v420",
  },
  {
    name: "Rock",
    symbol: "ROCK",
    decimals: 6,
    total_supply: "69690000000000000",
    token_uri:
      "https://bafybeifbhkhyv3vi7w5ni5sibat7gzgfq33axuyfdgwc2l67uzizcdxznu.ipfs.dweb.link/QmQZxe2uoGJyvQfbwq9xSGcKrjmzS7LHdZsGbbnTSmcPcx",
    description: "Stacks pet rock.",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP4M2C88EE8RQZPYTC4PZ88CE16YGP825EYF6KBQ.stacks-rock/1.png",
    image_canonical_uri:
      "https://bafybeifpgpxwrtgumuy7d7qlhxynvoixpva4m2toxkcr2jssix5gwqc4rq.ipfs.dweb.link/QmWFjBD56Xp9btmi6K8xNB6Sc5VQ9LRB1xfxfKa44pNvJW",
    tx_id: "0x32a171833cf9a3b19c6b2ed6036d6104e3e16fa07cd8f48ade1ba4631f3aea8b",
    sender_address: "SP4M2C88EE8RQZPYTC4PZ88CE16YGP825EYF6KBQ",
    contract_principal: "SP4M2C88EE8RQZPYTC4PZ88CE16YGP825EYF6KBQ.stacks-rock",
  },

  {
    name: "Velar",
    symbol: "VELAR",
    decimals: 6,
    total_supply: "1000000000000000",
    token_uri: "https://velar.co/metadata/velar-token.json",
    description: "DeFi Liquidity Protocol on Bitcoin",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token/1.png",
    image_canonical_uri:
      "https://raw.githubusercontent.com/velar-be/asset-hosting/main/velar.jpg",
    tx_id: "0x1c8596844d869cdafdb7e9dd2f22d6b6625166ddcfc839aae5068dad7c92d74f",
    sender_address: "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
    contract_principal: "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-token",
  },
  {
    name: "Stacked STX Token",
    symbol: "stSTX",
    decimals: 6,
    total_supply: "45777304434602",
    token_uri: "https://app.stackingdao.com/ststx-token.json",
    description: "Liquid STX Token on the Stacks blockchain",
    image_uri:
      "https://assets.hiro.so/api/mainnet/token-metadata-api/SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token/1.png",
    image_canonical_uri: "https://app.stackingdao.com/ststx-logo.png",
    tx_id: "0xe8fb4c8035f241f9679bef10214fb45cf4eb4ff6e82ad54b9355ae49829882e9",
    sender_address: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
    contract_principal: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token",
  },
];

// const fetchData = async () => {
//   const alexTokens = await alexSDK.fetchSwappableCurrency();
//   setAlexTokens(alexTokens);

//   const velarTokens = await getTokens();
//   setVelarTokens(velarTokens);

//   const vTokens = velarTokens ? velarTokens : {}

//   const tokensData: TokenData[] = [];
//   for (const token of alexTokens) {
//     tokensData.push({ symbol: token.id, name: token.name, address: token.underlyingToken })
//   }

//   for (const token of Object.keys(vTokens)) {
//     const existsInAlex = alexTokens.some(alexToken => alexToken.name === token);

//     if (!existsInAlex) {
//       const tokenData = await getTokenInfo(token);
//       if (tokenData) {
//         tokensData.push({ symbol: tokenData.symbol, name: tokenData.name, address: tokenData.tokenAddress })
//       }
//     }
//   }
//   setTokens(tokensData);
// }
