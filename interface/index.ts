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

export interface TokenMinterProgressI {
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
  hard_cap: string;
  start_date: string;
  end_date: string;
  id: string;
}
