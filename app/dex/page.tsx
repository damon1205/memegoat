import { Dex } from "@/components/dex/Dex"
import { CountdownTimer } from "@/components/shared/CountdownTimer"
import React from "react"

const DexPage = () => {
  // const targetDate = '2024-08-12T16:00:00Z'
  return (
    <div>
      <Dex />
      {/* <CountdownTimer targetDate={targetDate} /> */}
    </div>
  )
}

export default DexPage
