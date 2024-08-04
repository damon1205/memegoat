import { cvValue, PendingTxnPool, PendingTxnsI, StakeInterface, UserStakeInterface } from "@/interface";
import { convertToBlocks, formatCVTypeNumber } from "@/utils/format";
import { getAddress, getTokenSource, splitToken } from "@/utils/helpers";
import { ApiURLS, contractAddress, fetchCurrNoOfBlocks, fetchTokenMetadata, getUserPrincipal, network, networkInstance, userSession } from "@/utils/stacks.data";
import { AnchorMode, boolCV, BooleanCV, callReadOnlyFunction, contractPrincipalCV, createAssetInfo, cvToValue, FungibleConditionCode, makeContractFungiblePostCondition, makeStandardFungiblePostCondition, makeStandardSTXPostCondition, PostConditionMode, standardPrincipalCV, UIntCV, uintCV } from "@stacks/transactions";
import axios from "axios";
import toast from "react-hot-toast";

export const getStakeNonce = async () => {
  const user = getUserPrincipal() !== "" ? getUserPrincipal() : contractAddress;
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "get-stake-nonce",
    functionArgs: [],
    senderAddress: user,
    network: networkInstance,
  });
  return (Number((result as unknown as cvValue).value));
};


export const getStakes = async (stakeNonce: number) => {
  const user = getUserPrincipal() !== "" ? getUserPrincipal() : contractAddress;
  if (stakeNonce > 0) {
    const stakes: StakeInterface[] = []
    for (let i = 0; i < stakeNonce; i++) {
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName: "memegoat-staking-pool-v1",
        functionName: "get-stake-pool",
        functionArgs: [uintCV(i)],
        senderAddress: user,
        network: networkInstance,
      });
      stakes.push(cvToValue(result).value);
    }
    return stakes;
  } else {
    return []
  }
};

export function filterActiveStakes(stakes: StakeInterface[], currBlock: number): StakeInterface[] {
  return stakes.filter(obj => formatCVTypeNumber(obj["end-block"]) > currBlock);
}

export function filterEndedStakes(stakes: StakeInterface[], currBlock: number): StakeInterface[] {
  return stakes.filter(obj => formatCVTypeNumber(obj["end-block"]) < currBlock);
}

export const getUserStakeInfo = async (stakeInfo: StakeInterface | null) => {
  if (!userSession.isUserSignedIn() || !stakeInfo) { return null }
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "get-user-staking-data",
    functionArgs: [
      uintCV(formatCVTypeNumber(stakeInfo.id)),
      standardPrincipalCV(getUserPrincipal()),
    ],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });

  if (cvToValue(result).value == 3003) {
    return (null);
  } else {
    return (cvToValue(result).value)
  }
};

export const getUserEarnings = async (stakeId: number) => {
  if (userSession.isUserSignedIn()) return 0
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "calculate-rewards",
    functionArgs: [
      uintCV(stakeId),
      standardPrincipalCV(getUserPrincipal()),
    ],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  return Number((result as unknown as cvValue).value);
};

export const getUserHasStake = async (stakeInfo: StakeInterface) => {
  if (!userSession.isUserSignedIn()) return false;
  const user = getUserPrincipal()
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "get-user-stake-has-stake",
    functionArgs: [uintCV(formatCVTypeNumber(stakeInfo.id)), standardPrincipalCV(user)],
    senderAddress: user,
    network: networkInstance,
  });
  return (result as BooleanCV).type == boolCV(true).type
};

export const calcRewardPerblock = (stakeInfo: StakeInterface, userStakeInfo: UserStakeInterface | null) => {
  if (!stakeInfo || !userStakeInfo) return 0;
  const ts = formatCVTypeNumber(stakeInfo["total-staked"]);
  const us = formatCVTypeNumber(userStakeInfo["amount-staked"]);
  const rpb = formatCVTypeNumber(stakeInfo["reward-per-block"])
  return us / ts * rpb
}

export const getMetas = async (stakeInfo: StakeInterface | null) => {
  if (!stakeInfo) return { rewardMetadata: null, stakeMetadata: null };;
  const stakeMetadata = await fetchTokenMetadata(
    getAddress(stakeInfo["stake-token"]),
  );
  const rewardMetadata = await fetchTokenMetadata(
    getAddress(stakeInfo["reward-token"]),
  );
  if (!stakeMetadata || !rewardMetadata) return { rewardMetadata: null, stakeMetadata: null };
  return { rewardMetadata: rewardMetadata, stakeMetadata: stakeMetadata }
};

