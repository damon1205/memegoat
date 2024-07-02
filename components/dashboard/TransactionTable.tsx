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

interface DataType {
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
      <div className="orbitron">
        <p>{moment(text).format("LL")}</p>
        <p>{moment(text).format("LT")}</p>
      </div>
    ),
  },
  {
    title: "(Asset)Amount",
    dataIndex: "amount",
    key: "amount",
    render(value, record) {
      return (
        <div className="font-medium">
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
            <div className="text-primary-40 mb-3 flex gap-2 items-center capitalize">
              <BiCheckCircle className="text-2xl" />
              <span>{record.from_status}</span>
            </div>
          ) : (
            <div className=" mb-3 flex gap-2 items-center capitalize">
              <AiOutlineLoading3Quarters className="text-lg" />
              <span>{record.from_status}</span>
            </div>
          )}
          <div className="orbitron text-silver text-xs">
            <p>{moment(record.date).format("LL")}</p>
            <p>{moment(record.date).format("LT")}</p>
          </div>
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
            <div className="text-primary-40 mb-3 flex gap-2 items-center capitalize">
              <BiCheckCircle className="text-2xl" />
              <span>{record.to_status}</span>
            </div>
          ) : (
            <div className=" mb-3 flex gap-2 items-center capitalize">
              <AiOutlineLoading3Quarters className="text-lg" />
              <span>{record.to_status}</span>
            </div>
          )}
          <div className="orbitron text-silver text-xs">
            <p>{moment(record.date).format("LL")}</p>
            <p>{moment(record.date).format("LT")}</p>
          </div>
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
    id: "1",
    date: new Date().toUTCString(),
    amount: 5000,
    from: {
      icon: "/images/bitcoinsvg.svg",
      address: "0xe6...aaAA",
      token: "BTC",
    },
    to: { icon: "/images/stx.svg", address: "0xe6...aaAA", token: "STX" },
    from_status: "confirmed",
    to_status: "pending",
    fee: 5,
  },
  {
    id: "2",
    date: new Date().toUTCString(),
    amount: 19000,
    from: {
      icon: "/images/eth.svg",
      address: "0xe6...aaAA",
      token: "ETH",
    },
    to: { icon: "/images/usdt.svg", address: "0xe6...aaAA", token: "USDT" },
    from_status: "confirmed",
    to_status: "confirmed",
    fee: 105,
  },
  {
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
    id: "5",
    date: new Date().toUTCString(),
    amount: 19000,
    from: {
      icon: "/images/eth.svg",
      address: "0xe6...aaAA",
      token: "ETH",
    },
    to: { icon: "/images/usdt.svg", address: "0xe6...aaAA", token: "USDT" },
    from_status: "confirmed",
    to_status: "confirmed",
    fee: 105,
  },
]

const assetsOptions = [
  {
    value: "all",
    label: "All Assets",
  },
  { value: "BTC", label: "/images/bitcoinsvg.svg" },
  { value: "ETH", label: "/images/eth.svg" },
  { value: "STX", label: "/images/stx.svg" },
  { value: "XMR", label: "/images/xmr.svg" },
  { value: "ETHOS", label: "/images/ethos.svg" },
]

export const TransactionTable: React.FC = () => {
  return (
    <div>
      <h3
        className={`orbitron special-text md:text-4xl text-xl font-medium text-custom-white mb-5`}
      >
        Transaction History
      </h3>
      <div className="mb-4 grid md:grid-cols-4 gap-7">
        <div className="col-span-3 flex">
          <Input
            placeholder="Search by Address"
            className="text-lg font-bold"
          />
          <Button className="h-full" type="primary">
            <BiSearch className="text-[20px]" />
          </Button>
        </div>
        <Select className="h-full" defaultValue={"all"}>
          {assetsOptions.map((asset, index) => {
            return (
              <Select.Option value={asset.value} key={index}>
                {asset.value.toLocaleLowerCase() === "all" ? (
                  <p>{asset.label}</p>
                ) : (
                  <div className="flex gap-3 items-center">
                    <Avatar
                      src={asset.label}
                      size={30}
                      className="rounded-none"
                    />
                    <p>{asset.value}</p>
                  </div>
                )}
              </Select.Option>
            )
          })}
        </Select>
      </div>
      <div className="mb-8 grid md:grid-cols-4 gap-7">
        <Select className="h-full" defaultValue={"STX"}>
          {assetsOptions.map((asset, index) => {
            return (
              <Select.Option value={asset.value} key={index}>
                {asset.value.toLocaleLowerCase() === "all" ? (
                  <p>{asset.label}</p>
                ) : (
                  <div className="flex gap-3 items-center">
                    <Avatar
                      src={asset.label}
                      size={25}
                      className="rounded-none"
                    />
                    <p>{asset.value}</p>
                  </div>
                )}
              </Select.Option>
            )
          })}
        </Select>
        <Select className="h-full" defaultValue={"ETHOS"}>
          {assetsOptions.map((asset, index) => {
            return (
              <Select.Option value={asset.value} key={index}>
                {asset.value.toLocaleLowerCase() === "all" ? (
                  <p>{asset.label}</p>
                ) : (
                  <div className="flex gap-3 items-center">
                    <Avatar
                      src={asset.label}
                      size={25}
                      className="rounded-none"
                    />
                    <p>{asset.value}</p>
                  </div>
                )}
              </Select.Option>
            )
          })}
        </Select>
        <DatePicker />
        <DatePicker />
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
        scroll={{ x: 1100 }}
      />
    </div>
  )
}
