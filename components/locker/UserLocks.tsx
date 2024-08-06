"use client"
import { Avatar, Collapse, Drawer } from "antd"
import React, { useState } from "react"
import { BiCaretRightCircle } from "react-icons/bi"
import { IoCloseCircle } from "react-icons/io5"

export const UserLocks = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  return (
    <div>
      <>
        {/* Open Drawer */}
        <div>
          <Drawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            placement="bottom"
            closeIcon={<IoCloseCircle className="text-primary-50 text-lg" />}
            classNames={{ content: "max-w-[550px] mx-auto" }}
            title={`Pair Index: #`}
            forceRender={true}
          >
            <div className="md:w-[85%] mx-auto">
              {/* {optionsData[activeOption]?.inputComponent} */}
            </div>
          </Drawer>
        </div>

        {/* Main Drawer */}
        <div
          className="w-full py-4 px-3 mt-5
       border-b-[1px] border-zinc-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex-col items-center gap-4 cursor-pointer">
                <div className="flex gap-1 items-center">
                  <Avatar src={""} size={30} />
                  <h1 className="font-semibold text-sm">Token Name</h1>
                </div>
              </div>
              <small>Pair Index: # {0} </small>
            </div>
            <div>
              <h1 className="font-semibold text-sm flex">Amount &ensp; </h1>
              <small className="text-gray-400">2000 Tokens</small>
            </div>
          </div>

          <div className="mt-3 text-xs">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold mb-2 text-center">Unlock Info</h1>
              <div className="flex items-center justify-between">
                <span> Current Block height: &nbsp; </span>
                <b className="text-primary-50">{5000}</b>
              </div>
              <div className="flex items-center justify-between">
                <span> Unlock Block height: &nbsp; </span>
                <b className="text-primary-50">12th</b>
              </div>
              <div className="flex items-center justify-between">
                <span> Amount: &nbsp; </span>
                <b className="text-primary-50">5000</b>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <BiCaretRightCircle rotate={isActive ? 90 : 0} />
              )}
              items={[]}
            />
          </div>
        </div>
      </>
    </div>
  )
}
