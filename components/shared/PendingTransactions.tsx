"use client"
import { Avatar, Tooltip } from "antd"
import React from "react"
import { MdOutlinePendingActions } from "react-icons/md"

export const PendingTransactions = () => {
  return (
    <div>
      <Tooltip title="Pending transactions" arrow={false}>
        <Avatar className="bg-[#FFFFFF14] rounded-md cursor-pointer">
          <MdOutlinePendingActions size={20} color="#1AC057" />
        </Avatar>
      </Tooltip>
    </div>
  )
}
