"use client"
import React, { useEffect, useState } from "react"
import { Avatar, Input, Modal } from "antd"
import { MdKeyboardArrowDown } from "react-icons/md"
import { CgClose } from "react-icons/cg"
import { IoIosSearch } from "react-icons/io"
import { TokenData } from "@/interface"
import Token from "./Token"
import { useTokensContext } from "@/provider/Tokens"
import { checkInVelar } from "@/utils/swap"

interface propsI {
  tokens: TokenData[]
  defaultTokenID?: string
  action: (value: any) => void
}

export const SelectToken = ({ tokens, defaultTokenID, action }: propsI) => {
  const [selectedToken, setSelectedToken] = useState<TokenData | null>()
  const [tokenMetadata, setTokenMetadata] = useState<TokenData | null>(null);
  const tokensContext = useTokensContext()

  const [openModal, setOpenModal] = useState(false)
  const toggleModal = () => setOpenModal(!openModal)
  const [tokenState, setTokenState] = useState<TokenData[]>([])
  const selectToken = (token: TokenData) => {
    setSelectedToken(token)
    action(token)
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
      const tok = tokens.find((token) => token.name?.toLowerCase() === defaultTokenID.toLowerCase()) as TokenData
      setSelectedToken(
        tok
      )
      // action(tok)
    } else if (tokens.length > 1) {
      setSelectedToken(tokens[0] as TokenData)
      // action(tokens[0] as TokenData)
    } else
      setSelectedToken({
        name: "",
        address: "",
      })
  }, [tokens, defaultTokenID])

  useEffect(() => {
    if (selectedToken) {
      const fetchMeta = async () => {
        const meta = tokensContext.getTokenMeta(selectedToken.name)
        // const tokenMetadata = await fetchTokenMetadata(selectedToken.address);
        setTokenMetadata(meta);
      }
      fetchMeta()
    }
  }, [selectedToken, tokensContext])
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
                  <Token key={index} token={token} action={selectToken} />
                )
              })}
            </>
          )}
        </div>
      </Modal>

      <div
        className="flex gap-1 items-center justify-between cursor-pointer"
        onClick={toggleModal}
      >
        <div className="flex items-center gap-2">
          <Avatar src={tokenMetadata?.icon} size={35} />
          <p className="font-semibold text-[15px] text-white">
            {selectedToken && checkInVelar(selectedToken.symbol || "", tokensContext.velarTokens) ? selectedToken.symbol : selectedToken?.name}
          </p>
        </div>

        <MdKeyboardArrowDown size={20} color="#fff" />
      </div>
    </>
  )
}
