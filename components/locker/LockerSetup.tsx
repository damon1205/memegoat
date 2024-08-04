"use client"
import { Avatar, Button, DatePicker, GetProps, Input, Radio, Select } from "antd"
import dayjs from "dayjs"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { BsLockFill } from "react-icons/bs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useConnect } from "@stacks/connect-react"
import { contractAddress, fetchSTXBalance, getUserTokenBalance } from "@/utils/stacks.data"
import { getTokenMetadata } from "@/lib/features/pairs/tokenSlice"
import { useAppSelector } from "@/lib/hooks"
import { formatBal, formatNumber } from "@/utils/format"

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().endOf('day');
};


export const LockerSetup = () => {
  const { doContractCall } = useConnect();
  const [amount, setAmount] = useState(0)
  const [percent, setPercent] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [memegoatBalance, setMemegoatBalance] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [noOfBlocks, setNoOfBlocks] = useState<number>(0);
  const defaultPercent = [25, 50, 75, 100]
  const amountRef = useRef(null) as any
  const [vestToken, setVestToken] = useState<"yes" | "no">("no");
  const tokenMetadata = useAppSelector(getTokenMetadata);

  useEffect(() => {
    const fetchData = async () => {
      const stxBalance = await fetchSTXBalance()
      setStxBalance(stxBalance);

      const memegoatBalance = await getUserTokenBalance(`${contractAddress}.memegoatstx`);
      setMemegoatBalance(memegoatBalance);

      if (tokenMetadata) {
        console.log(tokenMetadata)
        const balance = await getUserTokenBalance(tokenMetadata.tokenAddress)
        console.log(balance)
        setBalance(balance)
      }
    }

    fetchData()
  }, [tokenMetadata])

  const handleDateChange = (dateStr: string) => {
    const date = new Date(dateStr)
    setDate(date);
    getDifferenceInBlocks(dateStr);
  };

  const getDifferenceInBlocks = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = Date.now();
    const diff = date.getTime() - now;
    if (now > date.getTime()) {
      return 0;
    }
    const diffInSecs = diff / 1000;
    const diffInBlocks = diffInSecs / 600;
    setNoOfBlocks(Number(diffInBlocks.toFixed(0)));
    return diffInBlocks.toFixed(0)
  };

  const convertTime = (dateObj: Date) => {
    return moment(dateObj).format("LLLL");
  };

  const getDuration = (date: Date) => {
    return moment(date).fromNow(false);
  };

  return (
    <>
      {tokenMetadata &&
        <div className="mb-7">
          <div className="p-4 text-center from-primary-50/15 to-primary-70/20 bg-gradient-to-r text-primary-50 relative overflow-hidden mb-5">
            <span>Token Locker</span>

            <div className="absolute top-0 right-0 text-primary-10/5 text-[5.5rem]">
              <BsLockFill />
            </div>
          </div>

          <div className="bg-[rgba(72,145,90,0.05)] border-0 border-[rgba(16,69,29,0.85)] p-4 md:p-6 backdrop-blur-[12px] text-sm">
            <div className="flex gap-3 items-center mb-5">
              <Avatar src={tokenMetadata.image_uri} size={50} />
              <div>
                <h3>{tokenMetadata.name}</h3>
                <p className="mb-1 text-sm text-custom-white/60">
                  Balance:{" "}
                  <span className="text-primary-30">
                    {balance.toLocaleString()} {tokenMetadata.symbol}
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
                      <p className="text-primary-20 ">{convertTime(date)}</p>
                      <p className="my-2">{getDuration(date)} - {noOfBlocks}&nbsp;block(s))</p>
                      <DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                        className="bg-transparent border-primary-80/85 text-primary-30 w-[50%]"
                        onChange={(_value, dateString) => {
                          handleDateChange(dateString as string)
                        }}
                      />
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
                    <p>Balance: {formatNumber(Number(formatBal(memegoatBalance).toFixed(2)))}</p>
                  </div>
                  <div>
                    <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                      STX
                    </Button>
                    <p>Balance: {formatBal(stxBalance)}</p>
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
      }
    </>

  )
}
