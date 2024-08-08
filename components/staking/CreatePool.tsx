"use client"
import {
  Avatar,
  Button,
  DatePicker,
  TimePicker,
  Modal,
  Form,
  Input,
} from "antd"
import React, { useCallback, useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import moment from "moment"
import type { GetProps } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useForm } from "antd/es/form/Form"
import {
  contractAddress,
  getExplorerLink,
  getUserPrincipal,
  network,
  userSession,
} from "@/utils/stacks.data"
import {
  calculateRewardPerBlockAtCreation,
  generateCreatePoolTxn,
} from "@/lib/contracts/staking"
import { genHex, splitToken } from "@/utils/helpers"
import { useConnect } from "@stacks/connect-react"
import { usePendingTxnFields } from "@/hooks/useTokenMinterHooks"
import { PendingTxnsI, TokenData } from "@/interface"
import { pendingInitial, txMessage } from "@/data/constants"
import { useNotificationConfig } from "@/hooks/useNotification"
import { SelectToken } from "../shared/SelectToken"
import { storeTransaction } from "@/utils/db"
import { useTokensContext } from "@/provider/Tokens"
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

dayjs.extend(customParseFormat)

function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// Function to disable specific time slots
const disabledTime = () => {
  const now = dayjs().add(1, 'hour');
  const currentHour = now.hour();
  const currentMinute = now.minute();

  return {
    disabledHours: () => {
      const hours = range(0, 24);
      // Disable hours before the current hour
      return hours.filter(hour => hour < currentHour);
    },
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === currentHour) {
        return range(0, 60).filter(minute => minute < currentMinute);
      }
      return [];
    },
    disabledSeconds: () => [] // Keeping seconds enabled
  };
};

