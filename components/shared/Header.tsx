"use client"
import React from "react"
import { Logo } from "./Logo"
import { routes } from "@/data/routes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "antd"
import { MdEmail } from "react-icons/md"
import { FaXTwitter, FaDiscord } from "react-icons/fa6"

export const Header = () => {
  const pathname = usePathname()
  return (
    <div
      className="fixed top-0 left-0 w-full border-b-[1px] border-b-silver/10 bg-custom-black/30 z-20"
      style={{ backdropFilter: "blur(22px)" }}
    >
      <div className="p-4 md:p-7 max-w-[95%] mx-auto ">
        <div className="flex items-center gap-3 justify-between">
          <div className="inline-flex gap-16 items-center">
            <Logo />
            <nav className="hidden xl:block">
              <ul className="inline-flex gap-7 items-center">
                {routes.map((route, index) => {
                  const active = route.path === pathname
                  const activeCls = active
                    ? "font-bold"
                    : "text-silver hover:text-custom-white"
                  return (
                    <li key={index}>
                      <Link
                        href={route.path}
                        className={`${activeCls} text-sm`}
                      >
                        {route.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          <div className="inline-flex gap-7 items-center">
            <div className="hidden md:inline-flex gap-4 items-center">
              <Link
                href={"mailto:contact@memegoat.io"}
                target="_black"
                className="text-silver text-[22px] hover:text-custom-white"
              >
                <MdEmail />
              </Link>
              <Link
                href={"https://twitter.com/GoatCoinSTX"}
                target="_black"
                className="text-silver text-[20px] hover:text-custom-white"
              >
                <FaXTwitter />
              </Link>
              <Link
                href={"https://discord.com/invite/zUyqNNny"}
                target="_black"
                className="text-silver text-[20px] hover:text-custom-white"
              >
                <FaDiscord />
              </Link>
            </div>
            <Button className="px-14 font-bold bg-transparent">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
