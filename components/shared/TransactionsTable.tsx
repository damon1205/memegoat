"use client"
import React, { useEffect } from "react"
import {
  Avatar,
  Button,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd"
import type { TableProps } from "antd"
import moment from "moment"
import Link from "next/link"
import { BiCheckCircle, BiLinkExternal, BiSearch } from "react-icons/bi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BsDot } from "react-icons/bs"
import { IoIosSearch } from "react-icons/io"
import { getAddressLink, getExplorerLink, network } from "@/utils/stacks.data"
import { truncateAddress } from "@/utils/format"
import { TxType } from "@/interface"


const columns: TableProps<TxType>["columns"] = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => (
      <div className="text-sm">
        <p>{moment(text).format("LL")}</p>
        <p className="text-xs text-white/70">{moment(text).format("LT")}</p>
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render(value, record) {
      return (
        <div className="font-medium text-sm">
          {record.action}
        </div>
      )
    },
  },
  {
    title: "TxID",
    dataIndex: "txID",
    key: "txKD",
    render(value, record) {
      return (
        <Link
          href={getExplorerLink(network, record.txId)}
          className="font-medium flex items-center gap-2 hover:text-white"
        >
          <p className="underline">{truncateAddress(record.txId)}</p>
          <BiLinkExternal className="text-[20px]" />
        </Link>
      )
    },
  },
  {
    title: "TxSender",
    dataIndex: "from_status",
    key: "from_status",
    render(value, record) {
      return (
        <Link
          href={getAddressLink(network, record.txSender)}
          className="font-medium flex items-center gap-2 hover:text-white"
        >
          <p className="underline">{truncateAddress(record.txSender)}</p>
          <BiLinkExternal className="text-[20px]" />
        </Link>
      )
    },
  },
  {
    title: "TxStatus",
    dataIndex: "txStatus",
    key: "txStatus",
    render(value, record) {
      return (
        <div className="font-medium ">
          {record.txStatus === "Success" ? (
            <div className="text-primary-40 mb-3 flex gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.txStatus}</span>
            </div>
          ) : (
            <div className=" mb-3 flex text-yellow-400 gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.txStatus}</span>
            </div>
          )}
        </div>
      )
    },
  }
]

// const data: TxType[] = [
//   {
//     key: "1",
//     id: "1",
//     createdAt: new Date().toUTCString(),
//     txId: "0x4b190ef14a41e27cf49998186896d0f5106733a1401d0ea8c42eaedbabbaface",
//     txStatus: "pending",
//     txSender: "ST3XA7M6J0JV8XHXA31G3J8AMD0PSKRTN317XT50N",
//     action: "Mint Tokens",
//     amount: 0,
//     tag: "STAKING"
//   },
//   {
//     key: "2",
//     id: "2",
//     createdAt: new Date().toUTCString(),
//     txId: "0x4b190ef14a41e27cf49998186896d0f5106733a1401d0ea8c42eaedbabbaface",
//     txStatus: "pending",
//     txSender: "ST3XA7M6J0JV8XHXA31G3J8AMD0PSKRTN317XT50N",
//     action: "Mint Tokens",
//     amount: 0,
//     tag: 'LAUNCHPAD'
//   },
//   {
//     key: "3",
//     id: "3",
//     createdAt: new Date().toUTCString(),
//     txId: "0x4b190ef14a41e27cf49998186896d0f5106733a1401d0ea8c42eaedbabbaface",
//     txStatus: "pending",
//     txSender: "ST3XA7M6J0JV8XHXA31G3J8AMD0PSKRTN317XT50N",
//     action: "Mint Tokens",
//     amount: 0,
//     tag: 'MINTER'
//   },
//   {
//     key: "4",
//     id: "4",
//     createdAt: new Date().toUTCString(),
//     txId: "0x4b190ef14a41e27cf49998186896d0f5106733a1401d0ea8c42eaedbabbaface",
//     txStatus: "pending",
//     txSender: "ST3XA7M6J0JV8XHXA31G3J8AMD0PSKRTN317XT50N",
//     action: "Mint Tokens",
//     amount: 0,
//     tag: 'STAKING'
//   },
//   {
//     key: "5",
//     id: "5",
//     createdAt: new Date().toUTCString(),
//     txId: "0x4b190ef14a41e27cf49998186896d0f5106733a1401d0ea8c42eaedbabbaface",
//     txStatus: "confirmed",
//     txSender: "ST3XA7M6J0JV8XHXA31G3J8AMD0PSKRTN317XT50N",
//     action: "Mint Tokens",
//     amount: 0,
//     tag: 'DEXs'
//   },
// ]

export const TransactionTable = ({ data, dashboard }: { data: TxType[], dashboard?: boolean }) => {
  return (
    <div className="mt-5">
      {!dashboard && <div className="mb-4">
        <Input
          className="h-[44px] md:w-[360px] rounded-md bg-[#FFFFFF0D]"
          placeholder="Search address"
          size="large"
          prefix={<IoIosSearch size={20} color="#FFFFFF4D" />}
          allowClear
        />
      </div>}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          size: "small",
          responsive: true,
          position: ["bottomCenter"],
        }}
        // bordered
        scroll={{ x: 800 }}
      />
    </div>
  )
}
