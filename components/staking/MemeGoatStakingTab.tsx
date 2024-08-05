"use client"
import { Avatar, Button, Input } from "antd"
import React, { useState } from "react"
import { BiWallet } from "react-icons/bi"

type periodT = "30" | "90" | "180" | "270"

export const MemeGoatStakingTab = () => {
  const periods: periodT[] = ["30", "90", "180", "270"]
  const [activePeriod, setActivePeriod] = useState<periodT>("30")
  return (
    <div className="w-full rounded-sm md:w-[500px] p-4  from-primary-100/25 to-primary-100/30 bg-gradient-to-r relative border-[1px] border-primary-100">
      <p>Stake GoatSTX</p>

      <div className="from-primary-60/5 to-primary-60/20 bg-gradient-to-r  mt-3 px-4 py-4 text-sm rounded-sm">
        <div className="flex items-center gap-2 justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar src="/logo.svg" size={45} />
            <p>GoatSTX</p>
          </div>
          <div className="flex items-center gap-2">
            <BiWallet size={25} />
            <p>0</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3">
            <Input
              className="w-full h-[44px] bg-black/5 border-primary-70 rounded-sm"
              placeholder="Enter Amount"
            />
          </div>
          <div>
            <Button type="primary" className="w-full h-[44px] rounded-sm">
              Max
            </Button>
          </div>
        </div>
      </div>

      <div className="col-span-5 border-[1px] border-primary-100/85 p-2 px-2 grid grid-cols-4 gap-4 bg-primary-100/40 my-4 rounded-sm">
        {periods.map((value) => {
          const active = value === activePeriod
          const activeCls = active ? "bg-primary-60" : ""
          return (
            <p
              key={value}
              className={`${activeCls} p-2 flex items-center justify-center cursor-pointer text-sm rounded-sm`}
              onClick={() => setActivePeriod(value)}
            >
              {value} days
            </p>
          )
        })}
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 justify-between text-sm">
          <p>Staking Amount</p>
          <p className="text-primary-50">0 GoatSTX</p>
        </div>
        <div className="flex items-center gap-2 justify-between text-sm">
          <p>Staking Fee</p>
          <p className="text-primary-50">0.01%</p>
        </div>
        <div className="flex items-center gap-2 justify-between text-sm">
          <p>Staked Amount</p>
          <p className="text-primary-50">0 GoatSTX</p>
        </div>
      </div>

      <div className="my-6 grid grid-cols-3">
        <div className="border-r-[2px] border-primary-50/30 px-4 py-0 text-center">
          <p className="font-semibold text-sm">APR Rate</p>
          <p className="text-white/60 text-sm mt-1">1%</p>
        </div>

        <div className="border-r-[2px] border-primary-50/30 px-4 py-0 text-center">
          <p className="font-semibold text-sm">Maturity Block</p>
          <p className="text-white/60 text-sm mt-1">--</p>
        </div>
        <div className="px-4 py-0 text-center">
          <p className="font-semibold text-sm">Balance</p>
          <p className="text-white/60 text-sm mt-1">0</p>
        </div>
      </div>

      <div>
        <Button type="primary" className="w-full rounded-sm h-[44px]">
          Connect Wallet
        </Button>
      </div>

      <div className="text-center text-white/50 text-sm my-4">
        <p>
          You are staking $GOATSTX for{" "}
          <span className="text-white font-medium">{activePeriod}</span> Days ≈{" "}
          <span className="text-white font-medium">4320</span> Blocks
        </p>
        <p className="mt-1">
          Min Stake is{" "}
          <span className="text-primary-50 font-medium">200,000</span> $GOATSTX
        </p>
      </div>
    </div>
  )
}
