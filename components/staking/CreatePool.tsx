"use client"
import { Avatar, Button, DatePicker, Drawer, Form, Input, Select } from "antd"
import React, { useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"

const assetsOptions = [
  { value: "BTC", label: "/images/bitcoinsvg.svg" },
  { value: "ETH", label: "/images/eth.svg" },
  { value: "STX", label: "/images/stx.svg" },
  { value: "XMR", label: "/images/xmr.svg" },
  { value: "ETHOS", label: "/images/ethos.svg" },
]

export const CreatePool = () => {
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => setOpen(!open)
  return (
    <div>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        placement="left"
        title={"Create Staking Pool"}
        styles={{
          mask: { backdropFilter: "blur(12px)" },
          content: {
            background: "rgba(16,69,29,0.1)",
            border: "1px solid rgba(16,69,29,0.85)",
          },
          header: { background: "transparent" },
        }}
        closeIcon={
          <IoCloseCircleOutline className="text-2xl text-primary-50" />
        }
      >
        <div className="flex flex-col justify-center h-full">
          <div>
            <Form layout="vertical">
              <Form.Item name={"token"} label="Select Token">
                <Select className="w-full" defaultValue={"STX"}>
                  {assetsOptions.map((asset, index) => {
                    return (
                      <Select.Option value={asset.value} key={index}>
                        {asset.value.toLocaleLowerCase() === "STX" ? (
                          <p>{asset.label}</p>
                        ) : (
                          <div className="flex gap-3 items-center">
                            <Avatar
                              src={asset.label}
                              size={25}
                              className="rounded-none"
                            />
                            <p>{asset.value}</p>
                          </div>
                        )}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <Select className="w-full" defaultValue={"BTC"}>
                  {assetsOptions.map((asset, index) => {
                    return (
                      <Select.Option value={asset.value} key={index}>
                        {asset.value.toLocaleLowerCase() === "STX" ? (
                          <p>{asset.label}</p>
                        ) : (
                          <div className="flex gap-3 items-center">
                            <Avatar
                              src={asset.label}
                              size={25}
                              className="rounded-none"
                            />
                            <p>{asset.value}</p>
                          </div>
                        )}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <Input className="w-full bg-transparent" />
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <DatePicker className="w-full bg-transparent" />
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <DatePicker className="w-full bg-transparent" />
              </Form.Item>
              <Button className="w-full" type="primary">
                Create
              </Button>
            </Form>
          </div>
        </div>
      </Drawer>
      <div>
        <Button
          className="bg-transparent md:px-10 mt-7 border-primary-90"
          onClick={toggleDrawer}
        >
          Create Staking Pool
        </Button>
      </div>
    </div>
  )
}
