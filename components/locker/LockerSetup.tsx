"use client"
import { Avatar, Button, DatePicker, Input, Radio, Select } from "antd"
import moment from "moment"
import Link from "next/link"
import React, { useRef, useState } from "react"
import { BsLockFill } from "react-icons/bs"

export const LockerSetup = () => {
  const [amount, setAmount] = useState(0)
  const [percent, setPercent] = useState(0)
  const defaultPercent = [25, 50, 75, 100]
  const amountRef = useRef(null) as any
  const balance = 1200000
  const [vestToken, setVestToken] = useState<"yes" | "no">("no")
  return (
    <div className="mb-7">
      <div className="p-4 text-center from-primary-50/15 to-primary-70/20 bg-gradient-to-r text-primary-50 relative overflow-hidden mb-5">
        <span>Token Locker</span>

        <div className="absolute top-0 right-0 text-primary-10/5 text-[5.5rem]">
          <BsLockFill />
        </div>
      </div>

      <div className="bg-[rgba(72,145,90,0.05)] border-0 border-[rgba(16,69,29,0.85)] p-4 md:p-6 backdrop-blur-[12px] text-sm">
        <div className="flex gap-3 items-center mb-5">
          <Avatar src="/logo.svg" size={50} />
          <div>
            <h3>GoatSTX</h3>
            <p className="mb-1 text-sm text-custom-white/60">
              Balance:{" "}
              <span className="text-primary-30">
                {balance.toLocaleString()} GoatSTX
              </span>
            </p>
          </div>
        </div>

        <div className="my-7 space-y-5">
          <div>
            <p className="text-primary-50 mb-3">Amount of Tokens to Lock</p>
            <div className="">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 border-[1px] border-primary-100/85 p-1 px-4 grid grid-cols-4 gap-4 from-primary-90/25 to-transparent bg-gradient-to-r">
                  {defaultPercent.map((value) => {
                    const active = value === percent
                    const activeCls = active ? "bg-primary-50/30" : ""
                    return (
                      <p
                        key={value}
                        className={`${activeCls} p-2 flex items-center justify-center cursor-pointer`}
                        onClick={() => {
                          setPercent(value)
                          amountRef.current.value = value * balance
                        }}
                      >
                        {value}%
                      </p>
                    )
                  })}
                </div>
                <div className="col-span-2">
                  <input
                    className="outline-none bg-primary-60/10 w-full h-full px-2 border-[1px] border-primary-100/85 placeholder:text-sm"
                    type="number"
                    ref={amountRef}
                    placeholder="custom"
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      const percent = (value * 100) / balance
                      setAmount(value)
                      setPercent(percent)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <p className="text-primary-50 mb-3">Vest Tokens</p>
              <Radio.Group
                defaultValue={"no"}
                onChange={(e) => setVestToken(e.target.value)}
              >
                <Radio value={"yes"}>Yes</Radio>
                <Radio value={"no"}>No</Radio>
              </Radio.Group>
            </div>
            {vestToken === "no" ? (
              <div>
                <p className="text-custom-white/60">Unlock Date</p>
                <div className="from-primary-90/20 to-transparent bg-gradient-to-r  mt-3 text-custom-white/80 p-4 text-sm">
                  <p className="text-primary-20 ">{moment().format("LL LT")}</p>
                  <p className="my-2">2 hours ago - 0 block(s)</p>
                  <DatePicker className="bg-transparent border-primary-80/85 text-primary-30 w-[50%]" />
                </div>
              </div>
            ) : (
              <div className="from-primary-90/20 to-transparent bg-gradient-to-r  mt-3 text-custom-white/80 p-4 text-sm">
                <div>
                  <p>Enter Vesting Periods and Percentage</p>
                  <div className="mt-2">
                    <Input type="file" className="bg-transparent" />
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Import
                      </Button>
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Export
                      </Button>
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p>Enter Addresses and Amount Allocated</p>
                  <div className="mt-2">
                    <Input type="file" className="bg-transparent" />
                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Import
                      </Button>
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Export
                      </Button>
                      <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t-[1px] border-t-primary-80/35 py-4">
            <p className="text-primary-50 mb-3">Fee Option</p>
            <div className="grid grid-cols-2 gap-4 text-custom-white/60">
              <div>
                <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                  GoatSTX
                </Button>
                <p>Balance: {balance.toLocaleString()}</p>
              </div>
              <div>
                <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                  STX
                </Button>
                <p>Balance: {0}</p>
              </div>
            </div>
            <p className="mt-5 text-custom-white/60">
              Once tokens are locked they cannot be withdrawn under any
              circumstances until the timer has expired. Please ensure the
              parameters are correct, as they are final.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
