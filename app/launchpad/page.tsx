import { Launchpad } from "@/components/launchpad/Launchpad"
import { instance } from "@/utils/api";
import React from "react"

const LaunchpadPage = async () => {
  const fetchLaunches = async () => {
    try {
      const res = await instance().get("/campaign-requests");
      return res.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  };

  const launches = await fetchLaunches();
  return (
    <div>
      <Launchpad data={launches ?? []} />
    </div>
  )
}

export default LaunchpadPage
