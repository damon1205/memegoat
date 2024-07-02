"use client"
import { Modal } from "antd"
import React, { useRef } from "react"
interface props {
  openSlippageModal: boolean
  setOpenSlippageModal: React.Dispatch<React.SetStateAction<boolean>>
  slippage: number
  setSlippage: React.Dispatch<React.SetStateAction<number>>
}

export const Slippage = ({ ...props }: props) => {
  const defaultSlippageValues = [1, 2, 3, 4, 5]
  const { openSlippageModal, setOpenSlippageModal } = props
  const { slippage, setSlippage } = props
  const toggleSlippageModal = () => setOpenSlippageModal(!openSlippageModal)
  const slippageRef = useRef(null) as any

  return (
    <div>
      <Modal
        open={openSlippageModal}
        onCancel={toggleSlippageModal}
        footer={null}
        title={"Transaction Setting"}
        styles={{
          mask: { backdropFilter: "blur(7px)" },
          content: {
            background: "rgba(16,69,29,0.15)",
            border: "1px solid rgba(16,69,29,0.85)",
          },
          header: { background: "transparent" },
        }}
      >
        <div className="mt-5">
          <p className="text-custom-white/60 mb-2">Set Slippage</p>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-5 border-[1px] border-primary-100/85 p-1 px-4 grid grid-cols-5 gap-4 bg-primary-100/40">
              {defaultSlippageValues.map((value) => {
                const active = value === slippage
                const activeCls = active ? "bg-primary-50/30" : ""
                return (
                  <p
                    key={value}
                    className={`${activeCls} p-2 flex items-center justify-center cursor-pointer`}
                    onClick={() => setSlippage(value)}
                  >
                    {value}%
                  </p>
                )
              })}
            </div>
            <div>
              <input
                className="outline-none bg-primary-50/10 w-full h-full px-2 border-[1px] border-primary-90"
                type="number"
                ref={slippageRef}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value > 50) {
                    setSlippage(50)
                    slippageRef.current.value = 50
                  } else {
                    setSlippage(value)
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="from-primary-60/5 to-primary-60/40 bg-gradient-to-r  mt-5 text-custom-white/60 px-4 p-4 text-sm flex items-center justify-between">
          <p className="text-primary-30">Slippage Tolerance</p>
          <p className="text-primary-30 font-bold">{slippage}%</p>
        </div>
      </Modal>
    </div>
  )
}
