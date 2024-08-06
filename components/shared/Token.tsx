"use client"
import { TokenData } from '@/interface'
import { useTokensContext } from '@/provider/Tokens'
import { formatBal } from '@/utils/format'
import { fetchSTXBalance, getUserTokenBalance, userSession } from '@/utils/stacks.data'
import { Avatar } from 'antd'
import React, { useEffect, useState } from 'react'

const Token = ({ token, action }: { token: TokenData, action: (token: TokenData) => void }) => {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenMetadata, setTokenMetadata] = useState<TokenData | null>(null)
  const tokensContext = useTokensContext();

  useEffect(() => {
    const fetchData = async () => {
      if (userSession.isUserSignedIn()) {
        if (token.name.toLocaleLowerCase() === "stx") {
          const balance = await fetchSTXBalance()
          setTokenBalance(balance)
        } else {
          const balance = await getUserTokenBalance(token.address, token.decimals);
          setTokenBalance(balance)
        }
      }
      const meta = tokensContext.getTokenMeta(token.name)
      setTokenMetadata(meta);
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
