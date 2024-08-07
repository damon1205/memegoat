import { Locker } from "@/components/locker/Locker"
import { CountdownTimer } from "@/components/shared/CountdownTimer"
import React from "react"

const LockerPage = () => {
  const targetDate = "2024-08-12T16:00:00Z"
  return (
    <div>
      {/* <Locker /> */}
      <CountdownTimer targetDate={targetDate} />
    </div>
  )
}

export default LockerPage
