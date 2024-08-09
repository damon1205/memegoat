"use client"
import { LaunchpadI } from "@/interface"
import { checkDate } from "@/lib/contracts/launchpad"
import { formatDate } from "@/utils/format"
import { Avatar, Tag } from "antd"
import Link from "next/link"
import React from "react"
import { BsClock } from "react-icons/bs"

export const LaunchpadCard = ({ ...props }: LaunchpadI) => {
  return (
    <Link href={`/launchpad/${props.token_address}`}>
      <div className="border-[1px] border-primary-100/50 relative [&>div]:hover:to-primary-80/50 transition-all">
        <div className="p-4 h-[8rem] from-primary-80/5 to-primary-80/20 bg-gradient-to-r relative overflow-hidden flex items-center justify-center flex-col lp-card-top">
          <div className="absolute top-[-1rem] right-5 h-[6rem] w-[2rem] bg-primary-30 rotate-[60deg] blur-[32px]" />
          <p className="relative text-custom-white/70 text-sm text-center backdrop-blur-[22px] p-1 rounded-sm">
            Secure layer for memes on Bitcoin
          </p>
        </div>
        <div className="p-4 bg-custom-black/60">
          <div className="flex justify-between items-center -mt-11">
            <Avatar
              src={props.token_image}
              size={50}
              className="rounded-lg bg-primary-90/20 border-2 border-custom-black/30 p-1"
            />
            <Tag
              icon={<BsClock />}
              className="mdin-w-[4rem] flex items-center gap-2 bg-primary-80"
            >
              {checkDate(props.start_date)
                ? checkDate(props.end_date)
                  ? "Ended"
                  : "Started"
                : "Upcoming"}
            </Tag>
          </div>
          <div className="mt-5 h-[100px]">
            <h3 className="text-sm">{props.token_name}</h3>
            <p className="text-xs mt-2 text-custom-white/60">
              {props.token_desc}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div>
              <p className="text-xs mt-2 text-custom-white/60">Target raise</p>
              <p className="md:text-sm text-xs">
                {props.token_name === "MoonMunchBTC"
                  ? "TBA"
                  : `${props.hard_cap} STX`}
              </p>
            </div>
            {checkDate(props.start_date) ? (
              checkDate(props.end_date) ? (
                <div>
                  <p className="text-xs mt-2 text-custom-white/60">Ended In</p>
                  <p className="md:text-sm text-xs">
                    {props.token_name === "MoonMunchBTC"
                      ? "TBA"
                      : formatDate(props.end_date)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs mt-2 text-custom-white/60">Ends In</p>
                  <p className="md:text-sm text-xs">
                    {props.token_name === "MoonMunchBTC"
                      ? "TBA"
                      : formatDate(props.end_date)}
                  </p>
                </div>
              )
            ) : (
              <div>
                <p className="text-xs mt-2 text-custom-white/60">Starts In</p>
                <p className="md:text-sm text-xs">
                  {props.token_name === "MoonMunchBTC"
                    ? "TBA"
                    : formatDate(props.end_date)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
