"use client"
import { Avatar, Tag } from "antd"
import Link from "next/link"
import React from "react"
import { BsClock } from "react-icons/bs"

export interface LaunchpadI {
  icon: string
  name: string
  description: string
  target_raise: string
  start_date: string
  end_date: string
  id: string
}

export const LaunchpadCard = ({ ...props }: LaunchpadI) => {
  return (
    <Link href={`/launchpad/${props.id}`}>
      <div className="border-[1px] border-primary-100/50 relative [&>div]:hover:to-primary-80/50 transition-all">
        <div className="p-4 h-[8rem] from-primary-80/5 to-primary-80/20 bg-gradient-to-r relative overflow-hidden flex items-center justify-center flex-col lp-card-top">
          <div className="absolute top-[-1rem] right-5 h-[6rem] w-[2rem] bg-primary-30 rotate-[60deg] blur-[32px]" />
          <p className="relative text-custom-white/70 text-sm text-center backdrop-blur-[22px] p-1 rounded-sm">
            Secure layer of meme on Bitcoin
          </p>
        </div>
        <div className="p-4 bg-custom-black/60">
          <div className="flex justify-between items-center -mt-11">
            <Avatar
              src={props.icon}
              size={50}
              className="rounded-lg bg-primary-90/20 border-2 border-custom-black/30 p-1"
            />
            <Tag
              icon={<BsClock />}
              className="mdin-w-[4rem] flex items-center gap-2 bg-primary-80"
            >
              Closed
            </Tag>
          </div>
          <div className="mt-5">
            <h3 className="text-sm">{props.name}</h3>
            <p className="text-xs mt-2 text-custom-white/60">
              {props.description}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-xs mt-2 text-custom-white/60">Target raise</p>
              <p className="text-sm">{props.target_raise}</p>
            </div>
            <div>
              <p className="text-xs mt-2 text-custom-white/60">Starts In</p>
              <p className="text-sm">{props.start_date}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
