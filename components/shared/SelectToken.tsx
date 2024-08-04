"use client"
import React, { useEffect, useState } from "react"
import { Avatar, Input, Modal } from "antd"
import { MdKeyboardArrowDown } from "react-icons/md"
import { CgClose } from "react-icons/cg"
import { IoIosSearch } from "react-icons/io"

type tokenT = {
  name: string
  icon: string
  id: string
  balance: number
  domain: string
}

interface propsI {
  tokens: tokenT[]
  defaultTokenID?: string
}

export const SelectToken = ({ tokens, defaultTokenID }: propsI) => {
  const [selectedToken, setSelectedToken] = useState({
    name: "",
    icon: "",
    id: "",
  })
  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal(!openModal)
  const [tokenState, setTokenState] = useState<tokenT[]>([])
  const selectToken = (token: tokenT) => {
    setSelectedToken(token)
    toggleModal()
  }

  const searchToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    const filteredToken = tokens.filter((token) => {
      return token.name.toLowerCase().includes(value)
    })
    setTokenState(filteredToken)
  }

  useEffect(() => {
    if (tokens) {
      setTokenState(tokens)
    }
    if (defaultTokenID) {
      setSelectedToken(
        tokens.find((token) => token.id === defaultTokenID) as tokenT
      )
    } else if (tokens.length > 1) {
      setSelectedToken(tokens[0] as tokenT)
    } else
      setSelectedToken({
        name: "",
        icon: "",
        id: "",
      })
  }, [tokens, defaultTokenID])
  return (
    <>
      <Modal
        open={openModal}
        onCancel={toggleModal}
        footer={null}
        title={<p className="text-[16px] -mt-1">Select Token</p>}
        closeIcon={<CgClose size={20} color="#fff" />}
        styles={{
          mask: { backdropFilter: "blur(7px)" },
          content: {
            background: "#191B19",
            border: "1px solid #242624",
            borderRadius: 8,
          },
          header: { background: "transparent" },
        }}
      >
        <div className="mt-4 mb-7">
          <Input
            className="h-[44px] rounded-md bg-[#FFFFFF0D]"
            placeholder="Search token name"
            size="large"
            prefix={<IoIosSearch size={20} color="#FFFFFF4D" />}
            onChange={searchToken}
            allowClear
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-3">
          {tokenState.length === 0 ? (
            <p className="text-white p-5 text-center">No Token</p>
          ) : (
            <>
              {tokenState.map((token, index) => {
                return (
                  <div
                    key={index}
                    className="flex gap-3 items-center justify-between cursor-pointer px-2 py-2 hover:bg-white/5 rounded-md"
                    onClick={() => selectToken(token)}
                  >
                    <div className="flex gap-3 items-center">
                      <Avatar
                        src={token.icon}
                        size={40}
                        className="rounded-md"
                      />
                      <div>
                        <p className="text-white font-medium text-[14px]">
                          {token.name}
                        </p>
                        <p className="text-[12px] text-white/50">
                          {token.domain}
                        </p>
                      </div>
                    </div>
                    <p className="text-white font-medium text-sm">
                      {Number(token.balance).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </Modal>

      <div
        className="flex gap-1 items-center cursor-pointer"
        onClick={toggleModal}
      >
        <Avatar src={selectedToken.icon} size={35} />
        <p className="font-semibold text-[15px] text-white">
          {selectedToken.name}
        </p>
        <MdKeyboardArrowDown size={20} color="#fff" />
      </div>
    </>
  )
}
