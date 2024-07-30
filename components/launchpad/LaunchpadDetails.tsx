"use client"
import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Avatar, Button, Divider, Tag } from "antd"
import { BsClock } from "react-icons/bs"
import moment from "moment"
import { BiCopy } from "react-icons/bi"
import { LaunchpadI } from "@/interface"
import { useRouter } from "next/router"

export const LaunchpadDetails = ({ data }: { data: LaunchpadI | null }) => {
  const router = useRouter()
  if (!data) {
    router.push("/launchpad");
  }
  return (
    <>
      {data &&
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
            className="relative"
          >
            <div className="p-4 md:h-[15rem] h-[10rem] from-primary-80/5 to-primary-80/20 bg-gradient-to-r relative overflow-hidden flex items-center justify-center flex-col lp-card-top">
              <div className="absolute top-[-1rem] right-5 h-[6rem] w-[2rem] bg-primary-30 rotate-[60deg] blur-[32px]" />
              <p className="relative text-custom-white/70 text-center backdrop-blur-[22px] p-1 rounded-sm md:text-3xl text-xl neonText">
                Secure layer for memes on Bitcoin
              </p>
            </div>
            <div className="p-4 bg-custom-black/60 md:w-[90%] md:mx-auto">
              <div className="flex justify-between items-center md:-mt-[5rem] -mt-[3.5rem]">
                <Avatar
                  src={data.token_image}
                  className="rounded-lg bg-primary-90/20 border-2 border-custom-black/30 p-1 md:h-[8rem] md:w-[8rem] h-[5rem] w-[5rem]"
                />
                <Tag
                  icon={<BsClock />}
                  className="mdin-w-[4rem] flex items-center gap-2 bg-primary-80"
                >
                  Closed
                </Tag>
              </div>
              <div className="md:grid md:grid-cols-3 gap-10 mt-10 space-y-10 md:space-y-0">
                <div className="col-span-2">
                  <h3 className="text-xl">{data.token_name}</h3>
                  <p className="text-silver mb-7">
                    Secure layer of meme on Bitcoin
                  </p>
                  <p className="text-[14px]">
                    Join GoatSTX&apos;s IDO and be a pioneer in Bitcoin DeFi
                    innovation. Secure your whitelist spot with our Gleam campaign
                    and take part in shaping the future of decentralized finance on
                    Bitcoin. Don&apos;t miss out—get ready to make your mark with
                    GoatSTX.
                  </p>
                  <div className="mt-7">
                    <p className="border-b-[1px] border-primary-100/80 pb-2">
                      Token Details
                    </p>
                    <div className="space-y-3 mt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Token Name
                          </p>
                          <p className="text-sm">GoatMemeSTX</p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 text-end">
                            Contract Address
                          </p>
                          <p className="text-sm">
                            <span>shgygyegueghiietsefj...</span>
                            <BiCopy className="inline ml-5 cursor-pointer" />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Hard Cap
                          </p>
                          <p className="text-sm">44,000 GoatSTX</p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 text-end">
                            Soft Cap
                          </p>
                          <p className="text-sm">30,000 GoatSTX</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Total Supply
                          </p>
                          <p className="text-sm">60,144,000 GoatSTX</p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 text-end">
                            Token Decimal
                          </p>
                          <p className="text-sm text-end">6</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60">
                            Target Raise
                          </p>
                          <p className="text-sm">{"55,000,000 GoatSTX"}</p>
                        </div>
                        <div>
                          <p className="text-xs mt-2 text-custom-white/60 text-end">
                            Starts In
                          </p>
                          <p className="text-sm">{moment().format("LL LT")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-primary-60/5 backdrop-blur-[5px] text-sm w-full">
                  <div className="p-4 text-silver border-b-[1px] border-primary-20/20 mb-5">
                    <p>
                      <BsClock className="inline mr-1" /> Total Raised Completed
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-center text-silver mb-2">Total Raised</p>
                    <h3 className="text-xl text-center text-primary-40">
                      $15,000 /
                      <span className="text-[16px] text-silver"> $15,000</span>
                    </h3>
                    <div className="mt-7 space-y-3">
                      <div className="flex items-center gap-5 justify-between">
                        <p>Your Balance</p>
                        <p className="text-primary-40">5,000 GoatSTX</p>
                      </div>
                      <div className="flex items-center gap-5 justify-between">
                        <p>Your Contribution</p>
                        <p className="text-primary-40">3,000 GoatSTX</p>
                      </div>
                      <div className="flex items-center gap-5 justify-between">
                        <p>Final Allocation</p>
                        <p className="text-primary-40">15,000 GoatSTX</p>
                      </div>
                    </div>
                    <Button className="w-full mt-5" type="primary">
                      Claim Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      }
    </>
  )
}
