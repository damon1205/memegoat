"use client"
import React, { useCallback, useEffect, useState } from "react"
import {
  Avatar,
  Button,
  DatePicker,
  TimePicker,
  Divider,
  Form,
  Input,
} from "antd"
import type { GetProps } from "antd"
import { useForm } from "antd/es/form/Form"
import { Rule } from "antd/es/form"
import { BiLock } from "react-icons/bi"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTokenMinterFields } from "@/hooks/useTokenMinterHooks"
import Image from "next/image"
import { convertToBlocks, convertToIso } from "@/utils/format"
import {
  getUserPrincipal,
  networkInstance,
  contractAddress,
  fetchCurrNoOfBlocks,
  ApiURLS,
  network,
  getExplorerLink,
} from "@/utils/stacks.data"
import {
  FungibleConditionCode,
  createAssetInfo,
  makeStandardFungiblePostCondition,
  AnchorMode,
  contractPrincipalCV,
  uintCV,
  boolCV,
  someCV,
  noneCV,
  PostConditionMode,
} from "@stacks/transactions"
import { splitToken } from "@/utils/helpers"
import { useConnect } from "@stacks/connect-react"
import axios from "axios"
import Link from "next/link"
import { FaArrowUpRightFromSquare } from "react-icons/fa6"
import { initialData, txMessage } from "@/data/constants"
import moment from "moment"
import { LaunchpadDataI } from "@/interface"
import { uploadCampaign } from "@/lib/contracts/launchpad"
import { useNotificationConfig } from "@/hooks/useNotification"
import { createHash } from "crypto"
import { storeTransaction } from "@/utils/db"

interface PropI {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
}

dayjs.extend(customParseFormat)

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

