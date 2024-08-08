"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button, Divider, Form, Input } from "antd"
import { FaDiscord, FaGlobe } from "react-icons/fa"
import { FaArrowUpRightFromSquare, FaXTwitter } from "react-icons/fa6"
import { useForm } from "antd/es/form/Form"
import { UploadImage } from "@/components/shared/UploadImage"
import { Rule } from "antd/es/form"
// import Link from "next/link"
import { motion } from "framer-motion"
import { LaunchpadDataI } from "@/interface"
import { useTokenMinterFields } from "@/hooks/useTokenMinterHooks"
import {
  ApiURLS,
  appDetails,
  getExplorerLink,
  // getExplorerLink,
  getUserPrincipal,
  network,
  networkInstance,
  userSession,
} from "@/utils/stacks.data"
import { uploadToGaia, generateContract } from "@/utils/helpers"
import { AnchorMode } from "@stacks/transactions"
import { showConnect, useConnect } from "@stacks/connect-react"
import axios from "axios"
import { initialData, txMessage } from "@/data/constants"
import { uploadCampaign } from "@/lib/contracts/launchpad"
import { useNotificationConfig } from "@/hooks/useNotification"
import { createHash, hash } from "crypto"
import { PendingTransactions } from "../shared/PendingTransactions"
import Link from "next/link"
import { storeTransaction } from "@/utils/db"

interface PropI {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
  minter: boolean
}

