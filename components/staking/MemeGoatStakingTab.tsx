"use client"
import { Avatar, Button, Input } from "antd"
import Image from "next/image"
import React, { useState } from "react"
import { motion } from "framer-motion"

type periodT = "30" | "90" | "180" | "270"

export const MemeGoatStakingTab = () => {
  const periods: periodT[] = ["30", "90", "180", "270"]
  const [activePeriod, setActivePeriod] = useState<periodT>("30")
  return (
    <>
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
        <div className="flex items-center gap-2 p-4 border-b-[1px] border-[#16261C]">
          <Avatar src="/logo.svg" size={45} />
          <p>Stake GoatSTX</p>
        </div>

        <div className="p-4 md:p-6">
          <div className="mt-3 text-sm rounded-sm">
            <div className="">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/80 text-sm">Stake amount</p>
                <p>
                  <span className="text-white/40 text-sm">Balance: </span>{" "}
                  20,000,000
                </p>
              </div>
              <div className="">
                <Input
                  className="w-full bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[45px]"
                  placeholder="Enter Amount"
                  suffix={
                    <Button
                      type="primary"
                      className="w-full h-[30px] rounded-md"
                    >
                      Max
                    </Button>
                  }
                />
              </div>
              <div></div>
            </div>
          </div>

          <div className="col-span-5 py-2 grid grid-cols-4 gap-4  my-4 rounded-sm">
            {periods.map((value) => {
              const active = value === activePeriod
              const activeCls = active
                ? "bg-primary-70/20 text-primary-40"
                : "text-white/60"
              return (
                <p
                  key={value}
                  className={`${activeCls} p-2 flex items-center justify-center cursor-pointer text-sm rounded-md`}
                  onClick={() => setActivePeriod(value)}
                >
                  {value} days
                </p>
              )
            })}
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 justify-between text-sm">
              <p className="text-white/70">Staking Amount</p>
              <p className="">0 GoatSTX</p>
            </div>
            <div className="flex items-center gap-2 justify-between text-sm">
              <p className="text-white/70">Staking Fee</p>
              <p className="text-primary-50">0.01%</p>
            </div>
            <div className="flex items-center gap-2 justify-between text-sm">
              <p className="text-white/70">Staked Amount</p>
              <p className="">0 GoatSTX</p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-3 bg-[#FFFFFF08] p-2 pb-2 pt-3 rounded-lg">
            <div className="px-4 py-0 text-center">
              <p className="font-semibold text-sm">APR Rate</p>
              <p className="text-white/60 text-sm mt-1">1%</p>
            </div>

            <div className="px-4 py-0 text-center">
              <p className="font-semibold text-sm">Maturity Block</p>
              <p className="text-white/60 text-sm mt-1">--</p>
            </div>
            <div className="px-4 py-0 text-center">
              <p className="font-semibold text-sm">Balance</p>
              <p className="text-white/60 text-sm mt-1">0</p>
            </div>
          </div>

          <div>
            <Button type="primary" className="w-full rounded-lg h-[44px]">
              Connect Wallet
            </Button>
          </div>

          <div className="text-center text-white/50 text-sm my-4">
            <p>
              You are staking $GOATSTX for{" "}
              <span className="text-white font-medium">{activePeriod}</span>{" "}
              Days ≈ <span className="text-white font-medium">4320</span> Blocks
            </p>
            <p className="mt-1">
              Min Stake is{" "}
              <span className="text-primary-50 font-medium">200,000</span>{" "}
              $GOATSTX
            </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}
