"use client"
import { txMessage } from "@/data/constants";
import { useNotificationConfig } from "@/hooks/useNotification";
import { ITokenMetadata, TokenData } from "@/interface";
import { generateStakeTransaction } from "@/lib/contracts/staking";
import { storeTransaction } from "@/utils/db";
import { formatNumber } from "@/utils/format";
import { genHex } from "@/utils/helpers";
import { getExplorerLink, getUserPrincipal, getUserTokenBalance, network, userSession } from "@/utils/stacks.data";
import { useConnect } from "@stacks/connect-react";
import { Avatar, Button, Checkbox, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import { SlClose } from "react-icons/sl"

interface props {
  stakeId: number;
  stake_token: ITokenMetadata | TokenData | null;
  token_icon: string | undefined;
  // update: () => void;
  reward_token: ITokenMetadata | TokenData | null;
  disabled: boolean;
}

export const StakeToken = ({ stakeId, stake_token, reward_token, token_icon, disabled }: props) => {
  const { doContractCall } = useConnect()
  const { config } = useNotificationConfig()
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const [amount, setAmount] = useState<number>(0)
  const [checked, setChecked] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0);
  const setMax = () => setAmount(balance)
  const [loading, setLoading] = useState<boolean>(false);

  console.log(stake_token, reward_token)

  const handleStake = async (amount: number) => {
    if (!amount) return;
    if (!stake_token || !reward_token) return
    if (!userSession.isUserSignedIn) return;
    try {
      setLoading(true)
      const txn = await generateStakeTransaction(stakeId, amount, stake_token.address, stake_token.name)
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: 'Pending',
              amount: Number(amount),
              tag: "STAKE-POOLS",
              txSender: getUserPrincipal(),
              action: `Stake in ${reward_token.name}/${stake_token.name} POOL`
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

  useEffect(() => {
    const fetchData = async () => {
      if (!stake_token) return
      const result = await getUserTokenBalance(stake_token.address);
      setBalance(result)
    }
    fetchData()
  }, [stake_token])

  return (
    <>
      {stake_token &&
        <>
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
            <h3 className="text-xl font-medium mb-7">Stake {stake_token.name}</h3>
            <div className="flex justify-end items-center gap-2">
              <p>
                <span className="text-[#7ff39c]">Available</span>{" "}
                <span>{`${formatNumber(balance.toFixed(4))} ${stake_token.name}`}</span>
              </p>
              <Avatar src={token_icon} size={30} />
              <p className="border-[1px] border-primary-40/40 text-primary-40  p-[1px] px-[4px]">
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
                    className="text-primary-40 bg-[#3b5f2d] px-2 py-1 text-xs font-medium"
                    onClick={setMax}
                  >
                    Max
                  </button>
                }
              />
            </div>
            <div className="flex gap-2 items-start text-primary-40 bg-[#3d5f2d]  px-3 py-3 mb-4">
              <Checkbox
                onChange={({ target: { checked } }) => setChecked(checked)}
              />
              <p className="text-sm font-medium tracking-wide">
                The staked tokens and staking income are locked for 3days by
                default. Each time the stake is increased, the locking time will be
                reset.
              </p>
            </div>
            <Button
              onClick={() => handleStake(amount * 1e6)}
              disabled={amount === 0 || !checked}
              className="h-[40px] rounded-[3px] w-full bg-primary-40"
              size="large"
              type="primary"
            >
              {loading ? "Submitting Transaction" : "Stake"}
            </Button>
          </Modal>
          <button
            className={`inline-block px-[6px] py-[1px] border-[1px] ${disabled ? 'border-gray-500 text-white' : 'border-primary-40/60 text-primary-40'} `}
            onClick={toggleOpen}
            disabled={disabled}
          >
            +
          </button>
        </>
      }
    </>
  )
}
