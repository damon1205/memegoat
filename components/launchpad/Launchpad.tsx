"use client"
import { Button } from "antd"
import React from "react"
import { MdOutlineRocketLaunch } from "react-icons/md"
import { LaunchpadCard, LaunchpadI } from "./LaunchpadCard"
import Image from "next/image"
import { motion } from "framer-motion"

const launchpads: LaunchpadI[] = [
  {
    name: "GoatSTX",
    icon: "/logo.svg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
  {
    name: "STX",
    icon: "/images/stx.svg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
  {
    name: "Ethos",
    icon: "/images/ethos.svg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
  {
    name: "Leo",
    icon: "/images/leo.jpg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
  {
    name: "Nothing",
    icon: "/images/nothing.jpg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
  {
    name: "Odin",
    icon: "/images/odin.jpg",
    target_raise: "150k",
    start_date: "JUl 2, 8:00pm UTC",
    end_date: "Sep 2, 8:00pm UTC",
    description:
      "Join GoatSTX's IDO and be a pioneer in Bitcoin DeFi innovation. Secure your whitelist spot with our Gleam campaign and take part in shaping the future of decentralized finance on Bitcoin. Don't miss out—get ready to make your mark with GoatSTX.",
  },
]

export const Launchpad = () => {
  return (
    <>
      <div className="fixed top-[10vh] right-0 md:right-[25vw] hidden xl:block z-[0]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative w-[170px] h-[170px] md:w-[60rem] md:h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>
      <div className="relative">
        {/* <div className="fixed top-0 left-[50%] translate-x-[-50%] w-[430px] h-[340px] blur-[300px] bg-primary-20 hidden md:block"></div> */}

        <div className="rounded-sm from-primary-90/5 to-primary-60/20 md:p-6 p-4 border-[1px] border-primary-100 relative bg-gradient-to-r">
          <h3 className="text-lg md:text-2xl">Launchpad Projects</h3>
          <p className="text-custom-white/55 text-sm md:text-[16px] mt-1">
            Creating and investing in the best memecoins just became easier.
          </p>
          <Button className="bg-primary-60 mt-4" type="primary">
            Create Launchpad
          </Button>

          <div className="absolute top-0 right-0 text-primary-10/15 text-[10rem]">
            <MdOutlineRocketLaunch />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 my-8">
          {launchpads.map((launchpad, index) => {
            return <LaunchpadCard key={index} {...launchpad} />
          })}
        </div>
      </div>
    </>
  )
}
