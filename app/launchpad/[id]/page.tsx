import { headers } from "next/headers";
import { LaunchpadDetails } from "@/components/launchpad/LaunchpadDetails"
import React from "react"
import { instance } from "@/utils/api";
export const runtime = 'edge';
export const dynamicParams = false
const LaunchpadPage = async () => {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  //@ts-ignore
  const launchpadId = pathname.split('/').pop();
  const getLaunchpadData = async () => {
    if (!launchpadId) return;
    try {
      const response = await instance().get(`/campaign-requests/${launchpadId}`);
      return response.data.data
    } catch (error) {
      console.log(error);
    }
  };
  const launchpadData = await getLaunchpadData()
  return (
    <div>
      <LaunchpadDetails data={launchpadData ?? null} />
    </div>
  )
}

export default LaunchpadPage
