import { Dispatch, ReactNode, SetStateAction, useState } from "react"
import { motion } from "framer-motion"
import { Empty, Switch } from "antd"
import { StakeCard } from "./StakeCard"

interface TabItem {
  title: ReactNode
  key: number
  content: ReactNode
}

export const StakingTabs = () => {
  const [current, setCurrent] = useState(1)
  const tabItems: TabItem[] = [
    {
      title: "live",
      key: 1,
      content: <LiveTabContent />,
    },
    {
      title: "finished",
      key: 2,
      content: (
        <div>
          <Empty description="Nothing Here" />
        </div>
      ),
    },
  ]
  const tabHeadProps = { tabItems, current, setCurrent }
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
      <div>{tabItems.find((item) => item.key === current)?.content}</div>
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

const LiveTabContent = () => {
  const dummy = [
    {
      to_earn: "GoatSTX",
      to_stake: "STX",
      to_earn_img: "/logo.svg",
      to_stake_img: "/images/stx.svg",
    },
    {
      to_earn: "LEO",
      to_stake: "ODIN",
      to_earn_img: "/images/leo.jpg",
      to_stake_img: "/images/odin.jpg",
    },
    {
      to_earn: "NOTHING",
      to_stake: "WELSH",
      to_earn_img: "/images/nothing.jpg",
      to_stake_img: "/images/welsh.jpg",
    },

    {
      to_earn: "WELSH",
      to_stake: "STX",
      to_earn_img: "/images/welsh.jpg",
      to_stake_img: "/images/stx.svg",
    },
    {
      to_earn: "GoatSTX",
      to_stake: "ROO",
      to_earn_img: "/logo.svg",
      to_stake_img: "/images/roo.jpg",
    },
    {
      to_earn: "ODIN",
      to_stake: "LEO",
      to_earn_img: "/images/odin.jpg",
      to_stake_img: "/images/leo.jpg",
    },
  ]
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-7 content-stretch">
      {dummy.map((pool, index) => (
        <StakeCard key={index} {...pool} />
      ))}
    </div>
  )
}
