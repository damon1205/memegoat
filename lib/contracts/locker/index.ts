import { ITokenMetadata } from "@/interface";
import { getUserPrincipal } from "@/utils/stacks.data";

export const storeDB = (
  txID: string,
  amount: number,
  blockTime: number,
  tokenMetadata: ITokenMetadata | null
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
    txID: txID,
    tag: "locker",
    userAddr: getUserPrincipal(),
    action: "Token Lock",
    amount: amount,
    blockTime: blockTime,
    tokenMetadata: tokenMetadata,
  };
  const dataStr = JSON.stringify(data);
  localStorage.setItem(newTxnIndex, dataStr);
};
