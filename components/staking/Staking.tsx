"use client"
import React from "react"
import { Hero } from "./Hero"
import { StakingTabs } from "./StakingTabs"

const Staking = () => {
  return (
    <div className="relative z-[10] mb-7">
      <Hero />
      <StakingTabs />
    </div>
  )
}

export default Staking
