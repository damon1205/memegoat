import { CountdownTimer } from "@/components/shared/CountdownTimer"
import Staking from "@/components/staking/Staking"
import React from "react"

const CommunityPoolsPage = () => {
  const targetDate = '2024-08-08T16:00:00Z'
  return (
    <div>
      {/* <Staking /> */}
      <CountdownTimer targetDate={targetDate} />
    </div>
  )
}

export default CommunityPoolsPage
