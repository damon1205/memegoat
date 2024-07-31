"use client"
import { Avatar, Divider, Skeleton } from "antd"
import { BiLinkExternal } from "react-icons/bi"
import { StakeToken } from "./StakeToken"
import { UnstakeToken } from "./UnstakeToken"
import Link from "next/link"
import { ITokenMetadata, PendingTxnPool, StakeInterface, UserStakeInterface } from "@/interface"
import { useEffect, useState } from "react"
import { getEndDate, getMetas, getUserEarnings, getUserHasStake, getUserStakeInfo, getStoredPendingTransactions, checkForStake, filterStakePendingTxn, filterClaimPendingTxn, calcRewardPerblock } from "@/lib/contracts/staking"
import { getAddress } from "@/utils/helpers"
import { formatCVTypeNumber, formatNumber } from "@/utils/format"
import { getAddressLink, network } from "@/utils/stacks.data"
import { ClaimBtn } from "./ClaimBtn"

interface props {
  stakeInfo: StakeInterface
  stakedOnly: boolean
  ended: boolean
}

export const StakeCard = ({
  stakeInfo,
  stakedOnly,
  ended,
}: props) => {
  const [userStakeInfo, setUserStakeInfo] = useState<UserStakeInterface | null>(
    null,
  );
  const [stakeToken, setStakeToken] = useState<ITokenMetadata | null>(null);
  const [rewardToken, setRewardToken] = useState<ITokenMetadata | null>(null);
  const [earned, setEarned] = useState<number>(0);
  const [endDate, setEndDate] = useState<string>("");
  const [userHasStake, setHasStake] = useState<boolean>(false);
  const [pendingTxns, setPendingTxns] = useState<PendingTxnPool[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserStakeInfo(stakeInfo);
      setUserStakeInfo(result);
      const result1 = await getMetas(stakeInfo);
      setRewardToken(result1.rewardMetadata);
      setStakeToken(result1.stakeMetadata);
      const result2 = await getEndDate(stakeInfo);
      setEndDate(result2);
      const result3 = await getUserEarnings(formatCVTypeNumber(stakeInfo.id));
      setEarned(result3);
      const result4 = await getUserHasStake(stakeInfo);
      setHasStake(result4);
      const result5 = await getStoredPendingTransactions(stakeInfo)
      setPendingTxns(result5)
    }

    fetchData()

  }, [stakeInfo]);

  return (
    <>
      {stakeInfo && checkForStake(stakedOnly, userHasStake) && (
        <div className="border-[1px] border-primary-100">
          <div className="py-3 px-5 bg-primary-100/30 border-b-[2px] border-b-primary-100 rounded-t-[3px] flex flex-wrap items-center justify-between">
            <div>
              <h3 className="font-medium">Earn {rewardToken ? rewardToken.symbol : ""}</h3>
              <p className="text-xs mt-2">Stake {stakeToken ? stakeToken.symbol : ""}</p>
            </div>
            <div className="relative">
              <Avatar src={rewardToken ? rewardToken.image_uri : ""} size={60} />
              <Avatar
                src={stakeToken ? stakeToken.image_uri : ""}
                size={30}
                className="absolute bottom-[0px] right-[-5px]"
              />
            </div>
          </div>

          <div className="py-3 pb-[1rem] px-5 space-y-4 text-sm md:backdrop-blur-[22px]">
            <div className="flex items-center gap-2 justify-between ">
              <p className="text-gray-400">APR</p>
              <p>16%</p>
            </div>
            <div className="">
              <p className="text-gray-400 mb-2">Your Staked</p>
              <div className="flex items-center justify-between">
                <div className="inline-flex gap-2 items-center">
                  <Avatar src={stakeToken ? stakeToken.image_uri : ""} size={30} />
                  <div>
                    <span className="mr-3">0.0 {stakeToken ? stakeToken.symbol : ""}</span>
                    <span className="mr-3 text-gray-400">$0.0</span>
                  </div>
                </div>
                <div className="inline-flex gap-2 items-center">
                  <StakeToken
                    stake_token={getAddress(stakeInfo['stake-token'])}
                    disabled={ended}
                    stakeId={formatCVTypeNumber(stakeInfo.id)}
                    pendingTxns={filterStakePendingTxn(pendingTxns)}
                    token_icon={stakeToken ? stakeToken.image_uri : ""}
                  />
                  <UnstakeToken
                    stake_token={getAddress(stakeInfo['stake-token'])}
                    stakeId={formatCVTypeNumber(stakeInfo.id)}
                    pendingTxns={filterStakePendingTxn(pendingTxns)}
                    token_icon={stakeToken ? stakeToken.image_uri : ""}
                    staked_amount={userStakeInfo ? formatCVTypeNumber(userStakeInfo["amount-staked"]) / 1e6 : 0}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">{rewardToken ? rewardToken.symbol : ""} earned</p>
              <div className="flex items-center justify-between">
                <div className="inline-flex gap-2 items-center">
                  <div>
                    <span className="mr-3">
                      {loading ?
                        <Skeleton.Input active={true} size={'small'} block={false} />
                        : formatNumber(earned / 1e12)} {rewardToken ? rewardToken.symbol : ""}
                    </span>
                  </div>
                </div>
                <ClaimBtn
                  stakeId={formatCVTypeNumber(stakeInfo.id)}
                  reward_token={getAddress(stakeInfo["reward-token"])}
                  pendingTxns={filterClaimPendingTxn(pendingTxns)}
                  erpb={calcRewardPerblock(stakeInfo, userStakeInfo)}
                  earned={earned} />
              </div>
            </div>
            <div>
              <Divider className="my-5" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-400">Total Staked</p>
                <div>
                  {stakeInfo
                    ? formatNumber(formatCVTypeNumber(stakeInfo["total-staked"]) / 1e6)
                    : 0.0}{" "}
                  {stakeToken ? stakeToken.symbol : ""}
                  {/* <p className="text-end mt-1 text-gray-400">
                    {Intl.NumberFormat("en-US", {
                      currency: "USD",
                      style: "currency",
                    }).format(603425.65)}
                  </p> */}
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">Daily Reward</p>
                <div>
                  {stakeInfo
                    ? formatCVTypeNumber(stakeInfo["reward-per-block"]) / 1e6
                    : 0}{" "}
                  {rewardToken ? rewardToken.symbol : ""}
                  {/* <p className="text-end mt-1 text-gray-400">
                    {Intl.NumberFormat("en-US", {
                      currency: "USD",
                      style: "currency",
                    }).format(3425.65)}
                  </p> */}
                </div>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-400">Ends In</p>
                <div>
                  <p>{stakeInfo ? endDate : "--"}</p>
                </div>
              </div>
              <p className="text-end">
                <Link href={getAddressLink(network, getAddress(stakeInfo.owner))}
                  target="_blank"
                  className="text-primary-50"
                >
                  <span>Creator Address</span>
                  <BiLinkExternal className="inline ml-2" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

    </>

  )
}
