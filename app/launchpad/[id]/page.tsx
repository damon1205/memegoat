import { LaunchpadDetails } from "@/components/launchpad/LaunchpadDetails"
import React from "react"
import { instance } from "@/utils/api";
import { LaunchpadI } from "@/interface";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await instance().get("/campaign-requests");
  const infos: LaunchpadI[] = res.data.data;

  return infos.map((info) => ({
    slug: info.token_address,
  }))
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LaunchpadPage({ params }: PageProps) {
  const { id } = params
  const getLaunchpadData = async () => {
    try {
      const response = await instance().get(`/campaign-requests/${id}`);
      return response.data.data
    } catch (error) {
      console.log(error);
    }
  };
  const launchpadData = await getLaunchpadData()
  return (
    <div>
      <LaunchpadDetails data={launchpadData} />
    </div>
  )
}

