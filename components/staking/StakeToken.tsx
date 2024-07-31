"use client"
import { PendingTxnPool } from "@/interface";
import { fetchTransactionStatus, generateStakeTransaction, storeDB } from "@/lib/contracts/staking";
import { formatNumber } from "@/utils/format";
import { splitToken } from "@/utils/helpers";
import { getUserTokenBalance, userSession } from "@/utils/stacks.data";
import { useConnect } from "@stacks/connect-react";
import { Avatar, Button, Checkbox, Input, Modal } from "antd"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { SlClose } from "react-icons/sl"

interface props {
  stakeId: number;
  stake_token: string;
  token_icon: string;
  // update: () => void;
  disabled: boolean;
  pendingTxns: PendingTxnPool[]
}

export const StakeToken = ({ stakeId, stake_token, token_icon, disabled, pendingTxns }: props) => {
  const { doContractCall } = useConnect()
  const [open, setOpen] = useState(false)
  const toggleOpen = () => setOpen(!open)
  const [amount, setAmount] = useState<number>(0)
  const available = 986565646454.89
  const setMax = () => setAmount(available)
  const [checked, setChecked] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0);
  const [txStatus, setTxStatus] = useState<string>("notactive");

  const handleStake = async (amount: number) => {
    if (!amount) return;
    if (!userSession.isUserSignedIn) return;
    try {
      const txn = await generateStakeTransaction(stakeId, amount, stake_token)
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          storeDB("Stake Tokens", data.txId, amount, stake_token, stakeId.toString());
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
    const fetchData = async () => {
      const result = await getUserTokenBalance(stake_token);
      setBalance(result)
    }
    fetchData()
  }, [stake_token])

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
        <h3 className="text-xl font-medium mb-7">Stake {splitToken(stake_token)[1]}</h3>
        <div className="flex justify-end items-center gap-2">
          <p>
            <span className="text-[#7ff39c]">Available</span>{" "}
            <span>{`${formatNumber(balance.toFixed(4))} ${stake_token}`}</span>
          </p>
          <Avatar src={token_icon} size={30} />
          <p className="border-[1px] border-primary-40/40 text-primary-40  p-[1px] px-[4px]">
            ERC20
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
          Stake
        </Button>
      </Modal>
      <button
        className={`inline-block px-[6px] py-[1px] border-[1px] ${disabled ? 'border-[#1d1818] text-[#2d2727]' : 'border-primary-40/60 text-primary-40'} `}
        onClick={toggleOpen}
        disabled={disabled}
      >
        +
      </button>
    </>
  )
}
