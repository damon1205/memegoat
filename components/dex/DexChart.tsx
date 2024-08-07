"use client"
import { Avatar } from "antd"
import React, { useState } from "react"
import { LuArrowLeftRight } from "react-icons/lu"

type periodT = "15m" | "1H" | "4H" | "1D" | "1W"

export const DexChart = () => {
  const periods: periodT[] = ["15m", "1H", "4H", "1D", "1W"]
  const [activePeriod, setActivePeriod] = useState<periodT>("1D")
  return (
    <div className="md:w-[670px] md:h-[460px] mx-auto bg-[#1D4B254D] p-4 rounded-lg border-[1px] border-primary-100 relative z-[200]">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          <Avatar.Group>
            <Avatar src="/images/stx.svg" className="border-none" size={35} />
            <Avatar src="/logo.svg" className="border-none" size={35} />
          </Avatar.Group>
          <div className="inline-flex items-center gap-2">
            <p className="font-bold">GoatSTX</p>
            <LuArrowLeftRight className="text-primary-50" />
            <p className="font-bold">STX</p>
          </div>
        </div>
        <div className="flex gap-2">
          {periods.map((period, index) => {
            const active = period === activePeriod
            return (
              <p
                key={index}
                className={`py-1 px-3 cursor-pointer text-sm rounded-md ${active ? "bg-[#0FFF674D] border-[1px] border-[#0FFF6714]" : ""}`}
                onClick={() => setActivePeriod(period)}
              >
                {period}
              </p>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[85%] rounded-md mt-4 bg-gradient-to-r from-[#00FF1A1A] to-[#16B75108] border-[1px] border-[#00FF1A1C] p-4">
        <div className="flex items-center justify-center h-full">
          <p>No Chart!</p>
        </div>
      </div>
    </div>
  )
}
