"use client"
import React, { useCallback, useEffect } from "react"
import { Button, Divider, Form, Input } from "antd"
import { FaXTwitter } from "react-icons/fa6"
import { useForm } from "antd/es/form/Form"
import { Rule } from "antd/es/form"
import { CgHashtag } from "react-icons/cg"
import { ResetFormFields } from "../shared/ResetFormFields"
import { motion } from "framer-motion"

interface PropI {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
}

export const CampaignAllocation: React.FC<PropI> = ({
  current,
  setCurrent,
}) => {
  const [form] = useForm()
  const resetForm = () =>
    form.resetFields(["campaign-twitter", "campaign-hashtags"])
  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }

  const handleForm = async () => {
    const formData = form.getFieldsValue()
    setCurrent(2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-60/5 p-5 rounded-lg shadow-md shadow-[#161515fd]"
    >
      <div className="-mb-4 flex justify-between items-center">
        <h3 className="text-[1.2rem]">Campaign Allocation</h3>
        <ResetFormFields {...{ resetForm }} />
      </div>
      <Divider />

      <div>
        <Form layout="vertical" form={form} onFinish={handleForm}>
          <Form.Item
            label="Campaign Allocation"
            name={"campaign_allocation"}
            rules={[fieldRule("Campaign Allocation")]}
            required
          >
            <div>
              <Input size="large" type="number" className="bg-transparent" />
              <p className="text-[12px] text-accent">
                Should not be less than 5% of total supply
              </p>
            </div>
          </Form.Item>
          <Form.Item
            label="Description"
            name={"campaign_description"}
            rules={[fieldRule("Description")]}
            required
          >
            <Input.TextArea
              size="large"
              style={{ minHeight: "6rem" }}
              className="bg-transparent"
            />
          </Form.Item>

          <Form.Item
            label="Twitter Handle"
            name={"campaign_twitter"}
            rules={[fieldRule("Twitter Handle")]}
            required
          >
            <Input
              size="large"
              type="text"
              prefix={<FaXTwitter />}
              className="bg-transparent"
            />
          </Form.Item>

          <Form.Item
            label="HashTags"
            name={"campaign_hashtags"}
            rules={[fieldRule("HashTags")]}
            required
          >
            <Input
              size="large"
              type="text"
              prefix={<CgHashtag />}
              className="bg-transparent"
            />
          </Form.Item>
          <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
          >
            <span>Continue</span>
          </Button>
        </Form>
      </div>
    </motion.div>
  )
}
