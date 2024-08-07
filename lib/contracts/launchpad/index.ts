import {
  cvValue,
  ITokenMetadata,
  LaunchpadDataI,
  LaunchpadI,
  PendingTxnLaunchPad,
  PoolInterface,
} from "@/interface";
import { instance } from "@/utils/api";
import { formatCVTypeNumber } from "@/utils/format";
import { getTokenSource, splitToken } from "@/utils/helpers";
import {
  contractAddress,
  getUserPrincipal,
  network,
  networkInstance,
  userSession,
} from "@/utils/stacks.data";
import { velarCA } from "@/utils/velar.data";
import {
  AnchorMode,
  boolCV,
  BooleanCV,
  callReadOnlyFunction,
  contractPrincipalCV,
  createAssetInfo,
  cvToValue,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardSTXPostCondition,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  UIntCV,
} from "@stacks/transactions";
import axios from "axios";

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
  const data = {
    key: newTxnIndex,
    tag: "launchpad",
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
  if (!pendingTxns) return [];

  const array: PendingTxnLaunchPad[] = [];
  for (let i = 0; i <= Number(pendingTxns); i++) {
    const txn = localStorage.getItem(i.toString());
    if (!txn) continue;
    const parsedTxn = JSON.parse(txn);
    if (
      parsedTxn.tag !== "launchpad" ||
      parsedTxn.userAddr !== getUserPrincipal()
    )
      continue;
    array.push(parsedTxn as PendingTxnLaunchPad);
  }
  return array;
};

export const getSTXRate = async (id: number) => {
  if (!userSession.isUserSignedIn()) {
    return 0;
  }
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "get-stx-quote",
    functionArgs: [uintCV(id)],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  return Number((result as UIntCV).value.toString());
};

export const getUserDeposits = async (id: number) => {
  if (!userSession.isUserSignedIn()) {
    return 0;
  }
  const user = getUserPrincipal();
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "get-user-deposits",
    functionArgs: [standardPrincipalCV(user), uintCV(id)],
    senderAddress: user,
    network: networkInstance,
  });
  return Number((result as UIntCV).value.toString());
};

export const getLaunchpadInfo = async (token: string) => {
  if (!userSession.isUserSignedIn()) {
    return { id: 0, launch: null };
  }
  const tokenData = splitToken(token);
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "get-token-id-launch-by-addr",
    functionArgs: [contractPrincipalCV(tokenData[0], tokenData[1])],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  const id = (cvToValue(result) as UIntCV).value;
  if (id.toString() === "5005") {
    return { id: 0, launch: null };
  }
  const result2 = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "get-token-launch-by-id",
    functionArgs: [uintCV(Number(id.toString()))],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  const info = cvToValue(result2).value;
  return { id: id, launch: info !== "5004" ? info : null };
};

export const checkIfClaimed = async (id: number) => {
  if (!userSession.isUserSignedIn()) {
    return false;
  }
  const user = getUserPrincipal();
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "check-if-claimed",
    functionArgs: [standardPrincipalCV(user), uintCV(id)],
    senderAddress: user,
    network: networkInstance,
  });
  return (result as BooleanCV).type === boolCV(true).type;
};

export const calculateAllocation = async (id: number) => {
  if (userSession.isUserSignedIn()) {
    return 0;
  }
  const user = getUserPrincipal();
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "calculate-allocation",
    functionArgs: [standardPrincipalCV(user), uintCV(id)],
    senderAddress: user,
    network: networkInstance,
  });
  return Number((result as UIntCV).value.toString());
};

export const getLaunchpadOwner = (launchpad: LaunchpadI | null) => {
  if (!launchpad) return "";
  return (launchpad.owner as unknown as cvValue).value;
};

export const generateDepositSTXTransaction = (
  userPrincipal: string,
  amount: number,
  launchpadId: number
) => {
  const postConditionAddress = userPrincipal;
  const postConditionCode = FungibleConditionCode.LessEqual;
  const postConditionAmount = BigInt(amount * 1000000);

  const standardSTXPostCondition = makeStandardSTXPostCondition(
    postConditionAddress,
    postConditionCode,
    postConditionAmount
  );

  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "deposit-stx",
    functionArgs: [
      uintCV(amount * 1000000),
      uintCV(launchpadId),
      contractPrincipalCV(contractAddress, "memegoatstx"),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [standardSTXPostCondition],
  };
};

export const generateClaimTransaction = async (
  launchpadId: number,
  token: string,
  metadata: ITokenMetadata | null
) => {
  const postConditionCode = FungibleConditionCode.LessEqual;
  const tokenAddress = splitToken(token);
  const assetAddress = tokenAddress[0];
  const assetContractName = tokenAddress[1];

  let assetName: string;
  if (network === "devnet") {
    if (!metadata) throw new Error("metadata not set");
    assetName = metadata?.symbol;
  } else {
    assetName = await getTokenSource(tokenAddress[0], tokenAddress[1]);
  }
  console.log(assetName);
  if (assetName === "") {
    throw new Error("Error with token contract");
  }
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );
  const contractName = "memegoat-launchpad-vault-v2";
  const postConditionAmount = await calculateAllocation(launchpadId);

  if (!postConditionAmount) {
    throw new Error("No allocation found");
  }

  const contractFungiblePostCondition = makeContractFungiblePostCondition(
    contractAddress,
    contractName,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );

  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "claim-token",
    functionArgs: [
      uintCV(launchpadId),
      contractPrincipalCV(tokenAddress[0], tokenAddress[1]),
    ],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [contractFungiblePostCondition],
  };
};

