import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { ApiURLS, contractAddress, network, networkInstance, userSession } from "@/utils/stacks.data";
import axios from "axios";
import { toast } from "react-toastify";
import { getTokenSource, splitToken } from "@/utils/helpers";
import { FungibleConditionCode, createAssetInfo, makeContractFungiblePostCondition, AnchorMode, uintCV, contractPrincipalCV, PostConditionMode } from "@stacks/transactions";
import { useConnect } from "@stacks/connect-react";
import { LoadingOutlined } from '@ant-design/icons';
import { PendingTxnPool } from "@/interface";
import { fetchTransactionStatus, generateClaimTransaction, getUserEarnings, storeDB } from "@/lib/contracts/staking";

interface props {
  stakeId: number;
  reward_token: string;
  // update: () => void;
  pendingTxns: PendingTxnPool[];
  earned: number;
  erpb: number
}

export const ClaimBtn = ({ stakeId, reward_token, erpb, pendingTxns, earned }: props) => {
  const [txStatus, setTxStatus] = useState<string>("notactive");
  const [loading, setLoading] = useState<boolean>(false);
  const { doContractCall } = useConnect();

  const hanleClaim = async () => {
    if (!userSession.isUserSignedIn) return;
    try {
      const txn = await generateClaimTransaction(stakeId, reward_token, erpb);
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          storeDB("Claim Tokens", data.txId, earned, reward_token, stakeId.toString());
        },
        onCancel: () => {
          // setLoading(false)
          console.log("onCancel:", "Transaction was canceled");
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  }

  useEffect(() => {
    setTxStatus(pendingTxns.length > 0 ? "pending" : "notactive");
    const handleTransactionStatus = async () => {
      if (pendingTxns.length < 0) return;
      try {
        const txn = pendingTxns[0];
        const result = await fetchTransactionStatus(txn);
        if (result !== "pending") {
          localStorage.removeItem(txn.key);
          if (result === "success") {
            toast.success(`${txn.action} Successful`);
          } else {
            toast.error(`${txn.action} Failed`);
          }
          // update()
        }
      } catch (e) {
        console.log(e)
      }
    }

    const interval = setInterval(() => {
      if (txStatus === "notactive") return;
      handleTransactionStatus();
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [pendingTxns, txStatus])

  return (
    <button
      className={`inline-block px-[12px] py-[6px] ${!(earned > 0) || loading ? 'bg-black text-black' : 'bg-primary-50/90 text-gray-200'}  w-[65px]`}
      onClick={() => hanleClaim()}
      disabled={!(earned > 0) || loading}
    >
      {loading ? <Spin indicator={<LoadingOutlined spin />} className="w-full h-full" /> : "Claim"}
    </button>
  )

}