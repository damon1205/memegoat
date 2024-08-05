"use client"
import React, { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, Button, Divider } from "antd"
import { MdOutlineSwapVert } from "react-icons/md"
import { Slippage } from "./Slippage"
import { SelectToken } from "../shared/SelectToken"
import { MdKeyboardArrowDown } from "react-icons/md"
import { useNotificationConfig } from "@/hooks/useNotification"
import { TokenData } from "@/interface"
import { Currency, TokenInfo } from "alex-sdk"

const tokens = [
  {
    name: "GoatSTX",
    address: ""
  },
  {
    name: "Nothing",
    address: ""
  },
  {
    name: "STX",
    address: ""
  },
]

type Tokens = { [key: string]: string }

export const Swap = () => {
  const dollarRate = 0.007
  const tokenRate = 0.030005
  // const [from, setFrom] = useState({ token: "GoatSTX", amount: 0 })
  // const [to, setTo] = useState({ token: "STX", amount: 0 })
  const [velarTokens, setVelarTokens] = useState<Tokens | null>(null);
  const [alexTokens, setAlexTokens] = useState<TokenInfo[] | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [toTokens, setToTokens] = useState<Tokens | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [amountOut, setAmountOut] = useState<number>(0);

  const [constraint, setConstraint] = useState<number>(0);
  const [velarRoute, setVelarRoutes] = useState<string[][]>([]);
  const [velarRates, setVelarRates] = useState<number[]>([]);
  const [velarMaxIndex, setVelarMaxIndex] = useState<number>(0);
  const [alexRoute, setAlexRoute] = useState<Currency[]>([]);
  const [alexRates, setAlexRates] = useState<number[]>([]);
  const [velarIndex, setVelarIndex] = useState<number>(0);
  const [alexIndex, setAlexIndex] = useState<number>(0);
  const [mode, setMode] = useState<number>(0); // 0 for straight velar swap, 1 for straight alex swap; 2 for velar-alex swap; 3 for alex-velar swap






  // const balance = 20000000000
  const fromRef = useRef(null) as any
  const toRef = useRef(null) as any

  const setMax = () => {
    fromRef.current.value = balance
    toRef.current.value = balance * tokenRate
    setFrom((prev) => ({ ...prev, amount: balance }))
    setTo((prev) => ({ ...prev, amount: balance * tokenRate }))
  }
  const setHalf = () => {
    fromRef.current.value = balance / 2
    toRef.current.value = (balance / 2) * tokenRate
    setFrom((prev) => ({ ...prev, amount: balance / 2 }))
    setTo((prev) => ({ ...prev, amount: (balance / 2) * tokenRate }))
  }
  const [slippage, setSlippage] = useState<number>(3)

  const [viewRouteDetails, setViewRouteDetails] = useState(false)
  const toggleViewRouteDetails = () => setViewRouteDetails(!viewRouteDetails)

  const { config } = useNotificationConfig()
  const confirmSwap = () => {
    config({
      message:
        "Your swap is currently being processed and should be confirmed within 3-5 minutes. Please be patient as we complete the transaction.",
      title: "Swap request successfully received!",
      type: "success",
      details_link: "/",
    })
  }

  const handleSetToToken = (token: TokenData) => {
    setToken(token.name);
    setAmountOut(0);
    setVelarRates([]);
    setAlexRates([]);
    const edittokens = { ...tokens };
    delete edittokens[token.name];
    setToTokens(edittokens);
  };

  const handleSetFromToken = (token: TokenData) => {
    setToToken(token.name)
  };

  return (
    <React.Fragment>
      <motion.div className="relative md:w-[450px] w-full mx-auto transition-all">
        <div className="w-full p-4  from-primary-100/25 to-primary-100/40 bg-gradient-to-r relative border-[1px] border-primary-100 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-lg">Swap</p>
            <Slippage
              {...{
                ...{
                  slippage,
                  setSlippage,
                },
              }}
            />
          </div>

          <div className="from-[#03DE5305] to-[#00FF1A29] bg-gradient-to-r rounded-lg  mt-3 text-custom-white/80 py-4 border-[1px] border-primary-100/60">
            <div className="flex gap-3 items-center justify-between px-4">
              <p className="text-xs">You pay</p>
              <div className="flex items-center gap-2">
                <button
                  className="text-white text-sm bg-[#0FFF671A] rounded-xl border-[1px] border-[#0FFF6714] py-1 px-3"
                  onClick={setHalf}
                >
                  50%
                </button>
                <button
                  className="text-white text-sm bg-[#0FFF671A] rounded-xl border-[1px] border-[#0FFF6714] py-1 px-3"
                  onClick={setMax}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between p-2 px-4">
              <input
                className="w-[170px] bg-transparent border-0 outline-none text-[36px] text-white font-semibold placeholder:text-white"
                type="number"
                inputMode="decimal"
                maxLength={5}
                pattern="^[0-9]*[.]?[0-9]*$"
                step=".01"
                placeholder="0.00"
                onChange={(e) => {
                  setFrom((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                  setTo((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) * tokenRate,
                  }))

                  toRef.current.value = Number(e.target.value) * tokenRate
                }}
                ref={fromRef}
              />
              <div className="px-2 py-2 rounded-lg bg-[#00000033] border-[1px] border-[#FFFFFF1A]">
                <SelectToken tokens={tokens} action={setFromToken} />
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between px-4 mb-1">
              <p className="text-xs">
                ~ ${Number(from.amount * dollarRate).toLocaleString()}
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-white">
                  <span className="text-sm mr-2 text-white/50">Balance:</span>
                  {balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center -mt-3">
            <Avatar
              className="bg-[#1AC05799] border-1 border-[#1AC057CC] shadow-xl cursor-pointer"
              size={40}
            >
              <MdOutlineSwapVert className="text-4xl text-custom-white" />
            </Avatar>
          </div>
          <div className="from-[#03DE5305] to-[#00FF1A29] bg-gradient-to-r rounded-lg  -mt-3 text-custom-white/60 py-4 border-[1px] border-primary-100/60">
            <div className="flex gap-3 items-center justify-between px-4">
              <p className="text-xs">You get</p>
              <div></div>
            </div>

            <div className="flex gap-3 items-center justify-between p-2 px-4">
              <input
                className="w-[170px] bg-transparent border-0 outline-none text-[36px] text-white font-semibold placeholder:text-white"
                type="number"
                inputMode="decimal"
                maxLength={5}
                pattern="^[0-9]*[.]?[0-9]*$"
                step=".01"
                placeholder="0.00"
                onChange={(e) => {
                  setTo((prev) => ({ ...prev, amount: Number(e.target.value) }))
                  setFrom((prev) => ({
                    ...prev,
                    amount: Number(e.target.value) / tokenRate,
                  }))
                  fromRef.current.value = Number(e.target.value) / tokenRate
                }}
                ref={toRef}
              />
              <div className="px-2 py-2 rounded-lg bg-[#00000033] border-[1px] border-[#FFFFFF1A]">
                <SelectToken tokens={tokens} action={handleSetToToken} />
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between px-4 mb-1">
              <p className="text-xs">
                ~ ${Number(to.amount * dollarRate).toLocaleString()}
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-white">
                  <span className="text-sm mr-2 text-white/50">Balance:</span>0
                </p>
              </div>
            </div>
          </div>
          <div className="my-3">
            <Button
              className="w-full h-[43px] rounded-lg"
              size="large"
              type="primary"
              onClick={confirmSwap}
            >
              Confirm Swap
            </Button>
            <p className="py-2 text-sm">
              1 {from.token} ≈ 24520.0005 {to.token}
            </p>
            <motion.div
              className="text-primary-40 inline-flex gap-1 items-center cursor-pointer"
              onClick={toggleViewRouteDetails}
            >
              <p className="">
                {viewRouteDetails ? "hide details" : "view details"}
              </p>
              <MdKeyboardArrowDown size={20} />
            </motion.div>
          </div>

          {viewRouteDetails && (
            <div className="from-primary-60/5 to-primary-60/40 bg-gradient-to-r rounded-lg  mt-3 text-custom-white/60 px-4 p-2 text-sm">
              <p>Route Details</p>
            </div>
          )}

          <div className="mt-3 text-custom-white/60 text-sm">
            <div className="mt-2">
              <div className="flex gap-3 items-center justify-between py-1">
                <p>Minimum Output</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">254.56 {to.token}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Slippage Tolerance</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-primary-20">{slippage}%</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Liquidity Provider Fee</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">0.090075656 {from.token}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Route</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">
                    {from.token} {">"} {to.token}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  )
}
