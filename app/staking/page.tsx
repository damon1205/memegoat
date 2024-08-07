import { CountdownTimer } from "@/components/shared/CountdownTimer"
import { MemeGoatStakingTab } from "@/components/staking/MemeGoatStakingTab"
import Staking from "@/components/staking/Staking"
import React from "react"

const StakingPage = () => {
  // Set a specific target date (e.g., August 15, 2024)
  const targetDate = "2024-08-12T12:04:00"
  return (
    <div>
      {/* <CountdownTimer targetDate={targetDate} /> */}
      <div className="flex items-center justify-center mt-10">
        <MemeGoatStakingTab />
      </div>
    </div>
  )
}

export default StakingPage
