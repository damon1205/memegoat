"use client"
import { ITokenMetadata, TokenData } from "@/interface"
import { fetchTokenMetadata, getAllUserTokens, userSession } from "@/utils/stacks.data"
import { Avatar, Button } from "antd"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { BsDot, BsLockFill } from "react-icons/bs"
import { SelectToken } from "../shared/SelectToken"
import { useTokensContext } from "@/provider/Tokens"
import { useTokenLocker } from "@/hooks/useTokenLocker"

export const Locker = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [metadata, setMetadata] = useState<TokenData | null>(null);

  const { setTokenLockerDetails } = useTokenLocker()

  const tokensContext = useTokensContext();

  const handleChange = async (token: TokenData) => {

    // const meta = tokensContext.getTokenMetaByAddress(token.address)
    // if (meta) {
    //   setMetadata(meta);
    //   setTokenLockerDetails(meta)
    // } else {
    const tokenMetadata = await fetchTokenMetadata(token.address);
    const meta = {
      symbol: tokenMetadata?.symbol,
      address: token.address,
      name: token.name,
      icon: tokenMetadata?.image_uri,
      decimals: tokenMetadata?.decimals
    }
    setMetadata(meta)
    setTokenLockerDetails(meta)
    // }
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
            {/* <SelectToken tokens={tokens} action={handleChange} /> */}

            <div className="px-2 py-2 rounded-lg bg-[#00000033] border-[1px] border-[#FFFFFF1A] w-100">
              <SelectToken tokens={tokens} action={handleChange} />
            </div>
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
