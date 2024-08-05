"use client"
import { Button, Drawer, Steps } from "antd"
import React, { ReactNode, useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import { Minter } from "../minter/Minter"
import { CampaignAllocation } from "./CampaignAllocation"
import { CreateTokenSale } from "./TokenSale"

export const CreateLaunchPad = () => {
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => setOpen(!open)
  const [current, setCurrent] = useState(0)
  const stepsNodes: ReactNode[] = [
    <Minter {...{ current, setCurrent, minter: false }} key={0} />,
    <CreateTokenSale {...{ current, setCurrent }} key={1} />,
  ]
  const onChange = (value: number) => {
    setCurrent(value)
  }
  return (
    <div>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        placement="left"
        title={"Create Staking Pool"}
        styles={{
          mask: { backdropFilter: "blur(22px)" },
          content: {
            background: "rgba(16,69,29,0.1)",
            border: "1px solid rgba(16,69,29,0.85)",
          },
          header: { background: "transparent" },
        }}
        closeIcon={
          <IoCloseCircleOutline className="text-2xl text-primary-50" />
        }
        width={630}
      >
        <Steps
          current={current}
          onChange={onChange}
          items={[
            {
              title: <p className="md:text-lg text-[14px]">Token</p>,
              description: (
                <p className="text-zinc-400 text-xs">Token Minter</p>
              ),
              disabled: true,
            },
            {
              title: <p className="md:text-lg text-[14px]">Token Sale</p>,
              description: (
                <p className="text-zinc-400 text-xs">Create Token Sale</p>
              ),
              disabled: true,
            },
          ]}
          responsive={false}
        />
        <div className="py-[2rem] md:max-w-[90%] mx-auto [&>.minter-foreground]:hidden">
          {stepsNodes[current]}
        </div>
      </Drawer>
      <Button
        className="bg-primary-60 mt-4"
        type="primary"
        onClick={toggleDrawer}
      >
        Create Launchpad
      </Button>
    </div>
  )
}
