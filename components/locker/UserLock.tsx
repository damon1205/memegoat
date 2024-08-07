"use client"
import {
  Avatar,
  Button,
  Collapse,
  CollapseProps,
  DatePicker,
  Modal,
  Form,
  Input,
  Radio,
  theme,
} from "antd"
import { RangePickerProps } from "antd/es/date-picker"
import { useForm } from "antd/es/form/Form"
import dayjs from "dayjs"
import React, { CSSProperties, ReactNode, useState } from "react"
import { BiCaretRightCircle, BiMoneyWithdraw, BiTransfer } from "react-icons/bi"
import { CgLock } from "react-icons/cg"
import { IoCloseCircle } from "react-icons/io5"
import { LuArrowUpWideNarrow } from "react-icons/lu"
import { PiArrowsSplitThin } from "react-icons/pi"

export const UserLock = () => {
  const [openModal, setOpenModal] = useState(false)
  const [activeOption, setActiveOption] = useState<number>(-1)
  const [option1form] = useForm<{ newOwner: string; newWithModal: string }>()
  const [option2form] = useForm<{ splitLockAmount: number }>()
  const [option3form] = useForm<{ newBlock: string; stxFee: boolean }>()
  const [option4form] = useForm<{ incrLockAmount: number }>()
  const checkIfOwner = () => {
    return true
  }
  const isVested = () => {
    return false
  }

  const optionsData: {
    title: string
    icon: ReactNode
    inputComponent?: ReactNode
    action?: () => void
  }[] = [
    {
      title: "Transfer",
      icon: <BiTransfer />,
      inputComponent: (
        <>
          {checkIfOwner() && !isVested() ? (
            <Form form={option1form} layout="vertical" onFinish={() => {}}>
              <Form.Item
                name={"newOwner"}
                label={"New Owner"}
                rules={[{ required: true }]}
              >
                <Input
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name={"newWithModal"}
                label={"New WithModal"}
                rules={[{ required: true }]}
              >
                <Input
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                  size="large"
                />
              </Form.Item>
              <Button
                htmlType="submit"
                className="rounded-md w-full bg-primary-50"
                size="large"
                type="primary"
              >
                Submit
              </Button>
            </Form>
          ) : (
            <div className="mt-10 w-full text-center font-bold text-lg">
              This is a vested lock
            </div>
          )}
        </>
      ),
    },
    {
      title: "Split",
      icon: <PiArrowsSplitThin />,
      inputComponent: (
        <>
          {!isVested() ? (
            <Form
              className="mt-10 pb-4"
              form={option2form}
              layout="vertical"
              onFinish={() => {}}
            >
              <Form.Item
                name={"splitLockAmount"}
                label={"Split Lock Amount"}
                rules={[{ required: true }]}
              >
                <Input
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                  size="large"
                  type="number"
                />
              </Form.Item>

              <Button
                htmlType="submit"
                className="rounded-md w-full bg-primary-50"
                size="large"
                type="primary"
              >
                Submit
              </Button>
            </Form>
          ) : (
            <div className="mt-10 w-full text-center font-bold text-lg">
              This is a vested lock
            </div>
          )}
        </>
      ),
    },
    {
      title: "Relock",
      icon: <CgLock />,
      inputComponent: (
        <>
          {!isVested() ? (
            <Form
              className="mt-10 pb-4"
              form={option3form}
              layout="vertical"
              onFinish={() => {}}
            >
              <Form.Item
                name={"newBlock"}
                label={"New Block"}
                rules={[{ required: true }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                  size="large"
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                  name="newBlock"
                />
              </Form.Item>

              <Form.Item
                name={"stxFee"}
                label={"Fee Option "}
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value={true}>
                    <div className="w-full cursor-pointer">
                      <div
                        className={
                          "flex items-center justify-center py-2 text-center rounded-md "
                        }
                      >
                        <h1 className="font-bold">STX</h1>
                      </div>
                      <small className="mt-5 text-gray-300">
                        {`Balance: ${0} STX`}
                      </small>
                    </div>
                  </Radio>
                  <Radio value={false}>
                    <div className="w-full cursor-pointer">
                      <div
                        className={
                          "flex items-center justify-center py-2 text-center rounded-md "
                        }
                      >
                        <h1 className="font-bold">MEMEGOAT</h1>
                      </div>
                      <small className="mt-5 text-gray-300">
                        {`Balance: ${0} GOATSTX`}
                      </small>
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Button
                htmlType="submit"
                className="rounded-md w-full bg-primary-50"
                size="large"
                type="primary"
              >
                Submit
              </Button>
            </Form>
          ) : (
            <div className="mt-10 w-full text-center font-bold text-lg">
              This is a vested lock
            </div>
          )}
        </>
      ),
    },
    {
      title: "Increment",
      icon: <LuArrowUpWideNarrow />,
      inputComponent: (
        <>
          {!isVested() ? (
            <Form
              className="mt-10 pb-4"
              form={option4form}
              layout="vertical"
              onFinish={() => {}}
            >
              <Form.Item
                name={"incrLockAmount"}
                label={"Increment Lock Amount"}
                rules={[{ required: true }]}
              >
                <Input
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                  size="large"
                  type="number"
                />
              </Form.Item>

              <Button
                htmlType="submit"
                className="rounded-md w-full bg-primary-50"
                size="large"
                type="primary"
              >
                Submit
              </Button>
            </Form>
          ) : (
            <div className="mt-10 w-full text-center font-bold text-lg">
              This is a vested lock
            </div>
          )}
        </>
      ),
    },
    {
      title: "Withdraw",
      icon: <BiMoneyWithdraw />,
      action: () => {},
    },
  ]

  const { token } = theme.useToken()

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  }
  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => [
    {
      key: "1",
      label: "Pick an option",
      children: (
        <div className="grid md:grid-cols-5 grid-cols-3 md:gap-1 gap-3 items-baseline">
          {optionsData.map(({ title, icon, action }, index) => {
            const active = activeOption === index
            return (
              <div
                onClick={() => {
                  setActiveOption(index)
                  if (title.toLowerCase() !== "withdraw") {
                    setOpenModal(true)
                  }
                  action && action()
                }}
                key={title}
                className={`w-full h-[100px] bg-black/40 rounded-sm cursor-pointer transition-all duration-75 hover:border-[1px] ${active ? "border-[1px]" : "border-0"} border-primary-50/70 shadow-md`}
              >
                <div className="flex flex-col gap-2 items-center justify-center h-full">
                  <Avatar size={30} className="bg-primary-50">
                    {icon}
                  </Avatar>
                  <p className="text-[13px]">{title}</p>
                </div>
              </div>
            )
          })}
        </div>
      ),
      style: panelStyle,
    },
  ]
  return (
    <div>
      <>
        {/* Open Modal */}
        <div>
          <Modal
            open={openModal}
            onCancel={() => setOpenModal(false)}
            closeIcon={<IoCloseCircle className="text-primary-50 text-lg" />}
            classNames={{ content: "max-w-[550px] mx-auto" }}
            title={`Pair Index: #`}
            forceRender={true}
            footer={null}
          >
            <div className="md:w-[85%] mx-auto">
              {optionsData[activeOption]?.inputComponent}
            </div>
          </Modal>
        </div>

        {/* Main Modal */}
        <div className="w-full py-4 px-3 mt-5 shadow-lg bg-primary-100/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex-col items-center gap-4 cursor-pointer">
                <div className="flex gap-1 items-center">
                  <Avatar src={"/logo.svg"} size={40} />
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
              items={getItems(panelStyle)}
            />
          </div>
        </div>
      </>
    </div>
  )
}
