"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export const LockerRoutes = () => {
  const pathname = usePathname()
  const routes = [
    { name: "Locker", path: "/locker" },
    { name: "View Your Locks", path: "/locker/locks" },
    { name: "View All Locks", path: "/locker/lock" },
  ]
  return (
    <div className="grid grid-cols-3 border-[1px] border-primary-90 mb-7">
      {routes.map((route, index) => {
        const notLast = routes.length - 1 !== index
        const isLockerActive = pathname === "/locker/setup" && index === 0
        const isActive = pathname === route.path
        const activeCls =
          isLockerActive || isActive
            ? "from-primary-100/25 to-primary-100/40 bg-gradient-to-r text-primary-50"
            : ""
        return (
          <Link
            href={route.path}
            key={index}
            className={`${activeCls} ${notLast ? "border-r-[1px] border-primary-90" : ""
              } text-center p-3`}
          >
            {route.name}
          </Link>
        )
      })}
    </div>
  )
}