export const Minter = ({ current, setCurrent, minter }: PropI) => {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)
  const { config } = useNotificationConfig()

  const { doContractDeploy } = useConnect()
  const [form] = useForm<LaunchpadDataI>()
  const { tokenMintProgress, setTokenMintProgress } = useTokenMinterFields()
  const resetForm = () => form.resetFields()
  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }
  const [loading, setLoading] = useState<boolean>(false)

  const onConnectWallet = useCallback(() => {
    showConnect({
      appDetails,
      onFinish: () => {
        window.location.reload()
      },
      userSession,
    })
  }, [])

  const nextStep = useCallback(() => {
    if (minter) return
    if (!tokenMintProgress.step) return
    if (tokenMintProgress.step !== current.toString()) {
      if (tokenMintProgress.step === "1b") {
        setCurrent(1)
      } else {
        setCurrent(Number(tokenMintProgress.step))
      }
    }
  }, [setCurrent, tokenMintProgress, current, minter])

  const handleForm = async () => {
    try {
      if (!userSession.isUserSignedIn()) {
        return
      }
      setLoading(true)
      const formData = form.getFieldsValue()
      const metadata = {
        name: formData.token_name,
        description: formData.token_desc,
        image: formData.token_image,
      }
      const data = JSON.stringify(metadata)
      const filename = `${metadata.name.replace(/ /g, "-")}.json`
      const token_uri = await uploadToGaia(filename, data, "application/json")
      if (token_uri === "") {
        config({
          message: "Please connect Wallet",
          title: "Staking",
          type: "error",
        })
        return
      }
      const contract = generateContract(
        formData.token_name,
        token_uri,
        formData.token_ticker,
        formData.token_supply
      )
      const contractName = `${formData.token_ticker}`
      const tokenAddress = `${getUserPrincipal()}.${contractName}`
      await doContractDeploy({
        network: networkInstance,
        anchorMode: AnchorMode.Any,
        codeBody: contract,
        contractName,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: createHash('sha256').update(data.txId).digest('hex'),
              txId: data.txId,
              txStatus: 'Pending',
              amount: Number(formData.token_supply),
              tag: "MINTER",
              txSender: getUserPrincipal(),
              action: 'Mint New Token'
            })
            await uploadCampaign({ ...tokenMintProgress, is_campaign: false })
            if (!minter) {
              setTokenMintProgress(
                {
                  ...tokenMintProgress,
                  ...form.getFieldsValue(),
                  tx_id: data.txId,
                  token_address: tokenAddress,
                  user_addr: getUserPrincipal(),
                  action: "Token Mint",
                  tx_status: "pending"
                }
              );
            }
          } catch (e) {
            console.log(e)
          }
          config({
            message: txMessage,
            title: "Mint request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId)
          })
          setLoading(false)
          resetForm()
          setTokenMintProgress(initialData)
        },
        onCancel: () => {
          setLoading(false)
          config({
            message: "Transaction was canceled",
            title: "Minter",
            type: "error",
          })
          console.log("onCancel:", "Transaction was canceled")
        },
      })
    } catch (e) {
      setLoading(false)
      if (e instanceof Error) {
        config({ message: e.message, title: 'Launchpad', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Launchpad', type: 'error' })
      }
    }
  }

  const fetchTransactionStatus = useCallback(async () => {
    try {
      if (tokenMintProgress.tx_status !== "pending") return
      setLoading(true)
      const txn = tokenMintProgress
      const axiosConfig = {
        method: "get",
        maxBodyLength: Infinity,
        url: ApiURLS[network].getTxnInfo + `${txn.tx_id} `,
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await axios.request(axiosConfig)
      if (response.data.tx_status !== "pending") {
        txn.tx_status = response.data.tx_status
        if (response.data.tx_status === "success") {
          config({
            message: `${txn.action} Successful`,
            title: "Staking",
            type: "success",
          })
          if (!minter) {
            txn.step = "2"
          }
          if (minter) {
            setTokenMintProgress({ ...initialData })
            form.resetFields()
          } else {
            setTokenMintProgress({ ...txn })
          }
        } else {
          config({
            message: `${txn.action} Failed`,
            title: "Staking",
            type: "error",
          })
          setTokenMintProgress({ ...txn })
        }
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }, [tokenMintProgress, setTokenMintProgress, minter, form, config])

  useEffect(() => {
    nextStep()
    const interval = setInterval(() => {
      if (minter) return
      if (tokenMintProgress.tx_status !== "pending") return
      fetchTransactionStatus()
    }, 1000)
    //Clearing the interval
    return () => clearInterval(interval)
  }, [
    minter,
    tokenMintProgress,
    fetchTransactionStatus,
    nextStep
  ])

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsSignedIn(true)
    }
    setHasCheckedSession(true)
  }, [])

  if (!hasCheckedSession) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-end mb-2 gap-2">
        <PendingTransactions txRequest={{ tag: "MINTER", address: getUserPrincipal() }} />
      </div>
      <motion.div className="max-w-[485px] mx-auto p-4 md:p-6 mb-7 bg-primary-100/35 rounded-lg  mt-3  py-4 border-[1px] border-primary-100/60">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-[1.2rem] font-medium mb-5">Token Minter</h3>
        </div>

        <div>
          <>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleForm}
              initialValues={tokenMintProgress}
            >
              <Form.Item
                label="Attach token image"
                name={"token_image"}
                rules={[fieldRule("Token Image")]}
                required
              >
                <UploadImage
                  field_name="token_image"
                  setFieldValue={form.setFieldValue}
                  initialValue={tokenMintProgress.token_image}
                />
              </Form.Item>
              <div className="mb-3 text-custom-white/60">
                <Form.Item
                  label="Token name"
                  name={"token_name"}
                  rules={[fieldRule("Token Name")]}
                  required
                >
                  <Input
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Ticker"
                    name={"token_ticker"}
                    rules={[fieldRule("Ticker")]}
                    required
                  >
                    <div>
                      <Input
                        className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                        size="large"
                      />
                      <p className="text-white/60 text-[12px] tracking-tight leading-snug">
                        Enter a short symbol for your token, typically 3-4
                        characters
                      </p>
                    </div>
                  </Form.Item>

                  <Form.Item
                    label="Supply"
                    name={"token_supply"}
                    rules={[fieldRule("Token Supply")]}
                    required
                  >
                    <div>
                      <Input
                        className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                        size="large"
                        type="number"
                      />
                      <p className="text-white/60 text-[12px] tracking-tight leading-snug">
                        Specify the total number of tokens. This number cannot
                        be changed.
                      </p>
                    </div>
                  </Form.Item>
                </div>
                <Form.Item
                  label="Description"
                  name={"token_desc"}
                  rules={[fieldRule("Description")]}
                  required
                >
                  <Input.TextArea
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px]"
                    size="large"
                    style={{ minHeight: "6rem" }}
                  />
                </Form.Item>
              </div>
              {!minter && (
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
                      className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
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
                        className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
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
                        className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                        size="large"
                        type="text"
                        prefix={<FaDiscord />}
                      />
                    </Form.Item>
                  </div>
                </>
              )}
              {isSignedIn ? (
                <div>
                  <Button
                    className="bg-primary-50 rounded-lg w-full relative h-[45px]"
                    size="large"
                    type="primary"
                    htmlType="submit"
                    disabled={loading}
                  >
                    {!loading ? (
                      <span>Continue</span>
                    ) : (
                      <span>Awaiting Confirmation</span>
                    )}
                  </Button>
                  {loading && !minter && tokenMintProgress.tx_id !== "" && (
                    <div className="text-xs flex flex-row items-center justify-center mt-2">
                      <Link
                        href={getExplorerLink(network, tokenMintProgress.tx_id)}
                        target="_blank"
                        className="flex"
                      >
                        <h1 className="flex">
                          View Transaction &nbsp;{" "}
                          <FaArrowUpRightFromSquare
                            className="cursor-pointer"
                            color="white"
                            size="1em"
                          />
                        </h1>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="bg-primary-50 w-full relative h-[45px]"
                  size="large"
                  type="primary"
                  onClick={onConnectWallet}
                >
                  <span>Connect Wallet</span>
                </Button>
              )}
            </Form>
          </>
        </div>
      </motion.div>
    </>
  )
}
