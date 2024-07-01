import { Avatar, Divider } from "antd"
import { BiLinkExternal } from "react-icons/bi"
import { StakeToken } from "./StakeToken"
import { UnstakeToken } from "./UnstakeToken"
import Link from "next/link"

interface props {
  to_earn: string
  to_stake: string
  to_earn_img: string
  to_stake_img: string
}

export const StakeCard = ({
  to_earn,
  to_earn_img,
  to_stake,
  to_stake_img,
}: props) => {
  return (
    <div className="border-[1px] border-primary-100">
      <div className="py-3 px-5 bg-primary-100/30 border-b-[2px] border-b-primary-100 rounded-t-[3px] flex flex-wrap items-center justify-between">
        <div>
          <h3 className="font-medium">Earn {to_earn}</h3>
          <p className="text-xs mt-2">Stake {to_stake}</p>
        </div>
        <div className="relative">
          <Avatar src={to_earn_img} size={60} />
          <Avatar
            src={to_stake_img}
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
              <Avatar src={to_stake_img} size={30} />
              <div>
                <span className="mr-3">0.0 {to_stake}</span>
                <span className="mr-3 text-gray-400">$0.0</span>
              </div>
            </div>
            <div className="inline-flex gap-2 items-center">
              <StakeToken
                stake_token={to_stake}
                action={() => {}}
                token_icon={to_stake_img}
              />
              <UnstakeToken
                stake_token={to_stake}
                action={() => {}}
                token_icon={to_stake_img}
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-gray-400 mb-2">{to_earn} earned</p>
          <div className="flex items-center justify-between">
            <div className="inline-flex gap-2 items-center">
              <div>
                <span className="mr-3">0.0 {to_earn}</span>
                <span className="mr-3 text-gray-400">$0.0</span>
              </div>
            </div>
            <button className="inline-block px-[12px] py-[6px] bg-primary-50/90 text-gray-200">
              Claim
            </button>
          </div>
        </div>
        <div>
          <Divider className="my-5" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-gray-400">Total Staked</p>
            <div>
              <p>2,245,297 {to_earn}</p>
              <p className="text-end mt-1 text-gray-400">
                {Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                }).format(603425.65)}
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-400">Daily Reward</p>
            <div>
              <p>24,297 {to_stake}</p>
              <p className="text-end mt-1 text-gray-400">
                {Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                }).format(3425.65)}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="text-gray-400">Ends In</p>
            <div>
              <p>26d 0h 13m 14s</p>
            </div>
          </div>
          <p className="text-end">
            <Link href={""} target="_blank" className="text-primary-50">
              <span>Staked Address</span>
              <BiLinkExternal className="inline ml-2" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