export const getEndDate = async (stakeInfo: StakeInterface | null) => {
  if (!stakeInfo) return "";
  const endBlock = formatCVTypeNumber(stakeInfo["end-block"]);
  const now = Date.now();
  const currBlock = await fetchCurrNoOfBlocks();
  const dist = endBlock - currBlock;
  const distInSecs = dist * 600 * 1000;
  const timeNow = now + distInSecs;
  const date = new Date(timeNow).toUTCString();
  return (date);
};

export const getStartDate = async (stakeInfo: StakeInterface | null) => {
  if (!stakeInfo) return "";
  const endBlock = formatCVTypeNumber(stakeInfo["start-block"]);
  const now = Date.now();
  const currBlock = await fetchCurrNoOfBlocks();
  const dist = endBlock - currBlock;
  const distInSecs = dist * 600 * 1000;
  const timeNow = now + distInSecs;
  const date = new Date(timeNow).toUTCString();
  return (date);
};

export const storeDB = (
  action: string,
  txID: string,
  amount: number | string,
  tokenMetadata: string,
  stakeId: string,
) => {
  if (!userSession.isUserSignedIn()) return;
  const pendingTxns = localStorage.getItem("pendingTxns");
  let newTxnIndex = "";
  if (!pendingTxns) {
    localStorage.setItem("pendingTxns", "1");
    newTxnIndex = "1";
  } else {
    const newCount = Number(pendingTxns) + 1;
    localStorage.setItem("pendingTxns", newCount.toString());
    newTxnIndex = newCount.toString();
  }
  const data = {
    key: newTxnIndex,
    stakeId: stakeId,
    tag: "stake_pool",
    txID: txID,
    userAddr: getUserPrincipal(),
    action: action,
    amount: amount,
    token: tokenMetadata,
  };
  const dataStr = JSON.stringify(data);
  localStorage.setItem(newTxnIndex, dataStr);
};

export const getStoredPendingTransactions = async (stakeInfo: StakeInterface) => {
  const pendingTxns = localStorage.getItem("pendingTxns");
  if (!pendingTxns) return [];
  const array: PendingTxnPool[] = [];
  for (let i = 0; i <= Number(pendingTxns); i++) {
    const txn = localStorage.getItem(i.toString());
    if (!txn) continue;
    const parsedTxn: PendingTxnPool = JSON.parse(txn);
    if (
      parsedTxn.tag !== "stake_pool" ||
      parsedTxn.userAddr !== getUserPrincipal() ||
      Number(parsedTxn.stakeId) !== formatCVTypeNumber(stakeInfo.id)
    )
      continue;
    array.push(parsedTxn as PendingTxnPool);
  }
  return []
};

export function filterStakePendingTxn(pendingTxns: PendingTxnPool[]) {
  return pendingTxns.filter(obj => obj.action === "Stake Tokens");
}

export function filterUnStakePendingTxn(pendingTxns: PendingTxnPool[]) {
  return pendingTxns.filter(obj => obj.action === "Unstake Tokens");
}

export const filterClaimPendingTxn = (pendingTxns: PendingTxnPool[]) => {
  return pendingTxns.filter(obj => obj.action === "Claim Tokens");
}

export const checkForStake = (stakeOnly: boolean, userHasStake: boolean) => {
  if (stakeOnly) {
    return userHasStake
  } else {
    return true
  }
}

