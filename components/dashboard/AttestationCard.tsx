"use client"
import { Avatar, Divider } from "antd"
import Link from "next/link"
import React from "react"

export interface AttestationCardI {
  token: { name: string; icon: string; price: number }
  origin: string
  target: string[]
  cross_chain_volume: number
  existing_cross_chain_amount: number
  attestation_address: { hot_wallet: string; cold_wallet: string }
  project_swap: { link: string; icon: string }[]
}

export const AttestationCard = ({ ...props }: AttestationCardI) => {
  const token_name = props.token.name
  const token_icon = props.token.icon
  const token_price = props.token.price
  return (
    <div className="border-[1px] border-primary-100 w-full">
      <div className="bg-primary-100/30 border-b-[1px] border-b-primary-100 px-5 py-2 flex gap-3 items-center justify-between flex-wrap">
        <div className="flex gap-3 items-center">
          <Avatar
            src={props.token.icon}
            className="md:w-[55px] md:h-[55px] w-[40px] h-[40px]"
          />
          <p className="font-semibold">{props.token.name}</p>
        </div>
        <p>$ {props.token.price.toLocaleString()}</p>
      </div>
      <div className="py-5 px-4 flex flex-col gap-4 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-custom-white/60">Origin</p>
          <Avatar src={props.origin} size={25} />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-custom-white/60">Target</p>
          <div className="flex gap-2">
            {props.target.map((icon, index) => {
              return <Avatar src={icon} size={25} key={index} />
            })}
          </div>
        </div>
        <div>
          <p className="text-custom-white/60 mb-2">Cross Chain Volume</p>
          <div>
            <span className="text-md">
              {props.cross_chain_volume.toLocaleString()} {token_name}
            </span>{" "}
            <span className="text-custom-white/60 ml-2">
              $ {(props.cross_chain_volume * token_price).toLocaleString()}
            </span>
          </div>
        </div>
        <Divider className="my-1" />
        <div>
          <p className="text-custom-white/60 mb-2">
            Existing Cross Chain Amount
          </p>
          <div>
            <span className="text-md">
              {props.cross_chain_volume.toLocaleString()} {token_name}
            </span>{" "}
            <span className="text-custom-white/60 ml-2">
              ${" "}
              {(
                props.existing_cross_chain_amount * token_price
              ).toLocaleString()}
            </span>
          </div>
        </div>
        <div>
          <p className="text-custom-white/60 mb-2">Attestation Address</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="">Hot Wallet</p>
          <Link
            className="underline text-primary-10"
            href={props.attestation_address.hot_wallet}
          >
            {props.attestation_address.hot_wallet}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="">Cold Wallet</p>
          <Link
            className="underline text-primary-10"
            href={props.attestation_address.cold_wallet}
          >
            {props.attestation_address.cold_wallet}
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-primary-40">Project Swap</p>
          <div className="flex gap-2">
            {props.project_swap.map((swap, index) => {
              return (
                <Link href={swap.link} key={index} target="_blank">
                  <Avatar src={swap.icon} size={25} key={index} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
