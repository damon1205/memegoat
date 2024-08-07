import { Dashboard } from "@/components/dashboard/Dashboard"
import { CountdownTimer } from "@/components/shared/CountdownTimer"
import Image from "next/image"

export default function Home() {
  // <CountdownTimer targetDate={targetDate} />
  const targetDate = '2024-08-12T16:00:00Z'
  return (
    <main>
      <CountdownTimer targetDate={targetDate} />
      {/* <Dashboard /> */}
    </main>
  )
}
