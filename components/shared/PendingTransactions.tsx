"use client"
import { Avatar, Modal, Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import { CgClose } from "react-icons/cg"
import { MdOutlinePendingActions } from "react-icons/md"
import { TransactionTable } from "./TransactionsTable"
import { TxRequest, TxType } from "@/interface"
import { getRecentTransactions } from "@/utils/stacks.data"

export const PendingTransactions = ({ txRequest }: { txRequest: TxRequest }) => {
  const [openModal, setOpenModal] = useState(false)
  const [transactions, setTransactions] = useState<TxType[]>([])
  const toggleModal = () => setOpenModal(!openModal)

  useEffect(() => {
    const fetchData = async () => {
      const transactions = await getRecentTransactions(txRequest);
      setTransactions(transactions)
    }

    const interval = setInterval(() => {
      fetchData()
    }, 60000)


    fetchData()
    return () => clearInterval(interval)
  }, [txRequest])

  return (
    <div>
      <Modal
        open={openModal}
        onCancel={toggleModal}
        footer={null}
        title={<p className="text-[16px] -mt-1">Pending Transactions</p>}
        closeIcon={<CgClose size={20} color="#fff" />}
        width={"1000px"}
        styles={{
          mask: { backdropFilter: "blur(7px)" },
          content: {
            background: "#191B19",
            border: "1px solid #242624",
            borderRadius: 8,
            maxWidth: "auto",
            width: "auto",
          },
          header: { background: "transparent" },
        }}
      >
        <TransactionTable data={transactions} />
      </Modal>

      <Tooltip title="Pending transactions" arrow={false}>
        <Avatar
          className="bg-[#FFFFFF14] rounded-md cursor-pointer"
          onClick={toggleModal}
        >
          <MdOutlinePendingActions size={20} color="#1AC057" />
        </Avatar>
      </Tooltip>
    </div>
  )
}
