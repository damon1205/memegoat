"use client"
import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, Button, Divider, Select } from "antd"
import { CgArrowsExchangeAltV } from "react-icons/cg"

const tokens = [
  {
    icon: "/logo.svg",
    name: "GoatSTX",
  },
  {
    icon: "/images/stx.svg",
    name: "STX",
  },
  {
    icon: "/images/nothing.jpg",
    name: "Nothing",
  },
]

export const Swap = () => {
  const dollarRate = 0.007
  const tokenRate = 0.030005
  const [from, setFrom] = useState({ token: "GoatSTX", amount: 0 })
  const [to, setTo] = useState({ token: "GoatSTX", amount: 0 })
  const balance = 20000000000000
  const fromRef = useRef(null) as any
  const toRef = useRef(null) as any
  const setMax = () => {
    fromRef.current.value = balance
    toRef.current.value = balance * tokenRate
    setFrom((prev) => ({ ...prev, amount: balance }))
    setTo((prev) => ({ ...prev, amount: balance * tokenRate }))
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="relative md:mt-[3rem]"
    >
      <div className="max-w-[450px] mx-auto p-4  from-primary-100/25 to-primary-100/40 bg-gradient-to-r relative border-[1px] border-primary-100">
        <div className="flex items-center justify-between">
          <p className="text-lg">Swap</p>
          <div className=" text-xs flex">
            <p className="p-1 px-3 text-custom-white/60 bg-[#080e06]">
              Slippage 2%
            </p>
            <button className="px-2 p-1 bg-primary-80">Edit</button>
          </div>
        </div>

        <div className="from-primary-60/5 to-primary-60/40 bg-gradient-to-r  mt-3 text-custom-white/60">
          <div className="flex gap-3 items-center justify-between p-2 px-4">
            <p>From</p>
            <div>
              <Select variant="borderless" defaultValue={"GoatSTX"}>
                {tokens.map((token, index) => {
                  return (
                    <Select.Option key={index} value={token.name}>
                      <div className="flex gap-1 items-center">
                        <Avatar src={token.icon} size={35} />
                        <p>{token.name}</p>
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
          </div>
          <Divider className="my-0" />
          <div className="flex gap-3 items-center justify-between p-2 px-4">
            <input
              className="w-[150px] bg-transparent border-0 outline-none text-xl text-white font-semibold"
              type="number"
              inputMode="decimal"
              maxLength={5}
              pattern="^[0-9]*[.]?[0-9]*$"
              step=".01"
              placeholder="0.00"
              onChange={(e) =>
                setFrom((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
              ref={fromRef}
            />
            <p className="text-sm">$ {from.amount * dollarRate}</p>
          </div>
          <Divider className="my-0" />
          <div className="flex gap-3 items-center justify-between p-4 px-4 mb-1">
            <p>Balance</p>
            <div className="flex gap-2 items-center">
              <p className="text-sm">{balance.toLocaleString()}</p>
              <button
                className="text-primary-40 text-sm font-semibold"
                onClick={setMax}
              >
                Use Max
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center -mt-4">
          <Avatar
            className="bg-primary-90 rounded-md border-1 border-custom-black/70 shadow-xl cursor-pointer"
            size={35}
          >
            <CgArrowsExchangeAltV className="text-4xl text-custom-white/20" />
          </Avatar>
        </div>
        <div className="from-primary-60/5 to-primary-60/40 bg-gradient-to-r  -mt-4 text-custom-white/60">
          <div className="flex gap-3 items-center justify-between p-2 px-4">
            <p>To</p>
            <div>
              <Select variant="borderless" defaultValue={"STX"}>
                {tokens.map((token, index) => {
                  return (
                    <Select.Option key={index} value={token.name}>
                      <div className="flex gap-1 items-center">
                        <Avatar src={token.icon} size={35} />
                        <p>{token.name}</p>
                      </div>
                    </Select.Option>
                  )
                })}
              </Select>
            </div>
          </div>
          <Divider className="my-0" />
          <Divider className="my-0" />
          <div className="flex gap-3 items-center justify-between p-2 px-4">
            <input
              className="w-[150px] bg-transparent border-0 outline-none text-xl text-white font-semibold"
              type="number"
              inputMode="decimal"
              maxLength={5}
              pattern="^[0-9]*[.]?[0-9]*$"
              step=".01"
              placeholder="0.00"
              onChange={(e) =>
                setTo((prev) => ({ ...prev, amount: Number(e.target.value) }))
              }
              ref={toRef}
            />
            <p className="text-sm">$ {to.amount * dollarRate}</p>
          </div>
          <Divider className="my-0" />
          <div className="flex gap-3 items-center justify-between p-4 px-4 mb-1">
            <p>Balance</p>
            <div className="flex gap-2 items-center">
              <p className="text-sm">0</p>
            </div>
          </div>
        </div>
        <Button className="w-full mt-3" size="large" type="primary">
          Confirm Swap
        </Button>
      </div>
    </motion.div>
  )
}