"use client"
import { LockerRoutes } from "@/components/locker/LockerRoutes"
import Image from "next/image"
import React from "react"
import { motion } from "framer-motion"
import { BsLockFill } from "react-icons/bs"
import { PendingTransactions } from "@/components/shared/PendingTransactions"

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
          className="relative md:mt-[3rem] max-w-[900px] mx-auto p-4"
        >
          <div className="flex items-center justify-end mb-2 gap-2">
            <PendingTransactions />
          </div>
          <LockerRoutes />
          <div className="rounded-sm from-primary-90/5 to-primary-60/20 md:p-6 p-4 border-[1px] border-primary-100 relative bg-gradient-to-r mb-10 overflow-hidden">
            <h3 className="text-lg md:text-2xl">Token Locker</h3>
            <p className="text-custom-white/55 text-sm md:text-[16px] mt-1 md:w-[70%]">
              Secure tokens, by locking them for a predetermined period to
              prevent premature selling and ensure project stability and trust.
            </p>

            <div className="absolute top-0 right-0 text-primary-10/15 text-[10rem] overflow-hidden">
              <BsLockFill />
            </div>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    </>
  )
}

export default LockerLayout
