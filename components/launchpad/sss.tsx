import { headers } from "next/headers";
import { LaunchpadDetails } from "@/components/launchpad/LaunchpadDetails"
import React from "react"
import { instance } from "@/utils/api";
import { getQueryClient } from "@/lib/launchpad/get-queryClient";
import { launchpadOptions } from "@/lib/launchpad";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";;
// export const runtime = 'edge';
const LaunchpadPage = async () => {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  //@ts-ignore
  const launchpadId = pathname.split('/').pop();
  console.log(launchpadId);

  // const getLaunchpadData = async () => {
  //   if (!launchpadId) return;
  //   try {
  //     const response = await instance().get(`/campaign-requests/${launchpadId}`);
  //     return response.data.data
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const launchpadData = await getLaunchpadData()
  const launchpadINfO = launchpadOptions(launchpadId ? launchpadId : '');
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(launchpadINfO)
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* <LaunchpadDetails id={launchpadId} /> */}
      </HydrationBoundary>
    </div>
  )
}

export default LaunchpadPage
