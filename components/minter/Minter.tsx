"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Avatar, Button, Divider, Form, Input } from "antd"
import { FaCoins, FaDiscord, FaGlobe } from "react-icons/fa"
import { FaArrowUpRightFromSquare, FaXTwitter } from "react-icons/fa6"
import { useForm } from "antd/es/form/Form"
import { UploadImage } from "@/components/shared/UploadImage"
import { Rule } from "antd/es/form"
import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi"
import { motion } from "framer-motion"
import Image from "next/image"
import { BsDot } from "react-icons/bs"

interface PropI {
  current?: number
  setCurrent?: React.Dispatch<React.SetStateAction<number>>
  minter?: boolean
}

export const Minter = ({ ...props }: PropI) => {
  const [form] = useForm()
  const resetForm = () => form.resetFields()
  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }
  const [showSocials, setShowSocials] = useState(false)
  const [showMinter, setShowMinter] = useState(true)
  const next = () => props.setCurrent && props.setCurrent(1)

  const handleForm = async () => {
    try {
      const formData = form.getFieldsValue()
      next()
      setShowMinter(!showMinter)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-[50%] translate-x-[-50%] w-[430px] h-[340px] blur-[300px] bg-primary-20 hidden md:block" />

      <div className="fixed top-[10vh] right-[50%] translate-x-[50%]  z-[0] minter-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ y: 0, opacity: 0.05 }}
          transition={{ duration: 0.5 }}
          className="relative  w-[60rem] h-[60rem]"
        >
          <Image src="/logo.svg" className="w-full h-full" alt="" fill />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="max-w-[450px] mx-auto p-4 bg-[#121d16] relative border-[1px] border-primary-60"
      >
        <div className="-mb-4 flex justify-between items-center">
          <h3 className="text-[1.2rem]">
            {showMinter ? "Token Minter" : "SocialFi"}
            <BsDot className="inline text-2xl text-primary-50" />
          </h3>
        </div>
        <Divider />

        <div>
          {showMinter ? (
            <>
              <Form layout="vertical" form={form} onFinish={handleForm}>
                <Form.Item
                  label="Token Image"
                  name={"token_image"}
                  rules={[fieldRule("Token Image")]}
                  required
                >
                  <UploadImage
                    field_name="token_image"
                    setFieldValue={form.setFieldValue}
                  />
                </Form.Item>
                <div className="mb-3 p-3 text-custom-white/60">
                  <Form.Item
                    label="Token name"
                    name={"token_name"}
                    rules={[fieldRule("Token Name")]}
                    required
                  >
                    <Input
                      className="bg-primary-20/5 border-primary-60 h-[40px]"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name={"token_desc"}
                    rules={[fieldRule("Description")]}
                    required
                  >
                    <Input.TextArea
                      className="bg-primary-20/5 border-primary-60"
                      size="large"
                      style={{ minHeight: "6rem" }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Ticker"
                    name={"token_ticker"}
                    rules={[fieldRule("Ticker")]}
                    required
                  >
                    <Input
                      className="bg-primary-20/5 border-primary-60 h-[40px]"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Supply"
                    name={"token_supply"}
                    rules={[fieldRule("Token Supply")]}
                    required
                  >
                    <Input
                      className="bg-primary-20/5 border-primary-60 h-[40px]"
                      size="large"
                      type="number"
                    />
                  </Form.Item>
                </div>
                {showSocials && (
                  <>
                    <Divider>Socials</Divider>
                    <Form.Item
                      label="Website"
                      name={"token_website"}
                      rules={[
                        {
                          ...fieldRule("Website"),
                          type: "url",
                          message: "Invalid url",
                        },
                      ]}
                      required
                    >
                      <Input
                        className="bg-primary-20/5 border-primary-60 h-[40px]"
                        size="large"
                        type="text"
                        prefix={<FaGlobe />}
                      />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        label="Twitter"
                        name={"twitter"}
                        rules={[fieldRule("Twitter")]}
                        required
                      >
                        <Input
                          className="bg-primary-20/5 border-primary-60 h-[40px]"
                          size="large"
                          type="text"
                          prefix={<FaXTwitter />}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Discord/Telegram Invite"
                        name={"discord"}
                        rules={[fieldRule("Discord/Telegram Invite")]}
                        required
                      >
                        <Input
                          className="bg-primary-20/5 border-primary-60 h-[40px]"
                          size="large"
                          type="text"
                          prefix={<FaDiscord />}
                        />
                      </Form.Item>
                    </div>
                  </>
                )}

                <Button
                  className="bg-primary-50 w-full relative h-[45px]"
                  size="large"
                  type="primary"
                  htmlType="submit"
                >
                  <span>Continue</span>
                </Button>
              </Form>
            </>
          ) : (
            <div className="min-h-[50vh]">
              <div className="flex items-center justify-center flex-col">
                <Avatar src="/logo.svg" size={100} />
                <h3 className="text-align text-xl">
                  Memegoat Earn <FaCoins className="inline text-orange-300" />
                </h3>
              </div>
              <p className="text-sm py-2 px-3 text-center text-custom-white/70">
                Will you like to utilize the meme goat earn socialFi platform to
                promote your token?
              </p>
              <p className="text-center mb-5">
                <Link
                  href={"/https://socialfi.memegoat.io/"}
                  target="_blank"
                  className="text-sm underline text-primary-50 text-center"
                >
                  Go to SocialFi
                  <FiArrowUpRight className="inline text-[16px]" />
                </Link>
              </p>
              <div className="text-sm my-4">
                <p>Benefits</p>
                <ul className="block list-disc px-7 mt-3 space-y-3 text-custom-white/70">
                  <li>Increased token sale participation.</li>
                  <li>Drive twitter engagements.</li>
                  <li>Reward for crypto content creators.</li>
                  <li>Build loyal community members.</li>
                  <li>Increase Twitter followers.</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-10">
                <Button
                  size="large"
                  onClick={() => {
                    setShowMinter(false)
                  }}
                  className="h-[45px] bg-primary-20/5 border-primary-50 text-primary-50"
                >
                  No
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    next()
                  }}
                  type="primary"
                  className="h-[45px]"
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
