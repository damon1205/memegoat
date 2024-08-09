"use client"
import { Avatar, Divider, Skeleton } from "antd"
import { BiLinkExternal } from "react-icons/bi"
import { StakeToken } from "./StakeToken"
import { UnstakeToken } from "./UnstakeToken"
import Link from "next/link"
import { ITokenMetadata, StakeInterface, TokenData, UserStakeInterface } from "@/interface"
import { useEffect, useState } from "react"
import { getMetas, getUserEarnings, getUserHasStake, getUserStakeInfo, checkForStake, filterClaimPendingTxn, calcRewardPerblock } from "@/lib/contracts/staking"
import { getAddress } from "@/utils/helpers"
import { convertBlocksToDate, formatBal, formatCVTypeNumber, formatNumber } from "@/utils/format"
import { fetchCurrNoOfBlocks, getAddressLink, network } from "@/utils/stacks.data"
import { ClaimBtn } from "./ClaimBtn"
import { useTokensContext } from "@/provider/Tokens"
import moment from "moment"

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
  const { getTokenMetaByAddress } = useTokensContext()
  const [stakeToken, setStakeToken] = useState<ITokenMetadata | null>(null);
  const [rewardToken, setRewardToken] = useState<ITokenMetadata | null>(null);
  const [earned, setEarned] = useState<number>(0);
  const [endDate, setEndDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [userHasStake, setHasStake] = useState<boolean>(false);
  const [currBlock, setCurrBlock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [sToken, setSToken] = useState<TokenData | null>(null);
  const [rToken, setRToken] = useState<TokenData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getUserStakeInfo(stakeInfo);
      setUserStakeInfo(result);
      const result1 = await getMetas(stakeInfo);
      setRewardToken(result1.rewardMetadata);
      setStakeToken(result1.stakeMetadata);
      if (result1.rewardMetadata && result1.stakeMetadata) {
        const sToken = getTokenMetaByAddress(result1.stakeMetadata.address)
        const rToken = getTokenMetaByAddress(result1.rewardMetadata.address);
        setSToken(sToken);
        setRToken(rToken)
      }
      const result6 = await fetchCurrNoOfBlocks();
      setCurrBlock(result6)

      if (stakeInfo) {
        const result2 = convertBlocksToDate(formatCVTypeNumber(stakeInfo["end-block"]), result6);
        setEndDate(result2);
        const result7 = convertBlocksToDate(formatCVTypeNumber(stakeInfo["start-block"]), result6);
        setStartDate(result7);
        const result3 = await getUserEarnings(formatCVTypeNumber(stakeInfo.id));
        setEarned(result3);
        const result4 = await getUserHasStake(stakeInfo);
        setHasStake(result4);
      }
      setLoading(false)
    }
    fetchData()

  }, [stakeInfo, getTokenMetaByAddress]);

  if (loading) return <Loading />

  return (
    <>
      {stakeInfo && checkForStake(stakedOnly, userHasStake) && (
        <div className="border-[1px] border-primary-100">
          <div className="py-3 px-5 bg-primary-100/30 border-b-[2px] border-b-primary-100 rounded-t-[3px] flex flex-wrap items-center justify-between">
            <div>
              <h3 className="font-medium">Earn {rToken ? rToken.name : rewardToken ? rewardToken.symbol : ""}</h3>
              <p className="text-xs mt-2">Stake {sToken ? sToken.name : stakeToken ? stakeToken.name : ""}</p>
            </div>
            <div className="relative">
              <Avatar src={rToken ? rToken.icon : rewardToken ? rewardToken.image_uri : ""} size={60} />
              <Avatar
                src={sToken ? sToken.icon : stakeToken ? stakeToken.image_uri : ""}
                size={30}
                className="absolute bottom-[0px] right-[-5px]"
              />
            </div>
          </div>

          <div className="py-3 pb-[1rem] px-5 space-y-4 text-sm md:backdrop-blur-[22px]">
            {/* <div className="flex items-center gap-2 justify-between ">
              <p className="text-gray-400">APR</p>
              <p>16%</p>
            </div> */}
            <div className="">
              <p className="text-gray-400 mb-2">Your Staked</p>
              <div className="flex items-center justify-between">
                <div className="inline-flex gap-2 items-center">
                  <Avatar src={stakeToken ? stakeToken.image_uri : sToken?.icon} size={30} />
                  <div>
                    <span className="mr-3">{userStakeInfo ? formatNumber(formatBal(formatCVTypeNumber(userStakeInfo["amount-staked"]))) : '0'} {stakeToken ? stakeToken.symbol : ""}</span>
                    {/* <span className="mr-3 text-gray-400">$</span> */}
                  </div>
                </div>
                <div className="inline-flex gap-2 items-center">
                  <StakeToken
                    stake_token={sToken || stakeToken}
                    reward_token={rToken || rewardToken}
                    disabled={ended || (currBlock < formatCVTypeNumber(stakeInfo["start-block"]))}
                    stakeId={formatCVTypeNumber(stakeInfo.id)}
                    token_icon={sToken ? sToken.icon : stakeToken ? stakeToken.image_uri : ""}
                  />
                  <UnstakeToken
                    stake_token={sToken || stakeToken}
                    reward_token={rToken || rewardToken}
                    disabled={currBlock < formatCVTypeNumber(stakeInfo["start-block"])}
                    stakeId={formatCVTypeNumber(stakeInfo.id)}
                    token_icon={sToken ? sToken.icon : stakeToken ? stakeToken.image_uri : ""}
                    staked_amount={userStakeInfo ? formatCVTypeNumber(userStakeInfo["amount-staked"]) / 1e6 : 0}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">{rToken ? rToken.name : rewardToken ? rewardToken.symbol : ""} earned</p>
              <div className="flex items-center justify-between">
                <div className="inline-flex gap-2 items-center">
                  <div>
                    <span className="mr-3">
                      {loading ?
                        <Skeleton.Input active={true} size={'small'} block={false} />
                        : formatNumber(earned / 1e6)} {rToken ? rToken.name : rewardToken ? rewardToken.symbol : ""}
                    </span>
                  </div>
                </div>
                <ClaimBtn
                  stakeId={formatCVTypeNumber(stakeInfo.id)}
                  stake_token={sToken || stakeToken}
                  reward_token={rToken || rewardToken}
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
                  {sToken ? sToken.name : stakeToken ? stakeToken.symbol : ""}
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
                  {rToken ? rToken.name : rewardToken ? rewardToken.symbol : ""}
                  {/* <p className="text-end mt-1 text-gray-400">
                    {Intl.NumberFormat("en-US", {
                      currency: "USD",
                      style: "currency",
                    }).format(3425.65)}
                  </p> */}
                </div>
              </div>

              <div className="flex justify-between">
                {currBlock > formatCVTypeNumber(stakeInfo["start-block"]) ?
                  (
                    <>
                      <p className="text-gray-400">Ends On</p>
                      <div>
                        <p>{stakeInfo ? moment(endDate).format('LLL') : "--"}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400">Starts On</p>
                      <div>
                        <p>{stakeInfo ? moment(startDate).format('LLL') : "--"}</p>
                      </div>
                    </>
                  )
                }
              </div>
              <div className="flex justify-between">
                <p className="text-gray-400">End Block</p>
                <div>
                  <p>{stakeInfo ? formatCVTypeNumber(stakeInfo["end-block"]) : "--"}</p>
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


const Loading: React.FC = () => <Skeleton active />;
