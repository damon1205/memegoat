"use client"
import { PendingTxnPool } from "@/interface";
import { fetchTransactionStatus, generateUnstakeTransaction, storeDB } from "@/lib/contracts/staking";
import { truncateTokenAddress } from "@/utils/format";
import { splitToken } from "@/utils/helpers";
import { userSession } from "@/utils/stacks.data";
import { useConnect } from "@stacks/connect-react";
import { Avatar, Button, Checkbox, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { SlClose } from "react-icons/sl"

interface props {
  stakeId: number;
  stake_token: string;
  token_icon: string;
  disabled: boolean;
  // update: () => void;
  staked_amount: number;
  pendingTxns: PendingTxnPool[];
}

export const UnstakeToken = ({ stakeId, disabled, stake_token, token_icon, pendingTxns, staked_amount }: props) => {
  const { doContractCall } = useConnect()
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const [amount, setAmount] = useState<number>(0)
  const available = 986565646454.89
  const setMax = () => setAmount(available)
  const [checked, setChecked] = useState<boolean>(false)
  const [txStatus, setTxStatus] = useState<string>("notactive");
  const hasStake = () => staked_amount > 0;

  const handleUnstake = async (amount: number) => {
    if (!amount) return;
    if (!userSession.isUserSignedIn) return;
    try {
      const txn = await generateUnstakeTransaction(stakeId, amount, stake_token)
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          storeDB("Unstake Tokens", data.txId, amount, stake_token, stakeId.toString());
        },
        onCancel: () => {
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
        <h3 className="text-xl font-medium mb-7">Unstake {splitToken(stake_token)[1]}</h3>
        <div className="flex justify-end items-center gap-2">
          <p>
            <span className="text-[#7ff39c]">Available</span>{" "}
            <span>{`${available} ${truncateTokenAddress(stake_token)}`}</span>
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
            The staked tokens and staking income are locked for 3days by
            default. Each time the stake is increased, the locking time will be
            reset.
          </p>
        </div>
        <Button
          onClick={() => handleUnstake(amount * 1e6)}
          disabled={amount === 0 || !checked}
          className="h-[40px] rounded-[3px] w-full bg-accent"
          size="large"
          type="primary"
        >
          Unstake
        </Button>
      </Modal>
      <button
        className={`inline-block px-[6px] py-[1px] border-[1px] ${hasStake() || !disabled ? 'border-primary-40/60 text-primary-40' : 'border-gray-500 text-white]'} `}
        onClick={toggleOpen}
        disabled={hasStake() || disabled}
      >
        -
      </button>
    </>
  )
}