export const getTokenLP = async (token: string) => {
  if (!token) return [];
  const tokenAddress = splitToken(token);
  const user = getUserPrincipal();
  const velar = velarCA(network);
  const result = await callReadOnlyFunction({
    contractAddress: velar,
    contractName: "univ2-core",
    functionName: "get-pool-id",
    functionArgs: [
      contractPrincipalCV(velar, "wstx"),
      contractPrincipalCV(tokenAddress[0], tokenAddress[1]),
    ],
    senderAddress: user,
    network: networkInstance,
  });
  const poolId = formatCVTypeNumber(cvToValue(result));
  const result2 = await callReadOnlyFunction({
    contractAddress: velar,
    contractName: "univ2-core",
    functionName: "do-get-pool",
    functionArgs: [uintCV(poolId)],
    senderAddress: user,
    network: networkInstance,
  });
  const lp = (
    (cvToValue(result2) as PoolInterface)["lp-token"] as unknown as cvValue
  ).value;
  return splitToken(lp);
};

export async function listToken(
  token: string,
  launchpadId: number,
  launchpadInfo: LaunchpadI,
  metadata: ITokenMetadata | null
) {
  const postConditionCode = FungibleConditionCode.LessEqual;
  const tokenAddress = splitToken(token);
  const assetAddress = tokenAddress[0];
  const assetContractName = tokenAddress[1];

  let assetName: string;
  if (network === "devnet") {
    if (!metadata) return;
    assetName = metadata?.symbol;
  } else {
    assetName = await getTokenSource(tokenAddress[0], tokenAddress[1]);
  }

  if (assetName === "") {
    throw new Error("Error with token contract");
  }
  const fungibleAssetInfo = createAssetInfo(
    assetAddress,
    assetContractName,
    assetName
  );
  const contractName = "memegoat-launchpad-vault-v2";
  const postConditionAmount = formatCVTypeNumber(
    launchpadInfo["listing-allocation"]
  );
  const postConditionAmountSTX = formatCVTypeNumber(
    launchpadInfo["total-stx-deposited"]
  );
  if (!postConditionAmount) {
    throw new Error("Invalid amount");
  }
  const contractFungiblePostCondition = makeContractFungiblePostCondition(
    contractAddress,
    contractName,
    postConditionCode,
    postConditionAmount,
    fungibleAssetInfo
  );
  const contractFungiblePostConditionSTX = makeContractSTXPostCondition(
    contractAddress,
    contractName,
    postConditionCode,
    postConditionAmountSTX
  );
  const lp = await getTokenLP(token);
  if (lp.length == 0) {
    throw new Error("Not token address found");
  }
  return {
    network: networkInstance,
    anchorMode: AnchorMode.Any,
    contractAddress,
    contractName: "memegoat-launchpad-v1-4",
    functionName: "add-exchange-liquidity",
    functionArgs: [
      uintCV(launchpadId),
      contractPrincipalCV(tokenAddress[0], tokenAddress[1]),
      contractPrincipalCV(velarCA(network), "wstx"),
      contractPrincipalCV(lp[0], lp[1]),
    ],
    postConditionMode: PostConditionMode.Allow,
    postConditions: [
      contractFungiblePostCondition,
      contractFungiblePostConditionSTX,
    ],
  };
}

export const checkAuth = (id: LaunchpadI) => {
  if (!id) return false;
  return (
    getUserPrincipal() === contractAddress ||
    getLaunchpadOwner(id) === getUserPrincipal()
  );
};

export const hardCapReached = (launchpadInfo: LaunchpadI | null) =>
  launchpadInfo
    ? formatCVTypeNumber(launchpadInfo["total-stx-deposited"]) ==
      formatCVTypeNumber(launchpadInfo.hardcap)
    : false;

export const presaleEnded = (
  launchpadInfo: LaunchpadI | null,
  currBlock: number
) =>
  launchpadInfo
    ? currBlock > formatCVTypeNumber(launchpadInfo["end-block"]) ||
      hardCapReached(launchpadInfo)
    : false;

export const calculateProgress = (launchpadInfo: LaunchpadI | null) => {
  if (!launchpadInfo) return 0;
  const stxPool = formatCVTypeNumber(launchpadInfo["total-stx-deposited"]);
  const hardcap = formatCVTypeNumber(launchpadInfo.hardcap);
  return (stxPool / hardcap) * 100;
};

export const checkLive = (
  launchpadInfo: LaunchpadI | null,
  currBlock: number
) => {
  return launchpadInfo
    ? currBlock >= formatCVTypeNumber(launchpadInfo["start-block"])
    : false;
};

export const checkDate = (dateStr: string) => {
  const now = Date.now();
  const date = new Date(dateStr);
  return now > date.getTime();
};

export const uploadCampaign = async (tokenMintProgress: LaunchpadDataI) => {
  const maxRetries = 2;
  if (!tokenMintProgress) return;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const response = await instance().post(
        "/campaign-request",
        tokenMintProgress
      );
      return response.data;
    } catch (error) {
      // Check if the error is a timeout error
      if (axios.isAxiosError(error)) {
        retries++;
        console.log(
          `Timeout error occurred, retrying (${retries}/${maxRetries})...`
        );
        continue; // Retry the request
      } else {
        console.log(error);
      }
    }
  }
};
