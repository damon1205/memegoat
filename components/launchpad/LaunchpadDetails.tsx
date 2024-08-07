"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Avatar, Button, Input, Progress, Tag } from "antd"
import { BsClock } from "react-icons/bs"
import moment from "moment"
import { BiCopy } from "react-icons/bi"
import {
  LaunchpadDataI,
  LaunchpadI,
} from "@/interface"
import {
  formatCVTypeNumber,
  formatNumber,
  truncateTokenAddress,
} from "@/utils/format"
import {
  calculateAllocation,
  calculateProgress,
  checkAuth,
  checkIfClaimed,
  checkLive,
  generateClaimTransaction,
  generateDepositSTXTransaction,
  getLaunchpadInfo,
  getSTXRate,
  getUserDeposits,
  hardCapReached,
  presaleEnded,
} from "@/lib/contracts/launchpad"
import {
  fetchCurrNoOfBlocks,
  fetchSTXBalance,
  getUserPrincipal,
  storeTransaction,
} from "@/utils/stacks.data"
import { uintCV } from "@stacks/transactions"
import { useConnect } from "@stacks/connect-react"
import { PendingTransactions } from "../shared/PendingTransactions"
import { useNotificationConfig } from "@/hooks/useNotification"
import { createHash } from "crypto"

export const LaunchpadDetails = ({ data }: { data: LaunchpadDataI | null }) => {
  const { doContractCall } = useConnect()
  const { config } = useNotificationConfig()
  const [launchpadInfo, setLaunchpadInfo] = useState<LaunchpadI | null>(null)
  const [launchpadId, setLaunchpadId] = useState<number>(0)
  const [STXRate, setSTXRate] = useState<number>(0)
  const [userDeposits, setUserDeposits] = useState<number>(0)
  const [stxBalance, setStxBalance] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [live, setLive] = useState<boolean>(false)
  const [allocation, setAllocation] = useState<number>(0)
  const [hasClaimed, setClaimed] = useState<boolean>(false)
  const [isOwner, setAuth] = useState<boolean>(false)
  const [hardcapStatus, setHardcapStatus] = useState<boolean>(false)
  const [presaleClosed, setPresaleClosed] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const handleDepositStx = () => {
    if (!amount) return
    try {
      const user = getUserPrincipal()
      const txnData = generateDepositSTXTransaction(user, amount, launchpadId)
      doContractCall({
        ...txnData,
        onFinish: async (txData) => {
          // storePendingTxn("Buy Presale", txData.txId, amount.toString())
          storeTransaction({
            key: createHash('sha256').update(txData.txId).digest('hex'),
            txId: txData.txId,
            txStatus: 'pending',
            amount: amount,
            tag: "LAUNCHPAD",
            txSender: getUserPrincipal(),
            action: `Buy Presale ${data?.token_ticker}`
          })
          // getStoredPendingTransactions()
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled")
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        config({ message: e.message, title: 'Launchpad', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Launchpad', type: 'error' })
      }
    }
  }

  const handleClaimToken = async () => {
    if (!data) return
    try {
      const user = getUserPrincipal()
      const txnData = await generateClaimTransaction(
        launchpadId,
        data.token_address,
        null
      )
      doContractCall({
        ...txnData,
        onFinish: async (txData) => {
          // storePendingTxn(
          //   "Claim Presale",
          //   data.txId,
          //   calculateAllocation(launchpadId).toString()
          // )
          const allocation = await calculateAllocation(launchpadId)
          storeTransaction({
            key: createHash('sha256').update(txData.txId).digest('hex'),
            txId: txData.txId,
            txStatus: 'pending',
            amount: allocation,
            tag: "LAUNCHPAD",
            txSender: getUserPrincipal(),
            action: `Claim Presale ${data?.token_ticker}`
          })
          // getStoredPendingTransactions()
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled")
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        config({ message: e.message, title: 'Launchpad', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Launchpad', type: 'error' })
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return
      if (data.token_name.toLowerCase() == 'moonmunchbtc' || 'memegoatstx') return;
      const result = await getLaunchpadInfo(data?.token_address)
      const launchpadId = Number(result.id.toString())
      setLaunchpadId(launchpadId)
      setLaunchpadInfo(result.launch)

      const result2 = await getSTXRate(launchpadId)
      setSTXRate(result2)

      const result3 = await getUserDeposits(launchpadId)
      setUserDeposits(result3)

      const result5 = await fetchSTXBalance()
      setStxBalance(result5)

      const result6 = await checkIfClaimed(launchpadId)
      setClaimed(result6)

      const result7 = await calculateAllocation(launchpadId)
      setAllocation(result7)

      const result8 = checkAuth(result.launch)
      setAuth(result8)

      const result9 = hardCapReached(result.launch)
      setHardcapStatus(result9)
      const currBlock = await fetchCurrNoOfBlocks()

      const result4 = checkLive(result.launch, currBlock)
      setLive(result4)

      const result10 = presaleEnded(result.launch, currBlock)
      setPresaleClosed(result10)

      const result11 = calculateProgress(result.launch)
      setProgress(result11)
    }

    fetchData()
  }, [data])

  return (
    <>
      {data && (
        <div>
          <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ y: 0, opacity: 0.05 }}
              transition={{ duration: 0.5 }}
              className="relative  w-[60rem] h-[60rem]"
            >
              <Image
                src={data.token_image}
                className="w-full h-full"
                alt={data.token_ticker}
                fill
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative pb-5"
          >
            <div className="p-4 md:h-[15rem] h-[10rem] from-primary-80/5 to-primary-80/20 bg-gradient-to-r relative overflow-hidden flex items-center justify-center flex-col lp-card-top">
              <div className="absolute top-[-1rem] right-5 h-[6rem] w-[2rem] bg-primary-30 rotate-[60deg] blur-[32px]" />
              <p className="relative text-custom-white/70 text-center backdrop-blur-[22px] p-1 rounded-sm md:text-3xl text-xl neonText">
                Secure layer for memes on Bitcoin
              </p>
            </div>
            <div className="p-4 bg-custom-black/60 md:w-[90%] md:mx-auto">
              <div className="flex justify-between items-center md:-mt-[5rem] -mt-[3.5rem]">
                <Avatar
                  src={data.token_image}
                  className="rounded-lg bg-primary-90/20 border-2 border-custom-black/30 p-1 md:h-[8rem] md:w-[8rem] h-[5rem] w-[5rem]"
                />
                <Tag
                  icon={<BsClock />}
                  className={`mdin-w-[4rem] flex items-center gap-2 ${live ? "bg-primary-80" : "bg-red-500"}`}
                >
                  {live ? presaleClosed ? "Active" : "Closed" : data.token_name.toLowerCase() == 'memegoatstx' ? "Closed" : "Not Started"}
                </Tag>
              </div>
              <div className="md:grid md:grid-cols-3 gap-10 mt-10 space-y-10 md:space-y-0">
                <div className="col-span-2">
                  <h3 className="text-xl">{data.token_name}</h3>
                  <p className="text-silver mb-7">
                    Secure layer of meme on Bitcoin
                  </p>
                  <p className="text-[14px]">{data.token_desc}</p>
                  <div className="mt-7">
                    <p className="border-b-[1px] border-primary-100/80 pb-2">
                      Token Details
                    </p>
                    <div className="space-y-3 mt-5">
                      <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-0 justify-between flex-wrap">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Token Name
                          </p>
                          <p className="text-sm">{data.token_name}</p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 md:text-end">
                            Contract Address
                          </p>
                          <p className="text-sm">
                            <span>
                              {truncateTokenAddress(data.token_address)}
                            </span>
                            <BiCopy className="inline ml-5 cursor-pointer" />
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-0 justify-between flex-wrap">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Hard Cap
                          </p>
                          <p className="text-sm">
                            {formatNumber(data.hard_cap)} STX
                          </p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 md:text-end">
                            Soft Cap
                          </p>
                          <p className="text-sm">
                            {formatNumber(data.soft_cap)} STX
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-0 justify-between flex-wrap">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Total Supply
                          </p>
                          <p className="text-sm">
                            {formatNumber(data.token_supply)}{" "}
                            {data.token_ticker}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 md:text-end">
                            Token Decimal
                          </p>
                          <p className="text-sm md:text-end">6</p>
                        </div>
                      </div>
                      <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-0 justify-between flex-wrap">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Target Sale
                          </p>
                          <p className="text-sm">
                            {formatNumber(data.sale_allocation)}{" "}
                            {data.token_ticker}
                          </p>
                        </div>
                        {live ? presaleClosed ?
                          <div>
                            <p className="text-xs mt-2 text-custom-white/60 text-end">
                              Ended In
                            </p>
                            <p className="text-sm">{moment(data.end_date).format("LL LT")}</p>
                          </div>
                          :
                          <div>
                            <p className="text-xs mt-2 text-custom-white/60 text-end">
                              Ends In
                            </p>
                            <p className="text-sm">{moment(data.end_date).format("LL LT")}</p>
                          </div>
                          :
                          data.token_name.toLowerCase() === 'memegoatstx' ?
                            <div>
                              <p className="text-xs mt-2 text-custom-white/60 text-end">
                                Ended In
                              </p>
                              <p className="text-sm">{moment(data.end_date).format("LL LT")}</p>
                            </div>

                            :
                            <div>
                              <p className="text-xs mt-2 text-custom-white/60 text-end">
                                Starts In
                              </p>
                              <p className="text-sm">{moment(data.start_date).format("LL LT")}</p>
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                {data.token_name !== 'MoonMunchBTC' && (
                  <>
                    <div>
                      <div className="flex items-end justify-end mb-2">
                        <PendingTransactions txRequest={{ tag: "LAUNCHPAD", address: getUserPrincipal() }} />
                      </div>
                      <div className="bg-primary-60/5 backdrop-blur-[5px] text-sm w-full">
                        <div className="p-4 text-silver border-b-[1px] border-primary-20/20 mb-5">
                          <p>
                            <BsClock className="inline mr-1" />{" "}
                            {live ? presaleClosed ? "JOIN PRESALE" : "PRESALE ENDED" : data.token_name.toLowerCase() == 'memegoatstx' ? "CLOSED" : "UPCOMING PRESALE"}
                          </p>
                        </div>

                        {live ? (
                          <div>
                            <div className="p-4">
                              <p className="text-center text-silver mb-2">
                                Total Raised
                              </p>
                              <h3 className="text-xl text-center text-primary-40">
                                {formatCVTypeNumber(
                                  launchpadInfo
                                    ? launchpadInfo["pool-amount"]
                                    : uintCV(0)
                                )}
                                /
                                <span className="text-[16px] text-silver ml-2">
                                  {formatNumber(data.hard_cap)} STX
                                </span>
                              </h3>
                              <div>
                                {(() => {
                                  const percent =
                                    formatCVTypeNumber(
                                      launchpadInfo
                                        ? launchpadInfo["pool-amount"]
                                        : uintCV(0)
                                    ) / Number(data.hard_cap)
                                  return (
                                    <Progress
                                      strokeColor="#29ab4a"
                                      percent={Number(
                                        Number(percent * 100).toFixed(2)
                                      )}
                                    />
                                  )
                                })()}
                              </div>
                              <div className="mt-3 space-y-3">
                                <div>
                                  <Input
                                    className="w-full h-[44px] rounded-sm"
                                    placeholder="Enter amount to buy"
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                  />
                                  <Button
                                    className="w-full mt-2 mb-5 rounded-sm"
                                    type="primary"
                                    onClick={() => handleDepositStx()}
                                  >
                                    Continue
                                  </Button>
                                </div>
                                <div className="flex items-center gap-5 justify-between">
                                  <p>Your Balance</p>
                                  <p className="text-primary-40">{stxBalance}</p>
                                </div>
                                <div className="flex items-center gap-5 justify-between">
                                  <p>Your Contribution</p>
                                  <p className="text-primary-40">{userDeposits}</p>
                                </div>
                                <div className="flex items-center gap-5 justify-between">
                                  <p>Final Allocation</p>
                                  <p className="text-primary-40">{allocation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="text-center text-silver mb-2">
                              Total Raised
                            </p>
                            {data.token_name.toLowerCase() == 'memegoatstx' ?
                              (
                                <>
                                  <h3 className="text-xl text-center text-primary-40">
                                    {formatNumber(50000)}
                                    /
                                    <span className="text-[16px] text-silver">
                                      {" "}
                                      {formatNumber(data.hard_cap)} STX
                                    </span>
                                  </h3>
                                  <div>
                                    {(() => {
                                      const percent = Number(50000) / Number(data.hard_cap)
                                      return (
                                        <Progress
                                          strokeColor="#29ab4a"
                                          percent={Number(
                                            Number(percent * 100).toFixed(2)
                                          )}
                                        />
                                      )
                                    })()}
                                  </div>
                                  <div className="mt-7 space-y-3">
                                  </div>
                                  <Button className="w-full mt-5" type="primary" disabled={true}>
                                    ENDED
                                  </Button>
                                </>
                              )
                              :
                              (
                                <>
                                  <div>
                                    <h3 className="text-xl text-center text-primary-40">
                                      {formatCVTypeNumber(
                                        launchpadInfo
                                          ? launchpadInfo["pool-amount"]
                                          : uintCV(0)
                                      )}
                                      /
                                      <span className="text-[16px] text-silver">
                                        {" "}
                                        {formatNumber(data.hard_cap)} STX
                                      </span>
                                    </h3>
                                    {(() => {
                                      const percent =
                                        formatCVTypeNumber(
                                          launchpadInfo
                                            ? launchpadInfo["pool-amount"]
                                            : uintCV(0)
                                        ) / Number(data.hard_cap)
                                      return (
                                        <Progress
                                          strokeColor="#29ab4a"
                                          percent={Number(
                                            Number(percent * 100).toFixed(2)
                                          )}
                                        />
                                      )
                                    })()}
                                  </div>
                                  <div className="mt-7 space-y-3">
                                    <div className="flex items-center gap-5 justify-between">
                                      <p>Your Balance</p>
                                      <p className="text-primary-40">{stxBalance}</p>
                                    </div>
                                    <div className="flex items-center gap-5 justify-between">
                                      <p>Your Contribution</p>
                                      <p className="text-primary-40">{userDeposits}</p>
                                    </div>
                                    <div className="flex items-center gap-5 justify-between">
                                      <p>Final Allocation</p>
                                      <p className="text-primary-40">{allocation}</p>
                                    </div>
                                  </div>
                                  <Button className="w-full mt-5" type="primary" onClick={() => handleClaimToken()} disabled={hasClaimed}>
                                    {hasClaimed ? "Claimed" : "Claim Now"}
                                  </Button>
                                </>
                              )
                            }
                          </div>
                        )}

                      </div>
                    </div>

                  </>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
