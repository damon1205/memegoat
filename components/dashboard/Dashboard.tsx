"use client"
import React from "react"
import { Avatar, Button } from "antd"
import { motion } from "framer-motion"
import { TransactionTable } from "./TransactionTable"
import { Attestation } from "./Attestation"
import Link from "next/link"
import { AllTransactions } from "../shared/AllTransactions"

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
            className={`orbitron special-text md:text-4xl text-3xl font-medium text-custom-white`}
          >
            Dashboard
          </h3>
          <div className="inline-flex gap-2 items-center">
            <p className="">Supported Tokens</p>
            <Avatar src="/logo.svg" size={30} />
            <Avatar src="/images/stx.svg" size={30} />
            <Avatar src="/images/leo.jpg" size={30} />
            <Avatar src="/images/odin.jpg" size={30} />
          </div>
        </div>
        <div className="mt-7">
          <div className="grid md:grid-cols-4 gap-7">
            <div className="bg-primary-100/10 border-[1px] border-primary-90 w-full px-5 py-5">
              <p className="text-sm">Number of Assets Supported</p>
              <p className="text-2xl font-semibold mt-3">38 Tokens</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">Funds Raised</p>
              <p className="text-2xl font-semibold mt-3">$ 268,844,327.23</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">
                <Avatar src="/logo.svg" size={30} />
                <span className="ml-2">MemeGoat Price</span>
              </p>
              <p className="text-2xl font-semibold mt-3">$ 0.04662922</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">
                <Avatar src="/logo.svg" size={30} />
                <span className="ml-2">MemeGoat Ecosystem</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="primary"
                  className="h-[30px] text-white font-medium"
                >
                  <Link href={"/staking"}>Stake</Link>
                </Button>
                <Button
                  type="link"
                  className="h-[30px]  underline font-medium text-primary-30 hover:text-primary-20"
                >
                  <Link
                    href={"/dex"}
                    className="text-primary-30 hover:text-primary-20"
                  >
                    Swap
                  </Link>
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
        className="my-14"
      >
        <AllTransactions txRequest={{}} />
        {/* <TransactionTable /> */}
      </motion.div>
      {/* <div className="mt-14">
        <Attestation />
      </div> */}
    </div>
  )
}
