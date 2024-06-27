"use client"
import React from "react"
import { Avatar, Button } from "antd"
import { Orbitron } from "next/font/google"
import { motion } from "framer-motion"
import { TransactionTable } from "./TransactionTable"

export const Dashboard = () => {
  return (
    <div>
      <motion.div
        initial={{ y: -500 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3
            className={`orbitron special-text md:text-4xl font-medium text-custom-white`}
          >
            Dashboard
          </h3>
          <div className="inline-flex gap-2 items-center">
            <p className="">Supported Tokens</p>
            <Avatar src="/images/bitcoinsvg.svg" size={30} />
            <Avatar src="/images/stx.svg" size={30} />
            <Avatar src="/images/eth.svg" size={30} />
            <Avatar src="/images/usdt.svg" size={30} />
            <Avatar src="/images/ethos.svg" size={30} />
            <Avatar src="/images/xmr.svg" size={30} />
          </div>
        </div>
        <div className="mt-7">
          <div className="grid md:grid-cols-4 gap-7">
            <div className="bg-primary-100/10 border-[1px] border-primary-90 w-full px-5 py-5">
              <p className="text-sm">Number of Assets Supported</p>
              <p className="text-2xl font-semibold mt-3">38 Tokens</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">MemeGoat Total Volume</p>
              <p className="text-2xl font-semibold mt-3">$ 268,844,327.23</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">
                <Avatar src="/images/stx.svg" size={25} />
                <span className="ml-2">MemeGoat Price</span>
              </p>
              <p className="text-2xl font-semibold mt-3">$ 0.04662922</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">
                <Avatar src="/images/stx.svg" size={25} />
                <span className="ml-2">MemeGoat Ecosystem</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="primary"
                  className="h-[30px] text-primary-100 font-medium"
                >
                  Stake
                </Button>
                <Button
                  type="link"
                  className="h-[30px] text-primary-30 hover:text-primary-20 underline font-medium"
                >
                  Swap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="mt-14"
      >
        <TransactionTable />
      </motion.div>
    </div>
  )
}
