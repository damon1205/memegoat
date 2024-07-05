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
  rank: string
  staking_points: number
  user: string
  referral_points: number
  // total_points: string
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
    render: (text) => (
      <div className="orbitron">
        <p>#{text}</p>
      </div>
    ),
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render(value, record) {
      return (
        <Link
          href={""}
          className="font-medium flex items-center gap-2 hover:text-white text-primary-20 py-3"
        >
          <p className="underline">{record.user}</p>
          <BiLinkExternal className="text-[20px]" />
        </Link>
      )
    },
  },
  {
    title: "Staking Points",
    dataIndex: "staking_points",
    key: "staking_points",
    render(value, record) {
      return <div className="font-medium orbitron">{record.staking_points}</div>
    },
  },

  {
    title: "Referral Points",
    dataIndex: "referral_points",
    key: "referral_points",
    render(value, record) {
      return (
        <div className="font-medium orbitron">{record.referral_points}</div>
      )
    },
  },

  {
    title: "Total Points",
    dataIndex: "staking_points",
    key: "staking_points",
    render(value, record) {
      return (
        <div className="font-medium orbitron">
          {record.staking_points + record.referral_points}
        </div>
      )
    },
  },
]

const data: DataType[] = [
  {
    id: "1",
    staking_points: 5000,
    user: "0xe6...aaAA",
    referral_points: 5,
    rank: "1",
  },
  {
    id: "2",
    staking_points: 19000,
    user: "0xe6...aaAA",
    referral_points: 105,
    rank: "2",
  },
  {
    id: "3",
    staking_points: 25000,
    user: "0xe6...aaAA",
    referral_points: 295,
    rank: "3",
  },
  {
    id: "4",
    staking_points: 125000,
    user: "0xe6...aaAA",
    referral_points: 395,
    rank: "4",
  },
  {
    id: "5",
    staking_points: 19000,
    user: "0xe6...aaAA",
    referral_points: 105,
    rank: "5",
  },
]

export const CommunityTable: React.FC = () => {
  return (
    <div>
      <h3
        className={`orbitron special-text md:text-4xl text-xl font-medium text-custom-white mt-10 mb-5`}
      >
        Leaderboard
      </h3>
      <div className="mb-4 grid md:grid-cols-4 gap-7">
        <div className="col-span-3 flex">
          <Input
            placeholder="Search"
            className="text-lg font-bold bg-transparent"
          />
          <Button className="h-full" type="primary">
            <BiSearch className="text-[20px]" />
          </Button>
        </div>
        <Button className="w-full h-full bg-transparent border-primary-30/60 text-primary-50">
          Stake Token
        </Button>
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
