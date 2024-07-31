import React from "react"
import { Hero } from "./Hero"
import { StakingTabs } from "./StakingTabs"
import { getStakeNonce, getStakes } from "@/lib/contracts/staking"

const Staking = async () => {
  const stakeIndex = await getStakeNonce();
  const stakes = await getStakes(stakeIndex)
  return (
    <div className="relative z-[10] mb-7">
      <Hero />
      <StakingTabs stakes={stakes || []} />
    </div>
  )
}

export default Staking
