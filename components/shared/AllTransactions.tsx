"use client"
import React, { useEffect, useState } from "react"
import { TransactionTable } from "./TransactionsTable"
import { TxRequest, TxType } from "@/interface"
import { Button, DatePicker, Input } from "antd"
import { BiSearch } from "react-icons/bi"
import { getRecentTransactions } from "@/utils/db"

export const AllTransactions = ({ txRequest }: { txRequest: TxRequest }) => {
  const [transactions, setTransactions] = useState<TxType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const transactions = await getRecentTransactions(txRequest);
      // console.log(transactions)
      setTransactions(transactions)
    }
    fetchData()
  }, [txRequest])

  return (
    <div>
      <h3
        className={`orbitron special-text md:text-4xl text-3xl font-medium text-custom-white mb-5`}
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
        <DatePicker />
      </div>
      <TransactionTable data={transactions} dashboard={true} />
    </div>
  )
}
