"use client"
import { Avatar, Modal, Tooltip } from "antd"
import React, { useState } from "react"
import { CgClose } from "react-icons/cg"
import { MdOutlinePendingActions } from "react-icons/md"
import { TransactionTable } from "./TransactionsTable"

export const PendingTransactions = () => {
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal(!openModal)
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
        <TransactionTable />
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
