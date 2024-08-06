"use client"
import React from "react"
import type { CollapseProps } from "antd"
import { Avatar, Collapse, Progress } from "antd"
import moment from "moment"

type lockT = {
  token_name: string
  token_img: string
  locked: number
  id: string
  address: string
  date: string
  progress: number
}

const locks: lockT[] = [
  {
    token_name: "GoatSTX",
    token_img: "/logo.svg",
    locked: 0,
    id: "#1",
    address: "#address",
    date: new Date().toISOString(),
    progress: 75,
  },
  {
    token_name: "STX",
    token_img: "/images/stx.svg",
    locked: 0,
    id: "#2",
    address: "#address",
    date: new Date().toISOString(),
    progress: 45,
  },
]

export const AllLocks = () => {
  const items: CollapseProps["items"] = locks.map((lock) => {
    return {
      key: lock.id,
      label: (
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar src={lock.token_img} size={40} />
            <p>{lock.token_name}</p>
          </div>
          <div>
            <p>Amount Locked</p>
            <p className="text-end">${lock.locked}</p>
          </div>
        </div>
      ),
      children: (
        <div className="space-y-1">
          <div className="grid grid-cols-[150px,auto]">
            <p>Lock Id:</p>
            <p>{lock.id}</p>
          </div>
          <div className="grid grid-cols-[150px,auto]">
            <p> Lock Address:</p>
            <p>{lock.address}</p>
          </div>
          <div className="grid grid-cols-[150px,auto]">
            <p> UnLock date:</p>
            <p>{moment(lock.date).format("LL")}</p>
          </div>
          <div className="grid grid-cols-[150px,auto]">
            <p> Lock Progress:</p>
            <div className="md:w-[300px]">
              <Progress percent={lock.progress} strokeColor="#29ab4a" />
            </div>
          </div>
        </div>
      ),
    }
  })
  return (
    <div>
      <Collapse
        items={items}
        defaultActiveKey={["1"]}
        expandIconPosition="right"
      />
    </div>
  )
}