export async function generateStakeTransaction(stakeId: number, amount: number, stake_token: string) {
  const token = splitToken(stake_token);

  let assetName: string;

  const postConditionCode = FungibleConditionCode.LessEqual;
  const assetContractName = token[1];

  if (network === "devnet") {
    assetName = 'memegoatstx';
  } else {
    assetName = await getTokenSource(token[0], token[1]);
  }
  console.log(assetName);

  if (assetName === "") {
    throw new Error('Error with token contract');
  }

  const fungibleAssetInfo = createAssetInfo(
    token[0],
    assetContractName,
    assetName,
  );
  const postConditionAmount = BigInt(amount);
  const fungiblePostCondition = makeStandardFungiblePostCondition(
    getUserPrincipal(),
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "stake",
    functionArgs: [
      uintCV(stakeId),
      uintCV(amount),
      contractPrincipalCV(token[0], token[1]),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [fungiblePostCondition],
  };
}

export const fetchTransactionStatus = async (txn: PendingTxnPool | PendingTxnsI) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: ApiURLS[network].getTxnInfo + `${txn.txID}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.request(config);
  return response.data.tx_status;
};

export async function generateUnstakeTransaction(stakeId: number, amount: number, stake_token: string) {
  const token = splitToken(stake_token);
  let assetName: string;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const assetContractName = token[1];
  if (network === "devnet") {
    assetName = 'memegoatstx';
  } else {
    assetName = await getTokenSource(token[0], token[1]);
  }
  console.log(assetName);
  if (assetName === "") {
    throw new Error("Error with token contract");
  }
  const fungibleAssetInfo = createAssetInfo(
    token[0],
    assetContractName,
    assetName,
  );
  const postConditionAmount = BigInt(amount);
  const fungiblePostCondition = makeContractFungiblePostCondition(
    contractAddress,
    'memegoat-stakepool-vault-v1',
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "unstake",
    functionArgs: [
      uintCV(stakeId),
      uintCV(amount),
      contractPrincipalCV(token[0], token[1]),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [fungiblePostCondition],
    userSession: userSession,

  };
}

export async function generateClaimTransaction(stakeId: number, reward_token: string, erpb: number) {
  const token = splitToken(reward_token);
  let assetName: string;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const assetContractName = token[1];
  if (network === "devnet") {
    assetName = 'mewstx';
  } else {
    assetName = await getTokenSource(token[0], token[1]);
  }
  console.log(assetName);
  if (assetName === "") {
    throw new Error("Error with token contract");
  }
  const fungibleAssetInfo = createAssetInfo(
    token[0],
    assetContractName,
    assetName,
  );
  const earnings = await getUserEarnings(stakeId);
  if (earnings <= 0) throw new Error("Earning are below zero");
  const postConditionAmount = BigInt((earnings / 1e6 + (erpb * 2)).toFixed(0));
  const fungiblePostCondition = makeContractFungiblePostCondition(
    contractAddress,
    'memegoat-stakepool-vault-v1',
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "claim-reward",
    functionArgs: [uintCV(stakeId), contractPrincipalCV(token[0], token[1])],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [fungiblePostCondition],
  }
}

export const calculateRewardPerBlockAtCreation = async (rewardAmount: string, startDate: string, endDate: string) => {
  if (!startDate && !endDate && !rewardAmount) {
    return 0;
  }
  const currBlock = await fetchCurrNoOfBlocks();
  const startBlock = await convertToBlocks(startDate, currBlock);
  const endBlock = await convertToBlocks(endDate, currBlock);
  const diff = endBlock - startBlock;
  if (!diff) {
    return 0;
  }
  const reward = Number(rewardAmount) / diff;
  return reward
}

export const generateCreatePoolTxn = async (reward: string, stake: string, rewardAmount: string, startDate: string, endDate: string) => {
  const postConditionCode = FungibleConditionCode.LessEqual;
  const rewardToken = splitToken(reward);
  const stakeToken = splitToken(stake);
  const assetContractName = rewardToken[1];
  const assetName = await getTokenSource(rewardToken[0], rewardToken[1]);
  if (assetName === "") {
    throw new Error("Error with token contract")
  }
  const fungibleAssetInfo = createAssetInfo(
    rewardToken[0],
    assetContractName,
    assetName,
  );
  const postConditionAmount = BigInt(Number(rewardAmount) * 1e6)
  const fungiblePostCondition = makeStandardFungiblePostCondition(
    getUserPrincipal(),
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  const postConditionCodeSTX = FungibleConditionCode.LessEqual;
  const postConditionAmountSTX = BigInt(2000000);
  const standardSTXPostCondition = makeStandardSTXPostCondition(
    getUserPrincipal(),
    postConditionCodeSTX,
    postConditionAmountSTX,
  );
  const currBlock = await fetchCurrNoOfBlocks();
  const startBlocks = await convertToBlocks(startDate, currBlock);
  const endBlocks = await convertToBlocks(endDate, currBlock);
  const rewards = await calculateRewardPerBlockAtCreation(rewardAmount, startDate, endDate);
  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-pool-v1",
    functionName: "create-pool",
    functionArgs: [
      contractPrincipalCV(stakeToken[0], stakeToken[1]),
      contractPrincipalCV(rewardToken[0], rewardToken[1]),
      uintCV(Number(rewardAmount) * 1e6),
      uintCV(Number(startBlocks)),
      uintCV(Number(endBlocks)),
      uintCV(Number(rewards.toFixed(6)) * 1e6),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [fungiblePostCondition, standardSTXPostCondition],
  };
}

