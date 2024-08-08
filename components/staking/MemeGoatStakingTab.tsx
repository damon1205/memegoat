"use client"
import { Avatar, Button, Input } from "antd"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { StakeInfo, PendingTxnStaking, IStake } from "@/interface"
import { contractAddress, fetchCurrNoOfBlocks, getExplorerLink, getUserPrincipal, getUserTokenBalance, network, onConnectWallet, userSession } from "@/utils/stacks.data"
import { calculateRewards, getUserStakeData, getUserStakeStatus } from "@/lib/contracts/staking/goat"
import { useNotificationConfig } from "@/hooks/useNotification"
import { txFailMessage, txMessage } from "@/data/constants"
import { generateStakeTransaction, generateUnstakeTransaction } from "@/lib/contracts/staking/goat"
import { convertBlocksToDate, formatBal, formatCVTypeNumber, formatNumber } from "@/utils/format"
import { PendingTransactions } from "../shared/PendingTransactions"
import { useConnect } from "@stacks/connect-react"
import { genHex } from "@/utils/helpers"
import moment from "moment"
import { storeTransaction } from "@/utils/db"

const stakesDays: IStake[] = [
  {
    day: 30,
    value: "30 Days",
    stakeIndex: 1,
    apr: "1%",
    noOfBlocks: 4320,
    interestRate: 8,
  },
  {
    day: 90,
    value: "90 Days",
    stakeIndex: 2,
    apr: "3%",
    noOfBlocks: 12960,
    interestRate: 73
  },
  {
    day: 180,
    value: "180 Days",
    stakeIndex: 3,
    apr: "7%",
    noOfBlocks: 25920,
    interestRate: 345
  },
  {
    day: 270,
    value: "270 Days",
    stakeIndex: 4,
    apr: "11%",
    noOfBlocks: 38880,
    interestRate: 814
  },
];