export const CreateTokenSale = ({ current, setCurrent }: PropI) => {
  const { doContractCall } = useConnect()
  const { config } = useNotificationConfig()
  const [showTokenSale, setShowTokenSale] = useState(true)
  const [form] = useForm<LaunchpadDataI>()

  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }
  const { tokenMintProgress, setTokenMintProgress } = useTokenMinterFields()
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  // eslint-disable-next-line arrow-body-style
  const disabledDateStart: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day")
  }

  // eslint-disable-next-line arrow-body-style
  const disabledDateEnd: RangePickerProps["disabledDate"] = (current) => {
    if (form.getFieldsValue().start_date) {
      return (
        current &&
        current <= dayjs(form.getFieldsValue().start_date).endOf("day")
      )
    } else {
      return current && current < dayjs().endOf("day")
    }
  }

  const handleReset = () => {
    form.resetFields()
  }

  const getCurrent = useCallback(() => {
    if (tokenMintProgress.step !== "1b") {
      return true
    } else if (tokenMintProgress.step === "1b") {
      return false
    }
  }, [tokenMintProgress])

  const calcMinAllocation = (supply: number, percentage: number) => {
    return (supply * percentage) / 100
  }

  const fetchTransactionStatus = useCallback(async () => {
    try {
      if (tokenMintProgress.tx_status !== "pending") return
      setLoading(true)
      const txn = tokenMintProgress
      const axiosConfig = {
        method: "get",
        maxBodyLength: Infinity,
        url: ApiURLS[network].getTxnInfo + `${txn.tx_id}`,
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
            title: "Launchpad",
            type: "success",
          })
          txn.step = "1b"
          await uploadCampaign({ ...tokenMintProgress, is_campaign: true })
        } else {
          config({
            message: `${txn.action} Failed`,
            title: "Launchpad",
            type: "error",
          })
        }
        setLoading(false)
        setTokenMintProgress({ ...txn })
      }
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }, [tokenMintProgress, setTokenMintProgress, config])

  const handleRegister = async () => {
    if (!tokenMintProgress) return

    try {
      const formData = form.getFieldsValue()
      const tokenAddress = splitToken(tokenMintProgress.token_address)
      const postConditionCode = FungibleConditionCode.LessEqual
      const assetAddress = tokenAddress[0]
      const assetContractName = tokenAddress[1]

      const assetName = tokenMintProgress.token_ticker
      const fungibleAssetInfo = createAssetInfo(
        assetAddress,
        assetContractName,
        assetName
      )
      const postConditionAmount = BigInt(
        Number(
          tokenMintProgress.campaign_allocation
            ? tokenMintProgress.campaign_allocation
            : 0
        ) +
          Number(formData.listing_allocation) +
          Number(formData.sale_allocation)
      )
      const fungiblePostCondition = makeStandardFungiblePostCondition(
        getUserPrincipal(),
        postConditionCode,
        postConditionAmount * BigInt(10e5),
        fungibleAssetInfo
      )

      const currBlock = await fetchCurrNoOfBlocks()
      const startBlocks = await convertToBlocks(formData.start_date, currBlock)
      const endBlocks = await convertToBlocks(formData.end_date, currBlock)

      doContractCall({
        network: networkInstance,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName: "memegoat-launchpad-v1-4",
        functionName: "register-token-launch",
        functionArgs: [
          contractPrincipalCV(tokenAddress[0], tokenAddress[1]),
          uintCV(Number(formData.sale_allocation) * 1000000),
          uintCV(Number(formData.hard_cap) * 1000000),
          uintCV(Number(formData.soft_cap) * 1000000),
          uintCV(startBlocks),
          uintCV(endBlocks),
          uintCV(Number(formData.minimum_buy) * 1000000),
          uintCV(Number(formData.maximum_buy) * 1000000),
          boolCV(false),
          uintCV(Number(formData.listing_allocation) * 1000000),
          Number(tokenMintProgress.campaign_allocation) > 0
            ? someCV(
                uintCV(Number(tokenMintProgress.campaign_allocation) * 1000000)
              )
            : noneCV(),
          boolCV(true),
        ],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [fungiblePostCondition],
        onFinish: async (txData) => {
          try {
            await storeTransaction({
              key: createHash("sha256").update(txData.txId).digest("hex"),
              txId: txData.txId,
              txStatus: "Pending",
              amount: Number(formData.token_supply),
              tag: "LAUNCHPAD",
              txSender: getUserPrincipal(),
              action: "Create New Launchpad",
            })

            setTokenMintProgress({
              ...tokenMintProgress,
              ...form.getFieldsValue(),
              action: "Create Token Sale",
              tx_id: txData.txId,
              start_date: convertToIso(formData.start_date).toString(),
              end_date: convertToIso(formData.end_date).toString(),
              tx_status: "pending",
            })
          } catch (e) {
            console.log(e)
          }
          config({
            message: txMessage,
            title: "Mint request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, txData.txId),
          })
          setShowTokenSale(false)
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
        config({ message: e.message, title: "Launchpad", type: "error" })
      } else {
        config({
          message: "An unknown error occurred",
          title: "Launchpad",
          type: "error",
        })
      }
    }
  }

  const redirect = useCallback(() => {
    if (!tokenMintProgress.step) return
    if (tokenMintProgress.step !== current.toString()) {
      if (tokenMintProgress.step === "1b") {
        setCurrent(1)
      } else {
        setCurrent(Number(tokenMintProgress.step))
      }
    }
  }, [setCurrent, tokenMintProgress, current])

  useEffect(() => {
    // getTokenMetadata()
    redirect()
    const interval = setInterval(() => {
      if (tokenMintProgress.tx_status !== "pending") return
      fetchTransactionStatus()
    }, 1000)

    //Clearing the interval
    return () => clearInterval(interval)
  }, [
    // getTokenMetadata,
    tokenMintProgress,
    fetchTransactionStatus,
    redirect,
  ])

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-primary-100/35 rounded-lg  mt-3  py-4 border-[1px] border-primary-100/60 px-4 md:p-6"
    >
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-[1.2rem]">
          {!showTokenSale ? "Create Token Locker" : "Create Token Sale"}
        </h3>
      </div>
      <center>
        <div className="flex mt-5 gap-3 items-center">
          <>
            <Avatar src={tokenMintProgress.token_image} size={50} />
            <span className="text-sm">
              {tokenMintProgress.token_name.toUpperCase()}
            </span>
          </>
        </div>
      </center>
      {getCurrent() ? (
        <div>
          <p className="text-sm my-4 text-slate-300">
            Create a sale and raise liquity for instant listing.
          </p>
          <div>
            <Form
              layout="vertical"
              form={form}
              onFinish={() => {
                handleRegister()
              }}
              initialValues={{
                ...tokenMintProgress,
                start_date: tokenMintProgress.start_date
                  ? moment(tokenMintProgress.start_date)
                  : null,
                end_date: tokenMintProgress.end_date
                  ? moment(tokenMintProgress.end_date)
                  : null,
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
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                    disabled={loading}
                    min={calcMinAllocation(
                      Number(tokenMintProgress.token_supply),
                      60
                    )}
                  />
                </Form.Item>
                <p className="text-[12px] text-white/60">
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
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                    disabled={loading}
                    min={calcMinAllocation(
                      Number(tokenMintProgress.token_supply),
                      30
                    )}
                  />
                </Form.Item>
                <p className="text-[12px] text-white/60">
                  Should not be less than 30% of total supply
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Hard Cap (STX)"
                  name={"hard_cap"}
                  rules={[fieldRule("Hard Cap")]}
                  required
                >
                  <Input
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                  />
                </Form.Item>
                <Form.Item
                  label="Soft Cap (STX)"
                  name={"soft_cap"}
                  rules={[fieldRule("Soft Cap")]}
                  required
                >
                  <Input
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Maximum Buy (STX)"
                  name={"maximum_buy"}
                  rules={[fieldRule("Maximum Buy")]}
                  required
                >
                  <Input
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                  />
                </Form.Item>
                <Form.Item
                  label="Minimum Buy (STX)"
                  name={"minimum_buy"}
                  rules={[fieldRule("Minimum Buy")]}
                  required
                >
                  <Input
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    size="large"
                    type="number"
                    name="minimum_buy"
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Description"
                name={"sale_description"}
                rules={[fieldRule("Description")]}
                required
              >
                <Input.TextArea
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
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
                    use12Hours={true}
                    disabledDate={disabledDateStart}
                    // showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    size="large"
                    className="w-full bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    name="start_date"
                    disabled={loading}
                  />
                </Form.Item>
                <Form.Item label="Time" name={"start_time"}>
                  <TimePicker
                    // disabled={loading}
                    format="YYYY-MM-DD HH:mm:ss"
                    use12Hours={true}
                    placement="topLeft"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    size="small"
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Form.Item
                  label="End Date"
                  name={"end_date"}
                  rules={[fieldRule("End Date")]}
                  required
                >
                  <DatePicker
                    use12Hours={true}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabledDate={disabledDateEnd}
                    // showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    size="large"
                    className="w-full bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
                    name="end_date"
                    disabled={loading}
                  />
                </Form.Item>
                <Form.Item label="Time" name={"end_time"}>
                  <TimePicker
                    // disabled={loading}
                    format="YYYY-MM-DD HH:mm:ss"
                    use12Hours={true}
                    placement="topRight"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    size="small"
                  />
                </Form.Item>
              </div>
              <Button
                className="rounded-lg w-full relative"
                size="large"
                type="primary"
                htmlType="submit"
              >
                {loading ? (
                  <span>Transaction processing</span>
                ) : (
                  <span>Create launch</span>
                )}
              </Button>
            </Form>
            {loading && tokenMintProgress.tx_id !== "" && (
              <div className="text-xs flex flex-row items-center justify-center mt-2">
                <Link
                  href={getExplorerLink(network, tokenMintProgress.tx_id)}
                  target="_blank"
                  className="flex"
                >
                  <h1 className="flex text-primary-60">
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
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-[50vh]"
        >
          <div className="flex items-center justify-center flex-col">
            {/* <img src="/logo.svg" /> */}
            <Image
              alt=""
              src={"/logo.svg"}
              width={100}
              height={100}
              className="w-[7rem]"
            />
            <h3 className="text-align text-xl mt-2">
              Create Token Lock{" "}
              <BiLock className="text-white/60 inline font-semibold" />
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
                const token = tokenMintProgress.token_address
                setTokenMintProgress({ ...initialData })
                handleReset()
                router.push(`/launchpad/${token}`)
              }}
              className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px]"
            >
              No
            </Button>
            <Button
              size="large"
              onClick={() => {
                handleReset()
                setTokenMintProgress({ ...initialData })
                router.push("/locker")
              }}
              type="primary"
            >
              Yes
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
