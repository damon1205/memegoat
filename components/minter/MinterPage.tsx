"use client";
import React from "react"
import { GiToken } from "react-icons/gi"
import { motion } from "framer-motion"
import { Minter } from "./Minter"
import Image from "next/image"

export const MinterPage = () => {
  return (
    <>
      <div className="fixed bottom-0 left-[50%] translate-x-[-50%] w-[430px] h-[340px] blur-[300px] bg-primary-20 hidden md:block" />

      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0] minter-foreground">
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
        className="relative"
      >
        <div className="rounded-sm from-primary-90/5 to-primary-60/20 md:p-6 p-4 border-[1px] border-primary-100 relative bg-gradient-to-r mb-5 overflow-hidden">
          <h3 className="text-lg md:text-2xl">Token Minter</h3>
          <p className="text-custom-white/55 text-sm md:text-[16px] mt-1">
            Creating and investing in the best memecoins just became easier.
          </p>

          <div className="absolute top-0 right-0 text-primary-10/15 text-[10rem]">
            <GiToken />
          </div>
        </div>
        <Minter minter={true} current={1} setCurrent={() => { }} />
      </motion.div>
    </>
  )
}
