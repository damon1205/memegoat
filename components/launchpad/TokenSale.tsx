"use client"
import React, { useState } from "react"
import { Button, DatePicker, Divider, Form, Input } from "antd"
import { useForm } from "antd/es/form/Form"
import { Rule } from "antd/es/form"
import { BiLock } from "react-icons/bi"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface PropI {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
}

dayjs.extend(customParseFormat)

export const CreateTokenSale = ({ current, setCurrent }: PropI) => {
  const [showTokenSale, setShowTokenSale] = useState(true)
  const [form] = useForm()
  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }
  const handleRegister = async () => {
    const formData = form.getFieldsValue()
    setShowTokenSale(false)
  }

  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-60/5 p-5 rounded-lg shadow-md shadow-[#161515fd]"
    >
      <div className="-mb-4 flex justify-between items-center">
        <h3 className="text-[1.2rem]">
          {!showTokenSale ? "Create Token Locker" : "Create Token Sale"}
        </h3>
      </div>
      <Divider />
      {showTokenSale ? (
        <div>
          <p className="text-sm text-center my-4 md:max-w-[60%] max-w-[80%] mx-auto text-slate-300">
            Create a sale and raise liquity for instant listing.
          </p>
          <div>
            <Form
              layout="vertical"
              form={form}
              onFinish={() => {
                handleRegister()
              }}
            >
              <div className="mb-3">
                <Form.Item
                  label="Supply For Sale"
                  name={"sale_allocation"}
                  rules={[fieldRule("Supply For Sale")]}
                  required
                  className="mb-0"
                >
                  <Input
                    className="bg-transparent"
                    size="large"
                    type="number"
                  />
                </Form.Item>
                <p className="text-[12px] text-accent">
                  Should not be less than 60% of total supply
                </p>
              </div>
              <div className="mb-3">
                <Form.Item
                  label="Amount For Liquidity"
                  name={"listing_allocation"}
                  rules={[fieldRule("Amount For Liquidity")]}
                  required
                  className="mb-0"
                >
                  <Input
                    className="bg-transparent"
                    size="large"
                    type="number"
                  />
                </Form.Item>
                <p className="text-[12px] text-accent">
                  Should not be less than 30% of total supply
                </p>
              </div>
              <Form.Item
                label="Hard Cap (STX)"
                name={"hard_cap"}
                rules={[fieldRule("Hard Cap")]}
                required
              >
                <Input className="bg-transparent" size="large" type="number" />
              </Form.Item>
              <Form.Item
                label="Soft Cap (STX)"
                name={"soft_cap"}
                rules={[fieldRule("Soft Cap")]}
                required
              >
                <Input className="bg-transparent" size="large" type="number" />
              </Form.Item>
              <Form.Item
                label="Maximum Buy (STX)"
                name={"maximum_buy"}
                rules={[fieldRule("Maximum Buy")]}
                required
              >
                <Input className="bg-transparent" size="large" type="number" />
              </Form.Item>
              <Form.Item
                label="Minimum Buy (STX)"
                name={"minimum_buy"}
                rules={[fieldRule("Minimum Buy")]}
                required
              >
                <Input
                  className="bg-transparent"
                  size="large"
                  type="number"
                  name="minimum_buy"
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name={"sale_description"}
                rules={[fieldRule("Description")]}
                required
              >
                <Input.TextArea
                  className="bg-transparent"
                  size="large"
                  name="sale_description"
                  style={{ minHeight: "6rem" }}
                />
              </Form.Item>
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label="Start Date"
                  name={"start_date"}
                  rules={[fieldRule("Start Date")]}
                  required
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    size="large"
                    className="w-full bg-transparent"
                    name="start_date"
                  />
                </Form.Item>
                <Form.Item
                  label="End Date"
                  name={"end_date"}
                  rules={[fieldRule("End Date")]}
                  required
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    size="large"
                    className="w-full bg-transparent"
                    name="end_date"
                  />
                </Form.Item>
              </div>
              <Button
                className="bg-accent w-full relative"
                size="large"
                type="primary"
                htmlType="submit"
              >
                <span>Create launch</span>
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="min-h-[50vh]">
          <div className="flex items-center justify-center flex-col">
            <img src="/logo.svg" className="w-[7rem]" />
            <h3 className="text-align text-xl mt-2">
              Create Token Lock{" "}
              <BiLock className="text-accent inline font-semibold" />
            </h3>
          </div>
          <p className="text-[16px] py-5 px-3 text-center">
            Would you like to lock team allocation if any?
          </p>
          <div className="text-sm my-4">
            <p>Benefits</p>
            <ul className="list-disc px-7 mt-3 flex flex-col gap-1 mb-7">
              <li>Build trust with your community.</li>
              <li>Build a long lasting meme project.</li>
              <li>Vest Token Allocations for price stability.</li>
              <li>Prove to investors you&apos;re here for the long term.</li>
              <li>Secure institutional investors.</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Button
              size="large"
              onClick={() => {
                router.push(`/launchpad/${1}`)
              }}
              className="bg-transparent"
            >
              No
            </Button>
            <Button
              size="large"
              onClick={() => {
                router.push("/locker")
              }}
              type="primary"
            >
              Yes
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
