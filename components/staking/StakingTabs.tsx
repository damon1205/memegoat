"use client"
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Empty, Switch } from "antd"
import { StakeCard } from "./StakeCard"
import {
  filterActiveStakes,
  filterEndedStakes,
  getStakeNonce,
  getStakes,
} from "@/lib/contracts/staking"
import { StakeInterface } from "@/interface"
import { fetchCurrNoOfBlocks } from "@/utils/stacks.data"
import { MemeGoatStakingTab } from "./MemeGoatStakingTab"

interface TabItem {
  title: ReactNode
  key: number
  content: ReactNode
}

export const StakingTabs = () => {
  const [current, setCurrent] = useState(1)
  const [activeStakes, setActiveStakes] = useState<StakeInterface[]>([])
  const [endedStakes, setEndedStakes] = useState<StakeInterface[]>([])
  const [stakeOnly, setStakeOnly] = useState<boolean>(false)

  const tabItems: TabItem[] = [
    // {
    //   title: "GoatSTX",
    //   key: 1,
    //   content: <MemeGoatStakingTab />,
    // },
    {
      title: "live pools",
      key: 1,
      content: (
        <TabContent
          stakes={activeStakes}
          stakedOnly={stakeOnly}
          ended={false}
        />
      ),
    },
    {
      title: "finished",
      key: 2,
      content: (
        <TabContent stakes={endedStakes} stakedOnly={stakeOnly} ended={false} />
      ),
    },
  ]
  const tabHeadProps = { tabItems, current, setCurrent }

  useEffect(() => {
    const fetchData = async () => {
      const stakeIndex = await getStakeNonce()
      const stakes = await getStakes(stakeIndex)
      const currBlock = await fetchCurrNoOfBlocks()
      const activeStakes = filterActiveStakes(stakes, currBlock)
      setActiveStakes(activeStakes)
      const endedStakes = filterEndedStakes(stakes, currBlock)
      setEndedStakes(endedStakes)
    }
    fetchData()
  }, [])

  return (
    <div>
      <div
        className="flex justify-between items-center gap-2 flex-wrap mb-7 md:mt-0 mt-10 bg-transparent"
        style={{ backdropFilter: "blur(22px)" }}
      >
        <TabHead {...tabHeadProps} />
        <div className="text-gray-300 flex gap-2 items-center">
          <p className="text-md md:tex-sm">Staked Only</p>
          <Switch />
        </div>
      </div>
      <div className="pb-5">
        {tabItems.find((item) => item.key === current)?.content}
      </div>
    </div>
  )
}

const TabHead = ({
  tabItems,
  current,
  setCurrent,
}: {
  tabItems: TabItem[]
  current: number
  setCurrent: Dispatch<SetStateAction<number>>
}) => {
  const toggleCurrent = (value: number) => {
    setCurrent(value)
  }
  return (
    <div className="inline-flex gap-2 p-[5px] bg-primary-30/20 rounded-[2px]">
      {tabItems.map((item) => {
        const active = current === item.key
        const activeCls = active
          ? "bg-primary-40 text-gray-100"
          : "text-gray-400"
        return (
          <motion.div
            layout
            key={item.key}
            className={`rounded-[2px] cursor-pointer px-7 py-1 ${activeCls}`}
            onClick={() => toggleCurrent(item.key)}
          >
            <p className="uppercase font-medium">{item.title}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

const TabContent = ({
  stakes,
  stakedOnly,
  ended,
}: {
  stakes: StakeInterface[]
  stakedOnly: boolean
  ended: boolean
}) => {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-7 content-stretch">
      {stakes.map((stake, index) => (
        <StakeCard
          key={index}
          stakeInfo={stake}
          stakedOnly={stakedOnly}
          ended={ended}
        />
      ))}
    </div>
  )
}