export const MemeGoatStakingTab = () => {
  const { doContractCall } = useConnect()
  const [memegoatBalance, setMemegoatBalance] = useState<number>(0);
  const [stakeIndex, setStakeIndex] = useState<number>(1);
  const [blocks, setBlocks] = useState<number>(4320);
  const [apr, setAPR] = useState<string>("1%");
  const [interest, setInterest] = useState<number>(8)
  const [amount, setAmount] = useState<number>(0);
  const [userStake, setUserStake] = useState<StakeInfo | null>(null);
  const [userHasStake, setUserHasStake] = useState<boolean>(false);
  const amountRef = useRef(null) as any
  const [rewards, setRewards] = useState<number>(0);
  const [earnedRewards, setEarnedRewards] = useState<number>(0);
  const [currBlock, setCurrBlock] = useState<number>(0);
  const [activePeriod, setActivePeriod] = useState<number>(30);
  const [userConnected, setUserConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { config } = useNotificationConfig();

  const selectStakingDays = (
    value: number,
    index: number,
    apr: string,
    blocks: number,
    interest: number
  ) => {
    setActivePeriod(value);
    setStakeIndex(index);
    setAPR(apr);
    setBlocks(blocks);
    setInterest(interest)
  };

  function calculateExpectedReward(blocks: number, amount: number, interest: number) {
    const reward = (blocks * amount * 1e6 * interest) / (blocks * 10000 * 1e6)
    return reward
  }

  function calculateCurrentReward(calulatedPeriod: number, lockPeriod: number, amount: number, stakeIndex: number) {
    const stakeData = stakesDays.find((data) => data.stakeIndex === stakeIndex)
    const interest = stakeData?.interestRate ? stakeData.interestRate : 0
    const reward = (calulatedPeriod * amount * interest) / (lockPeriod * 10000)
    return reward
  }


  function calcAmount(percent: number) {
    const amount = (memegoatBalance * percent) / 100
    amountRef.current.value = amount
    setAmount(amount);
  }

  const handleStake = async () => {
    try {
      setLoading(true)
      if (!amount) return;
      const txStakeIndex = userStake ? formatCVTypeNumber(userStake["stake-index"]) : stakeIndex
      const txData = await generateStakeTransaction(amount * 1e6, txStakeIndex)
      doContractCall({
        ...txData,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: 'Pending',
              amount: amount,
              tag: "GOAT-STAKING",
              txSender: getUserPrincipal(),
              action: `Stake GOATSTX`
            })
          } catch (e) {
            setLoading(false)
            console.log(e)
          }
          config({
            message: txMessage,
            title: "Stake request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId)
          })
          setLoading(false)
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled");
          config({
            message: "User canceled transaction",
            title: "Staking",
            type: "error",
          })
          setLoading(false)
        },
      });
    } catch (e) {
      if (e instanceof Error) {
        config({ message: e.message, title: txFailMessage, type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: txFailMessage, type: 'error' })
      }
      setLoading(false)
    }
  }

  const handleUnStake = async () => {
    try {
      setLoading(true)
      const txData = await generateUnstakeTransaction(userStake, rewards)
      doContractCall({
        ...txData,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: 'Pending',
              amount: rewards,
              tag: "GOAT-STAKING",
              txSender: getUserPrincipal(),
              action: `Unstake GOATSTX`
            })
          } catch (e) {
            setLoading(false)
            console.log(e)
          }
          config({
            message: txMessage,
            title: "Unstake request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId)
          })
          setLoading(false)
        },
        onCancel: () => {
          setLoading(false)
          console.log("onCancel:", "Transaction was canceled");
        },
      });
    } catch (e) {
      console.log(e)
      setLoading(false)
      if (e instanceof Error) {
        config({ message: e.message, title: txFailMessage, type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: txFailMessage, type: 'error' })
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!userSession.isUserSignedIn()) return;
      const result2 = await getUserStakeStatus();
      setUserHasStake(result2);

      const result1 = await getUserStakeData();
      setUserStake(result1);

      const currBlock = await fetchCurrNoOfBlocks();
      setCurrBlock(currBlock)

      if (result2) {
        const stakeInfo = (result1 as StakeInfo)
        const stakeIndex = formatCVTypeNumber(stakeInfo["stake-index"])
        const lockRewards = formatCVTypeNumber(stakeInfo["lock-rewards"]) > 0 ? formatCVTypeNumber(stakeInfo["lock-rewards"]) / 1e6 : 0;
        setStakeIndex(stakeIndex)
        const depositBlock = formatCVTypeNumber(stakeInfo["deposit-block"]);
        const depositAmount = formatCVTypeNumber(stakeInfo["deposit-amount"]);
        const endBlock = formatCVTypeNumber(stakeInfo["end-block"]);
        const calculatedPeriod = endBlock > currBlock ? currBlock - depositBlock : endBlock - depositBlock;
        const lockPeriod = endBlock - depositBlock;
        const reward = calculateCurrentReward(calculatedPeriod, lockPeriod, depositAmount, stakeIndex)
        setEarnedRewards(reward + lockRewards)
      }

      const result3 = await calculateRewards();
      setRewards(result3);

      const result4 = await getUserTokenBalance(`${contractAddress}.memegoatstx`);
      setMemegoatBalance(result4)

      setUserConnected(true)
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0] minter-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5 }}
          className="relative  w-[60rem] h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="w-full rounded-lg md:w-[500px]  bg-[#060f0a] relative border-[1px] border-[#16261C] "
      >
        <div className="flex items-center gap-2 p-4 border-b-[1px] border-[#16261C] justify-between">
          <div className="flex items-center gap-2">
            <Avatar src="/logo.svg" size={45} />
            <p>Stake GoatSTX</p>
          </div>

          <div className="flex items-center justify-end mb-2 gap-2 z-10">
            <PendingTransactions txRequest={{ tag: "GOAT-STAKING", address: getUserPrincipal() }} />
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="mt-3 text-sm rounded-sm">
            <div className="">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/80 text-sm">Stake amount</p>
                <p>
                  <span className="text-white/40 text-sm">Balance: </span>{" "}
                  {memegoatBalance}
                </p>
              </div>
              <div className="">
                <Input
                  className="w-full bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[45px]"
                  placeholder="Enter Amount"
                  ref={amountRef}
                  onChange={(e) => {
                    const value = e.target.value;
                    amountRef.current.value = value
                    setAmount(Number(value));
                  }}
                  suffix={
                    <Button
                      type="primary"
                      className="w-full h-[30px] rounded-md"
                      onClick={() => calcAmount(100)}
                    >
                      Max
                    </Button>
                  }
                />
              </div>
              <div></div>
            </div>
          </div>

          <div>
            {userHasStake ?
              (
                <div className="py-2 mt-4">
                  <div className="flex items-center gap-2 justify-between text-sm">
                    <p className="text-white/70">Your Active Stake Period</p>
                    <p className="">{stakesDays[stakeIndex - 1].value}</p>
                  </div>
                  <div className="flex items-center gap-2 justify-between text-sm">
                    <p className="text-white/70">Total Amount Staked</p>
                    <p className="">{userStake ? formatNumber(formatBal(formatCVTypeNumber(userStake["deposit-amount"]))) : '0'} GOATSTX</p>
                  </div>
                  <div className="flex items-center gap-2 justify-between text-sm">
                    <p className="text-white/70">Unlock Date</p>
                    <p className="">{userStake ? moment(convertBlocksToDate(formatCVTypeNumber(userStake["end-block"]), currBlock)).format("LL") : '0'}</p>
                  </div>
                  <div className="my-6 grid grid-cols-3 bg-[#FFFFFF08] p-2 pb-2 pt-3 rounded-lg">
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm">APR Rate</p>
                      <p className="text-white/60 text-sm mt-1">{stakesDays[stakeIndex - 1].apr}</p>
                    </div>
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm">Maturity Block</p>
                      <p className="text-white/60 text-sm mt-1">{userStake ? formatCVTypeNumber(userStake["end-block"]) : 0}</p>
                    </div>
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm">Reward Earned</p>
                      <p className="text-white/60 text-sm mt-1">{userStake ? (formatBal(earnedRewards) + formatBal(formatCVTypeNumber(userStake?.["lock-rewards"]))).toFixed(3) : 0}</p>
                    </div>
                  </div>
                </div>
              )
              :
              (
                <>
                  <div className="col-span-5 py-2 grid grid-cols-4 gap-4 my-4 rounded-sm">
                    {stakesDays.map((data: IStake, key: number) => {
                      const active = data.day === activePeriod
                      const activeCls = active
                        ? "bg-primary-70/20 text-primary-40"
                        : "text-white/60"
                      return (
                        <p
                          key={key}
                          className={`${activeCls} p-2 flex items-center justify-center cursor-pointer text-sm rounded-md`}
                          onClick={() => {
                            selectStakingDays(data.day, data.stakeIndex, data.apr, data.noOfBlocks, data.interestRate)
                          }}
                        >
                          {data.value}
                        </p>
                      )
                    })}
                  </div>

                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-2 justify-between text-sm">
                      <p className="text-white/70">Staking Amount</p>
                      <p className="">{amount} GoatSTX</p>
                    </div>
                    <div className="flex items-center gap-2 justify-between text-sm">
                      <p className="text-white/70">Staking Fee</p>
                      <p className="text-primary-50">0.01%</p>
                    </div>
                  </div>

                  <div className="my-6 grid grid-cols-3 bg-[#FFFFFF08] p-2 pb-2 pt-3 rounded-lg">
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm w-max">APR Rate</p>
                      <p className="text-white/60 text-sm mt-1">{apr}</p>
                    </div>
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm">Maturity Block</p>
                      <p className="text-white/60 text-sm mt-1">{blocks}</p>
                    </div>
                    <div className="px-4 py-0 text-center">
                      <p className="font-semibold text-sm">Stake Reward</p>
                      <p className="text-white/60 text-sm mt-1">{calculateExpectedReward(blocks, amount, interest)}</p>
                    </div>
                  </div>
                </>

              )
            }
          </div>

          {!userConnected ?
            <div>
              <Button type="primary" className="w-full rounded-lg h-[44px]" onClick={() => onConnectWallet()}>
                Connect Wallet
              </Button>
            </div>
            :
            <div>
              <Button type="primary" className="w-full rounded-lg h-[44px]" onClick={() => handleStake()} loading={loading}>
                {loading ? "Submitting Transaction" : "Stake"}
              </Button>
              {userHasStake && userStake &&
                <Button type='primary' loading={loading} className="w-full rounded-lg h-[44px] mt-3 bg-red-500" disabled={currBlock < formatCVTypeNumber(userStake["end-block"])} onClick={() => handleUnStake()}>
                  {loading ? "Submitting Transaction" : "UnStake"}
                </Button>
              }
            </div>
          }
          <div className="text-center text-white/50 text-sm my-4">
            <p>
              Current Block{" "}
              <span className="text-white font-medium">{currBlock}</span>
            </p>
            <p className="mt-1">
              Min Stake is{" "}
              <span className="text-primary-50 font-medium">200,000</span>{" "}
              $GOATSTX
            </p>
          </div>
        </div>
      </motion.div >
    </div>
  )
}
