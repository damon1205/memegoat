import { Dex } from "@/components/dex/Dex"
import { CountdownTimer } from "@/components/shared/CountdownTimer"
import React from "react"

const DexPage = () => {
  const targetDate = "2024-08-11T12:04:00"
  return (
    <div>
      {/* <Dex /> */}
      <CountdownTimer targetDate={targetDate} />
    </div>
  )
}

export default DexPage
