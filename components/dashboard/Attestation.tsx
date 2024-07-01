"use client"
import React from "react"
import { AttestationCard, AttestationCardI } from "./AttestationCard"

const attestations: AttestationCardI[] = [
  {
    token: { name: "MemeGoat", icon: "/logo.svg", price: 0.0567 },
    origin: "/images/stx.svg",
    target: ["/images/bitcoinsvg.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
  {
    token: { name: "STX", icon: "/images/eth.svg", price: 2.432 },
    origin: "/images/bitcoinsvg.svg",
    target: ["/logo.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
  {
    token: { name: "Eth", icon: "/images/eth.svg", price: 0.0567 },
    origin: "/images/bitcoinsvg.svg",
    target: ["/images/stx.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
  {
    token: { name: "Ethos", icon: "/images/ethos.svg", price: 0.0567 },
    origin: "/images/bitcoinsvg.svg",
    target: ["/images/stx.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
  {
    token: { name: "XMR", icon: "/images/xmr.svg", price: 0.0567 },
    origin: "/images/bitcoinsvg.svg",
    target: ["/images/stx.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
  {
    token: { name: "MemeGoat", icon: "/logo.svg", price: 0.0567 },
    origin: "/images/bitcoinsvg.svg",
    target: ["/images/stx.svg", "/images/eth.svg", "/images/ethos.svg"],
    cross_chain_volume: 5000000,
    existing_cross_chain_amount: 23000000,
    attestation_address: {
      hot_wallet: "bc1p6r...u38z",
      cold_wallet: "bc1p6r...u38z",
    },
    project_swap: [{ link: "/", icon: "/logo.svg" }],
  },
]

export const Attestation = () => {
  return (
    <div className="py-5">
      <h3
        className={`orbitron special-text md:text-4xl font-medium text-custom-white mb-10`}
      >
        Attestation
      </h3>
      <div className="grid md:grid-cols-3 gap-7">
        {attestations.map((attestation, index) => {
          return <AttestationCard key={index} {...attestation} />
        })}
      </div>
    </div>
  )
}
