"use client"
import { Avatar, Button } from "antd"
import Image from "next/image"
import React from "react"
import { motion } from "framer-motion"

export const Hero = () => {
  return (
    <>
      <div className="fixed top-0 left-[50%] translate-x-[-50%] w-[430px] h-[340px] blur-[300px] bg-primary-20 hidden md:block"></div>

      <div className="fixed top-[10vh] right-0 md:right-[-30rem] hidden xl:block -z-[20]">
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative w-[170px] h-[170px] md:w-[60rem] md:h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>
      <motion.div
        initial={{ y: 100, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center md:h-[70vh] relative z-[10]"
      >
        <div className="p-2 px-5 uppercase text-xs border-[1px] border-primary-10/20 rounded-full mb-5">
          <p>staking pool</p>
        </div>
        <div className="">
          <h3 className="md:text-8xl hidden md:block font-medium text-center neonText special-text">
            Stake with GoatSTX
          </h3>
          <h3 className="md:hidden block text-4xl">Stake with GoatSTX</h3>
        </div>
        <div className="text-center md:mt-10 mt-5">
          <span className="text-primary-20">Stake</span> GoatSTX to earn tokens.
        </div>
        <p className="text-center">
          <span className="text-primary-20">Create</span> staking pool for your
          community. <span className="text-primary-20">Earn</span> rewards from
          your favourite community.
        </p>
        <div>
          <Button className="bg-transparent md:px-10 mt-7">
            Create Staking Pool
          </Button>
        </div>
      </motion.div>
    </>
  )
}
