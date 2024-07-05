"use client"
import { LockerRoutes } from "@/components/locker/LockerRoutes"
import Image from "next/image"
import React from "react"
import { motion } from "framer-motion"

const LockerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>
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
          className="relative md:mt-[3rem] max-w-[550px] mx-auto p-4"
        >
          <LockerRoutes />
          <div>{children}</div>
        </motion.div>
      </div>
    </>
  )
}

export default LockerLayout
