"use client"
import { txMessage } from "@/data/constants";
import { useNotificationConfig } from "@/hooks/useNotification";
import { ITokenMetadata, TokenData } from "@/interface";
import { generateUnstakeTransaction } from "@/lib/contracts/staking";
import { storeTransaction } from "@/utils/db";
import { genHex } from "@/utils/helpers";
import { getExplorerLink, getUserPrincipal, network, userSession } from "@/utils/stacks.data";
import { useConnect } from "@stacks/connect-react";
import { Avatar, Button, Checkbox, Input, Modal } from "antd"
import { useState } from "react"
import { SlClose } from "react-icons/sl"

interface props {
  stakeId: number;
  stake_token: ITokenMetadata | TokenData | null;
  reward_token: ITokenMetadata | TokenData | null;
  token_icon: string | undefined;
  disabled: boolean;
  // update: () => void;
  staked_amount: number;
}

export const UnstakeToken = ({ stakeId, disabled, stake_token, reward_token, token_icon, staked_amount }: props) => {
  const { doContractCall } = useConnect()
  const { config } = useNotificationConfig()
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const [amount, setAmount] = useState<number>(0)
  const setMax = () => setAmount(staked_amount)
  const [checked, setChecked] = useState<boolean>(false)
  const hasStake = () => staked_amount > 0;
  const [loading, setLoading] = useState<boolean>(true)

  const handleUnstake = async (amount: number) => {
    if (!amount) return;
    if (!userSession.isUserSignedIn) return;
    if (!stake_token || !reward_token) return
    try {
      const txn = await generateUnstakeTransaction(stakeId, amount, stake_token.address, stake_token.name)
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          // storeDB("Unstake Tokens", data.txId, amount, stake_token.address, stakeId.toString());
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: 'Pending',
              amount: Number(amount),
              tag: "STAKE-POOLS",
              txSender: getUserPrincipal(),
              action: `Unstake in ${reward_token.name}/${stake_token.name} POOL`
            })
            setLoading(false)
          } catch (e) {
            console.log(e)
            setLoading(false)
          }
          setLoading(false)
          config({
            message: txMessage,
            title: "Unstake request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId)
          })
        },
        onCancel: () => {
          setLoading(false)
          console.log("onCancel:", "Transaction was canceled");
          config({
            message: "User canceled transaction",
            title: "Staking",
            type: "error",
          })
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
    <>
      {stake_token && <>
        <Modal
          onCancel={toggleOpen}
          open={open}
          closeIcon={<SlClose className="text-primary-40 text-[30px]" />}
          footer={null}
          classNames={{ content: "md:min-w-[600px]" }}
          styles={{
            content: {
              background: "#192c1e",
              borderRadius: 3,
              border: "1px solid #10451D",
            },
          }}
        >
          <h3 className="text-xl font-medium mb-7">Unstake {stake_token.name}</h3>
          <div className="flex justify-end items-center gap-2">
            <p>
              <span className="text-[#7ff39c]">Available</span>{" "}
              <span>{`${staked_amount} ${stake_token.name}`}</span>
            </p>
            <Avatar src={token_icon} size={30} />
            <p className="border-[1px] border-accent/40 text-accent  p-[1px] px-[4px]">
              SIP10
            </p>
          </div>
          <div className="my-4">
            <Input
              onChange={({ target: { value } }) => setAmount(Number(value))}
              value={amount}
              size="large"
              type="number"
              className="border-[#4a7541] bg-[#172716] h-[50px] rounded-[3px]"
              prefix={
                <p className="bg-[#48662f] px-2 py-1 rounded-sm text-xs font-medium">
                  Amount
                </p>
              }
              suffix={
                <button
                  className="text-accent bg-[#3b5f2d] px-2 py-1 text-xs font-medium"
                  onClick={setMax}
                >
                  Max
                </button>
              }
            />
          </div>
          <div className="flex gap-2 items-start text-accent bg-[#3d5f2d]  px-3 py-3 mb-4">
            <Checkbox
              onChange={({ target: { checked } }) => setChecked(checked)}
            />
            <p className="text-sm font-medium tracking-wide">
              This will reduce your position for earning pool rewards.
            </p>
          </div>
          <Button
            onClick={() => handleUnstake(amount * 1e6)}
            disabled={amount === 0 || !checked}
            className="h-[40px] rounded-[3px] w-full bg-accent"
            size="large"
            type="primary"
            loading={loading}
          >
            {loading ? "Submitting Transaction" : "UnStake"}
          </Button>
        </Modal>
        <button
          className={`inline-block px-[6px] py-[1px] border-[1px] ${hasStake() || !disabled ? 'border-primary-40/60 text-primary-40' : 'border-gray-500 text-white]'} `}
          onClick={toggleOpen}
          disabled={!hasStake() || disabled}
        >
          -
        </button>
      </>}

    </>

  )
}
