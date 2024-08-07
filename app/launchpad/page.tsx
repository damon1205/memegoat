import { Launchpad } from "@/components/launchpad/Launchpad"
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { instance } from "@/utils/api";
import React from "react"

const LaunchpadPage = async () => {
  // const fetchLaunches = async () => {
  //   try {
  //     const res = await instance().get("/campaign-requests");
  //     return res.data.data;
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     return null;
  //   }
  // };

  const targetDate = '2024-08-12T16:00:00Z'

  // const launches = await fetchLaunches();
  return (
    <div>
      {/* <Launchpad data={launches ?? []} /> */}
      <CountdownTimer targetDate={targetDate} />
    </div>
  )
}

export default LaunchpadPage
