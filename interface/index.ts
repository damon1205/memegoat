import {
  StandardPrincipalCV,
  UIntCV,
  BooleanCV,
  OptionalCV,
  StringUtf8CV,
  TupleCV,
} from "@stacks/transactions";

export type CsvObject = { [key: string]: string };

export interface TokenDataMeta {
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

export interface TxType {
  key: string;
  id: string;
  txId: string;
  txStatus: "Pending" | "Success" | "Failed";
  amount: number;
  tag: string;
  txSender: string;
  action: string;
  createdAt: string;
}

export interface TxData {
  key: string;
  txId: string;
  txStatus: "Pending" | "Success" | "Failed";
  amount: number;
  tag: string;
  txSender: string;
  action: string;
}

export interface ITokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  total_supply: string;
  token_uri: string;
  description: string;
  image_uri: string;
  image_thumbnail_uri: string;
  image_canonical_uri: string;
  tx_id: string;
  sender_address: string;
  metadata: {
    sip: number;
    name: string;
    description: string;
    image: string;
    cached_image: string;
    cached_thumbnail_image: string;
  };
  tokenAddress: string;
}

export interface LaunchpadDataI {
  step: string;
  tx_id: string;
  tx_status: string;
  action: string;
  user_addr: string;
  token_image: string;
  token_name: string;
  token_desc: string;
  token_supply: string;
  token_ticker: string;
  token_address: string;
  token_website: string;
  twitter: string;
  discord: string;
  campaign_allocation: string;
  campaign_description: string;
  campaign_twitter: string;
  campaign_hashtags: string;
  listing_allocation: string;
  sale_allocation: string;
  sale_description: string;
  hard_cap: string;
  soft_cap: string;
  maximum_buy: string;
  minimum_buy: string;
  is_campaign: boolean;
  start_date: string;
  end_date: string;
}

export interface PendingTxnsI {
  tag: string;
  txID: string;
  userAddr: string;
  action: string;
  txStatus: string;
  reward_amount: string;
  stake_token: string;
  reward_token: string;
  start_date: string;
  end_date: string;
  token_image: string;
}

export interface cvValue {
  type: string;
  value: string;
}

export interface LaunchpadI {
  token_image: string;
  token_name: string;
  token_desc: string;
  token_address: string;
  hard_cap: string;
  start_date: string;
  end_date: string;
  id: string;
}

export interface PendingTxnLaunchPad {
  key: string;
  tag: string;
  txID: string;
  userAddr: string;
  amount: string;
  action: string;
}

export interface LaunchpadI {
  token: StandardPrincipalCV;
  "pool-amount": UIntCV;
  hardcap: UIntCV;
  softcap: UIntCV;
  "total-stx-deposited": UIntCV;
  "no-of-participants": UIntCV;
  "min-stx-deposit": UIntCV;
  "max-stx-deposit": UIntCV;
  duration: UIntCV;
  "start-block": UIntCV;
  "end-block": UIntCV;
  owner: StandardPrincipalCV;
  "is-vested": BooleanCV;
  "is-listed": BooleanCV;
  "listing-allocation": UIntCV;
  "campaign-allocation": OptionalCV;
  "campaign-rewards-sent": UIntCV;
}

export interface Pool {
  "block-height": UIntCV;
  "burn-block-height": UIntCV;
  "lp-token": StandardPrincipalCV;
  "protocol-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  reserve0: UIntCV;
  reserve1: UIntCV;
  "share-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  "swap-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  symbol: StringUtf8CV;
  token0: StandardPrincipalCV;
  token1: StandardPrincipalCV;
}

export interface PoolInterface {
  "block-height": UIntCV;
  "burn-block-height": UIntCV;
  "lp-token": StandardPrincipalCV;
  "protocol-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  reserve0: UIntCV;
  reserve1: UIntCV;
  "share-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  "swap-fee": TupleCV<{ den: UIntCV; num: UIntCV }>;
  symbol: StringUtf8CV;
  token0: StandardPrincipalCV;
  token1: StandardPrincipalCV;
}

export interface StakeInterface {
  id: UIntCV;
  "stake-token": StandardPrincipalCV;
  "reward-token": StandardPrincipalCV;
  "reward-amount": UIntCV;
  "reward-per-block": UIntCV;
  "total-staked": UIntCV;
  "start-block": UIntCV;
  "end-block": UIntCV;
  "last-update-block": UIntCV;
  "reward-per-token-staked": UIntCV;
  owner: StandardPrincipalCV;
  participants: UIntCV;
}

export interface UserStakeInterface {
  "amount-staked": UIntCV;
  "stake-rewards": UIntCV;
  "reward-per-token-staked": UIntCV;
}

export interface PendingTxnPool {
  key: string;
  stakeId: string;
  tag: string;
  txID: string;
  userAddr: string;
  action: string;
  amount: string;
  token: string;
}

export interface TokenData {
  symbol?: string;
  address: string;
  name: string;
  icon?: string;
  decimals?: number;
}

export interface TxRequest {
  status?: TxStatus;
  address?: string;
  tag?: string;
}

type TxStatus = "Failed" | "Pending" | "Successful";

export interface VelarToken {
  symbol: string;
}

export interface PendingTxnStaking {
  key: string;
  tag: string;
  txID: string;
  userAddr: string;
  referrerAddr?: string;
  amount: string;
  action: string;
}

export interface IStake {
  day: number;
  value: string;
  stakeIndex: number;
  apr: string;
  noOfBlocks: number;
  interestRate: number;
}

export interface StakeInfo {
  "deposit-amount": UIntCV;
  "deposit-block": UIntCV;
  "end-block": UIntCV;
  "lock-rewards": UIntCV;
  paid: BooleanCV;
  "stake-index": UIntCV;
}

export interface TX {
  event: string;
  data: TxData;
}
