"use client"
import { Avatar } from "antd"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export const Logo = () => {
  return (
    <Link href={"/"} className="relative">
      <div className="absolute top-0 left-0 md:translate-x-[-20%] translate-x-[-20%] translate-y-[-45%]">
        <Avatar src="/logo.svg" size={70} />
      </div>
      {/* <div className="relative w-[70px] h-[70px]">
        <Image src={"/logo.svg"} fill alt="" className="w-full h-full" />
      </div> */}
    </Link>
  )
}