export const CreatePool = ({ tokens }: { tokens: TokenData[] }) => {
  const { config } = useNotificationConfig()
  const { doContractCall } = useConnect()
  const [open, setOpen] = useState(false)
  const toggleModal = useCallback(() => setOpen(!open), [open])
  const [rewardPerBlock, setRewardPerBlock] = useState<number>(0)
  const [rewardsToken, setRewardToken] = useState<string>("")
  const [stakesToken, setSstakeToken] = useState<string>("")
  const [form] = useForm<PendingTxnsI>()
  const [loading, setLoading] = useState(false)

  const { getTokenMetaByAddress } = useTokensContext()

  const { pendingTxnProgress, setPendingTxnProgress } = usePendingTxnFields()

  // eslint-disable-next-line arrow-body-style
  const disabledDateStart: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day")
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


  const handleForm = async () => {
    if (!userSession.isUserSignedIn) return
    try {
      setLoading(true)
      const formData = form.getFieldsValue()
      const rewardToken = formData.reward_token
      const stakeToken = formData.stake_token
      const rewardAmount = formData.reward_amount
      const startDate = formData.start_date
      const endDate = formData.end_date
      const txn = await generateCreatePoolTxn(
        rewardToken,
        stakeToken,
        rewardAmount,
        startDate,
        endDate,
        rewardsToken.toLowerCase() !== "stx" ? false : true
      )
      doContractCall({
        ...txn,
        onFinish: async (data) => {
          try {
            await storeTransaction({
              key: genHex(data.txId),
              txId: data.txId,
              txStatus: "Pending",
              amount: Number(rewardAmount),
              tag: "STAKE-POOLS",
              txSender: getUserPrincipal(),
              action: `Create ${rewardsToken}/${stakesToken} POOL`,
            })
            setLoading(false)
          } catch (e) {
            console.log(e)
            setLoading(false)
          }
          setLoading(false)
          config({
            message: txMessage,
            title: "Pool Creation request successfully received!",
            type: "success",
            details_link: getExplorerLink(network, data.txId),
          })
          setPendingTxnProgress({ ...pendingInitial })
        },
        onCancel: () => {
          console.log("onCancel:", "Transaction was canceled")
          config({
            message: "User canceled transaction",
            title: "Staking",
            type: "error",
          })
          setLoading(false)
        },
      })
    } catch (e) {
      setLoading(false)
      if (e instanceof Error) {
        config({ message: e.message, title: "Staking", type: "error" })
      } else {
        config({
          message: "An unknown error occurred",
          title: "Staking",
          type: "error",
        })
      }
    }
  }

  const setStakeToken = (token: TokenData) => {
    form.setFieldValue("stake_token", token.address)
  }

  const setRewarddToken = (token: TokenData) => {
    form.setFieldValue("reward_token", token.address)
  }

  const updateRate = async () => {
    const formData = form.getFieldsValue()
    const rtoken = splitToken(formData.reward_token)[1]
    const stToken = splitToken(formData.stake_token)[1]
    const token = getTokenMetaByAddress(formData.reward_token)
    const stokne = getTokenMetaByAddress(formData.stake_token)
    setRewardToken(token ? token.name : rtoken)
    setSstakeToken(stokne ? stokne.name : stToken)
    const rewardAmount = formData.reward_amount
    if (!formData.start_date || !formData.end_date || !formData.start_time || !formData.end_time) return
    const startDate = dayjs(formData.start_date)
      .hour(dayjs(formData.start_time).hour())
      .minute(dayjs(formData.start_time).minute())
      .second(dayjs(formData.start_time).second())
      .toISOString();
    const endDate = dayjs(formData.end_date)
      .hour(dayjs(formData.end_time).hour())
      .minute(dayjs(formData.end_time).minute())
      .second(dayjs(formData.end_time).second())
      .toISOString();
    const result = await calculateRewardPerBlockAtCreation(
      rewardAmount,
      startDate,
      endDate
    )
    setRewardPerBlock(result)
  }

  return (
    <div>
      <Modal
        open={open}
        onCancel={toggleModal}
        footer={null}
        title={"Create Staking Pool"}
        styles={{
          mask: { backdropFilter: "blur(12px)" },
          content: {
            background: "#191B19",
            borderRadius: "8px",
            border: "1px solid #242624",
          },
          header: { background: "transparent" },
        }}
        className="z-20"
        closeIcon={<IoCloseCircleOutline className="text-2xl text-white" />}
      >
        <div className="flex flex-col justify-center h-full mt-7">
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={() => {
                handleForm()
                console.log(form.getFieldsValue())
              }}
              initialValues={{
                ...pendingTxnProgress,
                start_date: pendingTxnProgress.start_date
                  ? moment(pendingTxnProgress.start_date)
                  : null,
                end_date: pendingTxnProgress.end_date
                  ? moment(pendingTxnProgress.end_date)
                  : null,
                reward_token:
                  "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.token-wstx",
                stake_token: `${contractAddress}.memegoatstx`,
              }}
            >
              <Form.Item name={"stake_token"} label="Select Stake Token">
                <div className="px-2 py-1 bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px]">
                  <SelectToken
                    tokens={tokens}
                    action={setStakeToken}
                    defaultTokenID="memegoatstx"
                  />
                </div>
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <div className="px-2 py-1 bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px]">
                  <SelectToken
                    tokens={tokens}
                    action={setRewarddToken}
                    defaultTokenID="STX"
                  />
                </div>
              </Form.Item>
              <Form.Item
                name={"reward_amount"}
                label="Reward Amount"
                rules={[{ required: true }]}
              >
                <Input
                  className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                  type="number"
                  onChange={() => updateRate()}
                  placeholder="Enter the reward ammount"
                />
              </Form.Item>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name={"start_date"}
                  label="Start Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    // use12Hours={true}
                    disabledDate={disabledDateStart}
                    // showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    placement="topRight"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    onChange={() => updateRate()}
                    size="small"
                  // onChange={calculateDifference}
                  />
                </Form.Item>
                <Form.Item name={"start_time"} label="Time">
                  <TimePicker
                    // disabled={loading}
                    format="h:mm:ss A"
                    use12Hours={true}
                    placement="topLeft"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    size="small"
                    disabledTime={disabledTime}
                    onChange={() => updateRate()}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name={"end_date"}
                  label="End Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    // disabled={loading}
                    format="YYYY-MM-DD"
                    use12Hours={true}
                    disabledDate={disabledDateEnd}
                    // showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                    placement="topLeft"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    onChange={() => updateRate()}
                    size="small"
                  />
                </Form.Item>
                <Form.Item name={"end_time"} label="Time">
                  <TimePicker
                    // disabled={loading}
                    format="h:mm:ss A"
                    use12Hours={true}
                    placement="topLeft"
                    className="bg-[#FFFFFF0D] border-[#FFFFFF0D] border-[2px] hover:bg-transparent rounded-[8px] h-[43px] w-full"
                    size="small"
                    onChange={() => updateRate()}

                  />
                </Form.Item>
              </div>
              <span className=" py-3">
                Reward Per Block is{" "}
                {rewardPerBlock > 0 ? rewardPerBlock.toFixed(4) : 0}{" "}
                {rewardsToken}
              </span>
              <Button
                className="w-full rounded-lg"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {loading ? "Submitting Transaction" : "Create"}
              </Button>
            </Form>
          </div>
        </div>
      </Modal>
      <div>
        <Button
          className="md:px-10 mt-7 border-primary-90"
          onClick={toggleModal}
          type="primary"
        >
          Create Staking Pool
        </Button>
      </div>
    </div>
  )
}
