"use client"
import { TokenData } from '@/interface'
import { useTokensContext } from '@/provider/Tokens'
import { fetchTokenMetadata, userSession } from '@/utils/stacks.data'
import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'

const Token = ({ token, action }: { token: TokenData, action: (token: TokenData) => void }) => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenMetadata, setTokenMetadata] = useState<TokenData | null>(null)
  const tokensContext = useTokensContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userSession.isUserSignedIn()) {
          const balance = await tokensContext.getTokenBalance(token);
          setTokenBalance(balance ? balance : 0)
        }
        const meta = tokensContext.getTokenMetaByAddress(token.address)
        if (meta) {
          setTokenMetadata(meta);
        } else {
          const tokenMetadata = await fetchTokenMetadata(token.address);
          setTokenMetadata({
            symbol: tokenMetadata?.symbol,
            address: token.address,
            name: token.name,
            icon: tokenMetadata?.image_uri,
            decimals: tokenMetadata?.decimals
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [token, tokensContext])

  return (
    <div
      className="flex gap-3 items-center justify-between cursor-pointer px-2 py-2 hover:bg-white/5 rounded-md"
      onClick={() => action(token)}
    >
      <div className="flex gap-3 items-center">
        <Avatar
          src={tokenMetadata?.icon}
          size={40}
          className="rounded-md"
        />
        <div>
          <p className="text-white font-medium text-[14px]">
            {token.name}
          </p>
          {/* <p className="text-[12px] text-white/50">
            {token.domain}
          </p> */}
        </div>
      </div>
      <p className="text-white font-medium text-sm">
        {Number((tokenBalance)).toLocaleString()}
      </p>
    </div>
  )
}

export default Token
