"use client"
import React, { useEffect, useState } from "react"
import { Avatar, Button } from "antd"
import { motion } from "framer-motion"
import { TransactionTable } from "./TransactionTable"
import { Attestation } from "./Attestation"
import Link from "next/link"
import { AllTransactions } from "../shared/AllTransactions"
import { alexSDK } from "@/utils/velar.data"
import { getActiveUsers } from "@/utils/db"

export const Dashboard = () => {
  const [tokenPrice, setTokenPrice] = useState<number | undefined>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await alexSDK.getLatestPrices()
      const tokenKey = 'token-ssl-memegoatstx-E0G14' as keyof typeof price;
      if (tokenKey in price) {
        setTokenPrice(price[tokenKey])
      }

      const activeUsers = await getActiveUsers();
      setActiveUsers(activeUsers + 323)
    }
    fetchPrice()
  }, [])

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
            <Avatar src="/images/STX.svg" size={30} />
            <Avatar src="/images/velar.jpg" size={30} />
            <Avatar src="/images/alex.svg" size={30} />
            <Avatar src="/images/leo.jpg" size={30} />
          </div>
        </div>
        <div className="mt-7">
          <div className="grid md:grid-cols-4 gap-7">
            <div className="bg-primary-100/10 border-[1px] border-primary-90 w-full px-5 py-5">
              <p className="text-sm">Number of Assets Supported</p>
              <p className="text-2xl font-semibold mt-3">84 Tokens</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">Funds Raised</p>
              <p className="text-2xl font-semibold mt-3">$ 135,000</p>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-100 w-full px-5 py-5">
              <p className="text-sm">
                <Avatar src="/logo.svg" size={30} />
                <span className="ml-2">MemeGoat Price</span>
              </p>
              <p className="text-2xl font-semibold mt-3">$ {tokenPrice ? tokenPrice.toFixed(10) : 0.00002}</p>
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
                  <Link href={"/dex"}>Swap</Link>
                </Button>
                <Button
                  type="link"
                  className="h-[30px]  underline font-medium text-primary-30 hover:text-primary-20"
                >
                  <Link
                    href={"/staking"}
                    className="text-primary-30 hover:text-primary-20"
                  >
                    Stake
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-primary-100/10 border-[1px] border-primary-90 w-full px-5 py-5">
              <p className="text-sm">No of Active Users</p>
              <p className="text-2xl font-semibold mt-3">{activeUsers}</p>
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
