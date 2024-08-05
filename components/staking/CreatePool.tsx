"use client"
import { Avatar, Button, DatePicker, Drawer, Form, Input, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { IoCloseCircleOutline } from "react-icons/io5"
import moment from "moment";
import type { FormInstance, GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "antd/es/form/Form";
import { getUserPrincipal, userSession } from "@/utils/stacks.data";
import { calculateRewardPerBlockAtCreation, fetchTransactionStatus, generateCreatePoolTxn } from "@/lib/contracts/staking";
import { splitToken } from "@/utils/helpers";
import { useConnect } from "@stacks/connect-react";
import { usePendingTxnFields } from "@/hooks/useTokenMinterHooks";
import { convertToIso } from "@/utils/format";
import { PendingTxnsI, TokenData } from "@/interface";
import { pendingInitial } from "@/data/constants";
import { useNotificationConfig } from "@/hooks/useNotification";
import { SelectToken } from "../shared/SelectToken";
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

export const CreatePool = ({ tokens }: { tokens: TokenData[] }) => {
  const { config } = useNotificationConfig();
  const { doContractCall } = useConnect()
  const [open, setOpen] = useState(false)
  const toggleDrawer = useCallback(() => setOpen(!open), [open]);
  const [rewardPerBlock, setRewardPerBlock] = useState<number>(0);
  const [rewardToken, setRewardToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = useForm<PendingTxnsI>();

  const { pendingTxnProgress, setPendingTxnProgress } = usePendingTxnFields();

  // eslint-disable-next-line arrow-body-style
  const disabledDateStart: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().endOf("day");
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDateEnd: RangePickerProps["disabledDate"] = (current) => {
    if (form.getFieldsValue().start_date) {
      return (
        current &&
        current <= dayjs(form.getFieldsValue().start_date).endOf("day")
      );
    } else {
      return current && current < dayjs().endOf("day");
    }
  };

  const handleForm = async () => {
    if (!userSession.isUserSignedIn) return;
    try {
      setLoading(true)
      const formData = form.getFieldsValue();
      const rewardToken = formData.reward_token;
      const stakeToken = formData.stake_token;
      const rewardAmount = formData.reward_amount;
      const startDate = formData.start_date;
      const endDate = formData.end_date;
      const txn = await generateCreatePoolTxn(rewardToken, stakeToken, rewardAmount, startDate, endDate)
      doContractCall({
        ...txn,
        onFinish: (data) => {
          setPendingTxnProgress({
            action: "Create Pool",
            txID: data.txId,
            userAddr: getUserPrincipal(),
            tag: "stakepool",
            txStatus: "pending",
            reward_amount: formData.reward_amount,
            stake_token: formData.stake_token,
            reward_token: formData.reward_token,
            start_date: convertToIso(formData.start_date),
            end_date: convertToIso(formData.end_date),
            token_image: 's',
          })
        },
        onCancel: () => {
          setLoading(false);
          console.log("onCancel:", "Transaction was canceled");
          config({ message: "User canceled transaction", title: 'Staking', type: 'error' })
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        config({ message: e.message, title: 'Staking', type: 'error' })
      } else {
        config({ message: "An unknown error occurred", title: 'Staking', type: 'error' })
      }
    }
  }

  const setStakeToken = (token: TokenData) => {
    form.setFieldValue('stake_token', token.address);
  }

  const setRewarddToken = (token: TokenData) => {
    form.setFieldValue('reward_token', token.address);
  }

  const updateRate = async () => {
    const formData = form.getFieldsValue();
    const token = formData.reward_token;
    setRewardToken(splitToken(token)[1]);
    const rewardAmount = formData.reward_amount;
    const startDate = formData.start_date;
    const endDate = formData.end_date;
    const result = await calculateRewardPerBlockAtCreation(rewardAmount, startDate, endDate);
    setRewardPerBlock(result);
  }

  useEffect(() => {
    if (pendingTxnProgress.txStatus !== "pending") return;
    const handleTransactionStatus = async () => {
      try {
        const txn = pendingTxnProgress;
        const result = await fetchTransactionStatus(txn);
        if (result !== "pending") {
          if (result === "success") {
            config({ message: `${txn.action} Successful`, title: 'Staking', type: 'success' })
            form.resetFields()
            setPendingTxnProgress({ ...pendingInitial })
            toggleDrawer()
          } else {
            config({ message: `${txn.action} Failed`, title: 'Staking', type: 'error' })
            setPendingTxnProgress({ ...txn })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    const interval = setInterval(() => {
      if (pendingTxnProgress.txStatus !== "pending") return;
      handleTransactionStatus();
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [form, pendingTxnProgress, setPendingTxnProgress, toggleDrawer, config])

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
        className="z-20"
        closeIcon={
          <IoCloseCircleOutline className="text-2xl text-primary-50" />
        }
      >
        <div className="flex flex-col justify-center h-full">
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={() => {
                handleForm()
                console.log(form.getFieldsValue());
              }}
              initialValues={{
                ...pendingTxnProgress,
                "start_date": pendingTxnProgress.start_date ? moment(pendingTxnProgress.start_date) : null,
                "end_date": pendingTxnProgress.end_date ? moment(pendingTxnProgress.end_date) : null
              }}
            >
              <Form.Item name={"stake_token"} label="Select Stake Token">
                <SelectToken tokens={tokens} action={setStakeToken} />
              </Form.Item>
              <Form.Item name={"reward_token"} label="Select Reward Token">
                <SelectToken tokens={tokens} action={setRewarddToken} />
              </Form.Item>
              <Form.Item
                name={"reward_amount"}
                label="Enter Reward Amount"
                rules={[{ required: true }]}
              >
                <Input className="w-full bg-transparent" type="number" onChange={() => updateRate()} />
              </Form.Item>
              <Form.Item
                name={"start_date"}
                label="Start Date"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  use12Hours={true}
                  disabledDate={disabledDateStart}
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                  className="w-full bg-transparent"
                  onChange={() => updateRate()}
                // onChange={calculateDifference}
                />
              </Form.Item>
              <Form.Item
                name={"end_date"}
                label="End Date"
                rules={[{ required: true }]}
              >
                <DatePicker
                  // disabled={loading}
                  format="YYYY-MM-DD HH:mm:ss"
                  use12Hours={true}
                  disabledDate={disabledDateEnd}
                  showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
                  className="w-full bg-transparent"
                  onChange={() => updateRate()}
                />
              </Form.Item>
              <span className=" py-3">
                Reward Per Block is {rewardPerBlock > 0 ? rewardPerBlock.toFixed(4) : 0} {rewardToken}
              </span>
              <Button className="w-full" type="primary" htmlType="submit">
                Create
              </Button>
            </Form>
          </div>
        </div>
      </Drawer>
      <div>
        <Button
          className="md:px-10 mt-7 border-primary-90"
          onClick={toggleDrawer}
          type="primary"
        >
          Create Staking Pool
        </Button>
      </div>
    </div>
  )
}
