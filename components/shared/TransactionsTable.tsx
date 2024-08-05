"use client"
import React from "react"
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

interface DataType {
  key: string
  id: string
  date: string
  amount: number
  from: { icon: string; address: string; token: string }
  from_status: "pending" | "confirmed"
  to: { icon: string; address: string; token: string }
  to_status: "pending" | "confirmed"
  fee: number
}

const columns: TableProps<DataType>["columns"] = [
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
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render(value, record) {
      return (
        <div className="font-medium text-sm">
          {record.amount.toLocaleString()} {record.from.token}
        </div>
      )
    },
  },
  {
    title: "From",
    dataIndex: "from",
    key: "from",
    render(value, record) {
      return (
        <Link
          href={""}
          className="font-medium flex items-center gap-2 hover:text-white"
        >
          <Avatar src={record.from.icon} size={25} />
          <p className="underline">{record.from.address}</p>
          <BiLinkExternal className="text-[20px]" />
        </Link>
      )
    },
  },
  {
    title: "Status",
    dataIndex: "from_status",
    key: "from_status",
    render(value, record) {
      return (
        <div className="font-medium ">
          {record.from_status === "confirmed" ? (
            <div className="text-primary-40 mb-3 flex gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.from_status}</span>
            </div>
          ) : (
            <div className=" mb-3 flex text-yellow-400 gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.from_status}</span>
            </div>
          )}
        </div>
      )
    },
  },

  {
    title: "To",
    dataIndex: "to",
    key: "to",
    render(value, record) {
      return (
        <Link
          href={""}
          className="font-medium flex items-center gap-2 hover:text-white"
        >
          <Avatar src={record.to.icon} size={25} />
          <p className="underline">{record.to.address}</p>
          <BiLinkExternal className="text-[20px]" />
        </Link>
      )
    },
  },
  {
    title: "Status",
    dataIndex: "to_status",
    key: "to_status",
    render(value, record) {
      return (
        <div className="font-medium ">
          {record.to_status === "confirmed" ? (
            <div className="text-primary-40 mb-3 flex gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.to_status}</span>
            </div>
          ) : (
            <div className=" mb-3 flex text-yellow-400 gap-1 items-center capitalize">
              <BsDot size={30} />
              <span>{record.to_status}</span>
            </div>
          )}
        </div>
      )
    },
  },

  {
    title: "Fee",
    key: "fee",
    dataIndex: "fee",
    render(value, record) {
      return (
        <div className="font-medium">
          {record.fee.toLocaleString()} {record.from.token}
        </div>
      )
    },
  },
]

const data: DataType[] = [
  {
    key: "1",
    id: "1",
    date: new Date().toUTCString(),
    amount: 5000,
    from: {
      icon: "/images/bitcoinsvg.svg",
      address: "0xe6...aaAA",
      token: "BTC",
    },
    to: { icon: "/images/stx.svg", address: "0xe6...aaAA", token: "STX" },
    from_status: "pending",
    to_status: "pending",
    fee: 5,
  },
  {
    key: "2",
    id: "2",
    date: new Date().toUTCString(),
    amount: 19000,
    from: {
      icon: "/images/eth.svg",
      address: "0xe6...aaAA",
      token: "ETH",
    },
    to: { icon: "/images/usdt.svg", address: "0xe6...aaAA", token: "USDT" },
    from_status: "pending",
    to_status: "pending",
    fee: 105,
  },
  {
    key: "3",
    id: "3",
    date: new Date().toUTCString(),
    amount: 25000,
    from: {
      icon: "/images/xmr.svg",
      address: "0xe6...aaAA",
      token: "XMR",
    },
    to: { icon: "/images/ethos.svg", address: "0xe6...aaAA", token: "ETHOS" },
    from_status: "pending",
    to_status: "pending",
    fee: 295,
  },
  {
    key: "4",
    id: "4",
    date: new Date().toUTCString(),
    amount: 125000,
    from: {
      icon: "/images/stx.svg",
      address: "0xe6...aaAA",
      token: "STX",
    },
    to: { icon: "/images/eth.svg", address: "0xe6...aaAA", token: "ETH" },
    from_status: "pending",
    to_status: "pending",
    fee: 395,
  },
  {
    key: "5",
    id: "5",
    date: new Date().toUTCString(),
    amount: 19000,
    from: {
      icon: "/images/eth.svg",
      address: "0xe6...aaAA",
      token: "ETH",
    },
    to: { icon: "/images/usdt.svg", address: "0xe6...aaAA", token: "USDT" },
    from_status: "pending",
    to_status: "pending",
    fee: 105,
  },
]

export const TransactionTable: React.FC = () => {
  return (
    <div className="mt-5">
      <div className="mb-4">
        <Input
          className="h-[44px] md:w-[360px] rounded-md bg-[#FFFFFF0D]"
          placeholder="Search address"
          size="large"
          prefix={<IoIosSearch size={20} color="#FFFFFF4D" />}
          allowClear
        />
      </div>
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
