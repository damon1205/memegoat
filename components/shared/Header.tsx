"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Logo } from "./Logo"
import { routes } from "@/data/routes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, Drawer } from "antd"
import { MdEmail } from "react-icons/md"
import { FaXTwitter, FaDiscord } from "react-icons/fa6"
import { GiHamburgerMenu } from "react-icons/gi"
import { IoCloseCircleOutline } from "react-icons/io5"
import { appDetails, userSession } from "@/utils/stacks.data"
import { showConnect } from "@stacks/connect"

export const Header = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => setOpen(!open)

  const onConnectWallet = useCallback(() => {
    showConnect({
      appDetails,
      onFinish: () => {
        window.location.reload()
      },
      userSession,
    })
  }, [])

  function disconnectWallet() {
    userSession.signUserOut("/")
  }

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsSignedIn(true)
    }
    setHasCheckedSession(true)
  }, [])

  if (!hasCheckedSession) {
    return null // or a loading spinner, etc.
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        placement="left"
        styles={{
          mask: { backdropFilter: "blur(22px)" },
          content: {
            background: "rgba(16,69,29,0.1)",
            border: "1px solid rgba(16,69,29,0.85)",
          },
          header: { background: "transparent" },
        }}
        closeIcon={
          <IoCloseCircleOutline className="text-2xl text-primary-50" />
        }
      >
        <div className="mt-10 relative">
          <Logo />
          <div className="pt-14">
            <nav className="">
              <ul className="flex flex-col gap-1">
                {routes.map((route, index) => {
                  const active = route.path === pathname
                  const gamesNav = route.path === "/games"
                  const isLockerPage =
                    pathname.includes("locker") && index === 3
                  const activeCls =
                    active || isLockerPage
                      ? "font-bold border-[1px] border-primary-100/85 from-primary-90/25 to-transparent bg-gradient-to-r"
                      : "text-silver hover:text-custom-white"
                  return (
                    <li key={index}>
                      {!gamesNav ? (
                        <Link
                          href={route.path}
                          className={`${activeCls} text-sm block p-4 hover:text-white`}
                          onClick={toggleDrawer}
                        >
                          {route.name}
                        </Link>
                      ) : (
                        <Link
                          href={"https://games.memegoat.io/"}
                          className={`${activeCls} text-sm block p-4 hover:text-white`}
                          target="_blank"
                        >
                          {route.name}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="flex gap-4 items-center mt-10">
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
          </div>
        </div>
      </Drawer>
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
                    const gamesNav = route.path === "/games"
                    const isLockerPage =
                      pathname.includes("locker") && index === 4
                    const activeCls =
                      active || isLockerPage
                        ? "font-bold"
                        : "text-silver hover:text-custom-white"
                    return (
                      <li key={index}>
                        {!gamesNav ? (
                          <Link
                            href={route.path}
                            className={`${activeCls} text-sm block p-4 px-0 hover:text-white`}
                          >
                            {route.name}
                          </Link>
                        ) : (
                          <Link
                            href={"https://games.memegoat.io/"}
                            className={`${activeCls} text-sm block p-4 hover:text-white`}
                            target="_blank"
                          >
                            {route.name}
                          </Link>
                        )}
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
              {isSignedIn ? (
                <Button
                  onClick={() => disconnectWallet()}
                  className="px-14 font-bold bg-transparent border-primary-90 md:text-primary-50"
                >
                  Disconnect Wallet
                </Button>
              ) : (
                <Button
                  onClick={() => onConnectWallet()}
                  className="px-14 font-bold bg-transparent border-primary-90 md:text-primary-50"
                >
                  Connect Wallet
                </Button>
              )}
              <div className="xl:hidden border-[1px] border-primary-90 text-primary-50 p-2">
                <GiHamburgerMenu
                  className="cursor-pointer"
                  onClick={toggleDrawer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
