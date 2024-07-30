"use client"
import React from "react"
import { MdOutlineRocketLaunch } from "react-icons/md"
import { LaunchpadCard } from "./LaunchpadCard"
import Image from "next/image"
import { motion } from "framer-motion"
import { CreateLaunchPad } from "./CreateLaunchPad"
import { LaunchpadI } from "@/interface"
export const Launchpad = async ({ data }: { data: LaunchpadI[] }) => {
  return (
    <>
      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5 }}
          className=" w-[60rem] h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="relative"
      >
        {/* <div className="fixed top-0 left-[50%] translate-x-[-50%] w-[430px] h-[340px] blur-[300px] bg-primary-20 hidden md:block"></div> */}

        <div className="rounded-sm from-primary-90/5 to-primary-60/20 md:p-6 p-4 border-[1px] border-primary-100 relative bg-gradient-to-r">
          <h3 className="text-lg md:text-2xl">Launchpad Projects</h3>
          <p className="text-custom-white/55 text-sm md:text-[16px] mt-1">
            Creating and investing in the best memecoins just became easier.
          </p>
          <CreateLaunchPad />

          <div className="absolute top-0 right-0 text-primary-10/15 text-[10rem]">
            <MdOutlineRocketLaunch />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 my-8">
          {data.map((launchpad, index) => {
            return <LaunchpadCard key={index} {...launchpad} />
          })}
        </div>
      </motion.div>
    </>
  )
}
