import { PendingTxnStaking, StakeInfo } from "@/interface";
import { contractAddress, getUserPrincipal, networkInstance } from "@/utils/stacks.data";
import { callReadOnlyFunction, standardPrincipalCV, cvToValue, BooleanCV, AnchorMode, createAssetInfo, FungibleConditionCode, makeStandardFungiblePostCondition, PostConditionMode, uintCV, makeContractFungiblePostCondition } from "@stacks/transactions";

export const getUserStakeData = async () => {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-v1",
    functionName: "get-user-staking-data",
    functionArgs: [standardPrincipalCV(getUserPrincipal())],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  if (result.type == 8) {
    return (null);
  } else {
    return (cvToValue(result).value);
  }
};

export const getUserStakeStatus = async () => {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-v1",
    functionName: "get-user-stake-has-staked",
    functionArgs: [standardPrincipalCV(getUserPrincipal())],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  return (cvToValue(result as BooleanCV));
};

export const calculateRewards = async () => {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-staking-v1",
    functionName: "calculate-rewards",
    functionArgs: [standardPrincipalCV(getUserPrincipal())],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  if (result.type == 8) {
    return 0;
  } else {
    const reward = cvToValue(result).value;
    return reward;
  }
};

export const storePendingTxn = (
  action: string,
  txID: string,
  amount: string
) => {
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
  const data: PendingTxnStaking = {
    key: newTxnIndex,
    tag: "staking",
    txID: txID,
    userAddr: getUserPrincipal(),
    action: action,
    amount: amount,
  };
  const dataStr = JSON.stringify(data);
  localStorage.setItem(newTxnIndex, dataStr);
};

export const getStoredPendingTransactions = async () => {
  const pendingTxns = localStorage.getItem("pendingTxns");
  if (!pendingTxns) return;
  const array: PendingTxnStaking[] = [];
  for (let i = 0; i <= Number(pendingTxns); i++) {
    const txn = localStorage.getItem(i.toString());
    if (!txn) continue;
    const parsedTxn = JSON.parse(txn);
    if (
      parsedTxn.tag !== "staking" ||
      parsedTxn.userAddr !== getUserPrincipal()
    )
      return;
    array.push(parsedTxn as PendingTxnStaking);
  }
  return array
};

export const generateStakeTransaction = async (amount: number, stakeIndex: number) => {
  const postConditionCode = FungibleConditionCode.LessEqual;
  const assetAddress = contractAddress;
  const assetContractName = "memegoatstx";
  const assetName = "memegoatstx";
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName,
  );
  const postConditionAmount = amount;
  const fungiblePostCondition = makeStandardFungiblePostCondition(
    getUserPrincipal(),
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  return ({
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-v1",
    functionName: "stake",
    functionArgs: [uintCV(amount), uintCV(stakeIndex)],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [fungiblePostCondition],
  })
}

export const generateUnstakeTransaction = async (userStake: StakeInfo | null, rewards: number) => {
  const postConditionCode = FungibleConditionCode.LessEqual;
  const assetAddress = contractAddress;
  const assetContractName = "memegoatstx";
  const assetName = "memegoatstx";
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName,
  );
  const contractName = "memegoat-vault-v1";
  const depositAmount = userStake
    ? Number(userStake["deposit-amount"].value.toString())
    : 0;
  const lockedRewards = userStake
    ? Number(userStake["lock-rewards"].value.toString())
    : 0;
  const postConditionAmount =
    Number(rewards) + Number(depositAmount) + Number(lockedRewards);

  const contractFungiblePostCondition = makeContractFungiblePostCondition(
    contractAddress,
    contractName,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo,
  );
  return ({
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-staking-v1",
    functionName: "unstake",
    functionArgs: [],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [contractFungiblePostCondition],
  })

}