"use client"
import React from "react"
import { motion } from "framer-motion"

export const PageLoader = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-[100000] bg-black">
      <div className="fixed top-0 left-[50%] translate-x-[-50%] w-[70%] h-[30vh] blur-[420px] bg-primary-40/80 z-[100000]" />
      <div className="w-full h-full flex items-center justify-center">
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.2 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            // type: "spring",
            // stiffness: 5,
            // damping: 30,
          }}
          src="/images/loading.svg"
          alt=""
          className="w-[150px] h-[150px]"
        />
      </div>
    </div>
  )
}
