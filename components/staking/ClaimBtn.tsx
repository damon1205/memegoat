import { useState } from "react";
import { Spin } from "antd";
import { getExplorerLink, getUserPrincipal, network, userSession } from "@/utils/stacks.data";
import { useConnect } from "@stacks/connect-react";
import { LoadingOutlined } from '@ant-design/icons';
import { ITokenMetadata, TokenData } from "@/interface";
import { generateClaimTransaction } from "@/lib/contracts/staking";
import { useNotificationConfig } from "@/hooks/useNotification";
import { txMessage } from "@/data/constants";
import { storeTransaction } from "@/utils/db";
import { genHex } from "@/utils/helpers";

interface props {
  stakeId: number;
  reward_token: ITokenMetadata | TokenData | null;
  stake_token: ITokenMetadata | TokenData | null;
  earned: number;
  erpb: number
}

export const ClaimBtn = ({ stakeId, reward_token, stake_token, erpb, earned }: props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { config } = useNotificationConfig()
  const { doContractCall } = useConnect();

  const hanleClaim = async () => {
    if (!userSession.isUserSignedIn) return;
    if (!reward_token || !stake_token) return;
    try {
      setLoading(true)
      const txn = await generateClaimTransaction(stakeId, reward_token.address, erpb, reward_token.name);
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: 'Pending',
              amount: Number(erpb),
              tag: "STAKE-POOLS",
              txSender: getUserPrincipal(),
              action: `Claim reward from ${reward_token.name}/${stake_token.name} POOL`
            })
            setLoading(false)
          } catch (e) {
            console.log(e)
            setLoading(false)
          }
          setLoading(false)
          config({
            message: txMessage,
            title: "Stake request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId)
          })
        },
        onCancel: () => {
          setLoading(false)
          config({
            message: "User canceled transaction",
            title: "Staking",
            type: "error",
          })
          console.log("onCancel:", "Transaction was canceled");
        },
      })
    } catch (e) {
      setLoading(false)
      if (e instanceof Error) {
        config({ message: e.message, title: 'Staking', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Staking', type: 'error' })
      }
    }
  }

  return (
    <button
      className={`inline-block px-[12px] py-[6px] ${!(earned > 0) || loading ? ' bg-gray-500 text-white' : 'bg-primary-50/90 text-gray-200'}  w-[65px]`}
      onClick={() => hanleClaim()}
      disabled={!(earned > 0) || loading}
    >
      {loading ? <Spin indicator={<LoadingOutlined spin />} className="w-full h-full" /> : "Claim"}
    </button>
  )

}