"use client"
import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Swap } from "./Swap"
import { DexChart } from "./DexChart"
import { PendingTransactions } from "../shared/PendingTransactions"

export const Dex = () => {
  return (
    <>
      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5 }}
          className="relative  w-[60rem] h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="md:mt-[3rem] py-4"
      >
        <div className="flex items-end justify-end mb-2">
          <PendingTransactions />
        </div>
        <motion.div className="flex lg:flex-row flex-col-reverse justify-center gap-4">
          <DexChart />
          <Swap />
        </motion.div>
      </motion.div>
    </>
  )
}
