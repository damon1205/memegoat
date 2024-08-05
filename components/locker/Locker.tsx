"use client"
import { ITokenMetadata, TokenData } from "@/interface"
import { setTokenMetadata } from "@/lib/features/pairs/tokenSlice"
import { useAppDispatch } from "@/lib/hooks"
import { fetchTokenMetadata, getAllUserTokens, userSession } from "@/utils/stacks.data"
import { Avatar, Button, Select } from "antd"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { BsDot, BsLockFill } from "react-icons/bs"

export const Locker = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [metadata, setMetadata] = useState<ITokenMetadata | null>(null);

  const dispatch = useAppDispatch();

  const handleChange = async (value: string | number) => {
    const token = tokens[Number(value)];
    const metadata = await fetchTokenMetadata(token.address);
    setMetadata(metadata)
    if (metadata) {
      dispatch(setTokenMetadata(metadata))
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userSession.isUserSignedIn()) return
      const alltokens = await getAllUserTokens();
      setTokens(alltokens);
    }
    fetchData()
  }, []);

  return (
    <>
      <div>
        <div className="p-4 text-center from-primary-50/15 to-primary-70/20 bg-gradient-to-r text-primary-50 relative overflow-hidden mb-5">
          <BsDot className="inline text-2xl" />
          <span>Create a New Token Lock</span>
          <BsDot className="inline text-2xl" />

          <div className="absolute top-0 right-0 text-primary-10/5 text-[5.5rem] overflow-hidden">
            <BsLockFill />
          </div>
        </div>

        <div className="bg-[rgba(72,145,90,0.05)] border-0 border-[rgba(16,69,29,0.85)] p-4 md:p-6 backdrop-blur-[12px]">
          <div className="flex gap-3 items-center mb-5">
            <Avatar src="/logo.svg" size={50} />
            <h3>Memegoat Token Locker</h3>
          </div>

          <div>
            <p>Our locker offer</p>
            <ul className="pl-10  mt-4 space-y-3 text-custom-white/60 list-decimal">
              <li>
                <p>Token Vesting</p>
              </li>
              <li>
                <p>Lock splitting</p>
              </li>
              <li>
                <p>Relocking</p>
              </li>
              <li>
                <p>Lock ownership transfer</p>
              </li>
            </ul>
          </div>

          <div className="my-5">
            <p className="text-custom-white/60 mb-3">Select Token</p>
            {/* / <select className="w-full bg-transparent border-[1px] outline-none h-[40px] border-primary-90" /> */}

            <Select
              size="large"
              className="w-full bg-transparent border-[1px] outline-none h-[40px] border-primary-90"
              onChange={(value) => {
                handleChange(value);
              }}
            >
              {tokens.map((token, index) => (
                <Select.Option
                  className="w-full text-white"
                  key={index}
                  value={index}
                >
                  <div className="flex gap-2 items-center">
                    <Avatar
                      className="w-[1.5rem] h-[1.5rem]"
                      src={`https://assets.hiro.so/api/mainnet/token-metadata-api/${token.address}/1.png`}
                    />
                    <span className="text-sm">{token.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
          <Link href={"/locker/setup"}>
            <Button className="w-full" type="primary" disabled={!metadata}>
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
