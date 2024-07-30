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
import { BsDot } from "react-icons/bs"
import { LaunchpadDataI } from "@/interface"
import { useTokenMinterFields } from "@/hooks/useTokenMinterHooks"
import { ApiURLS, appDetails, getExplorerLink, getUserPrincipal, network, networkInstance, userSession } from "@/utils/stacks.data"
import { uploadToGaia, generateContract } from "@/utils/helpers"
import { AnchorMode } from "@stacks/transactions"
import { showConnect, useConnect } from "@stacks/connect-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { initialData } from "@/data/constants"

interface PropI {
  current: number
  setCurrent: React.Dispatch<React.SetStateAction<number>>
  minter: boolean
}

export const Minter = ({ current, setCurrent, minter }: PropI) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const { doContractDeploy } = useConnect();
  const [form] = useForm<LaunchpadDataI>()
  const { tokenMintProgress, setTokenMintProgress } = useTokenMinterFields();
  const resetForm = () => form.resetFields()
  const fieldRule = (name: string): Rule => {
    return { required: true, message: `${name} is required` }
  }
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrent = useCallback(() => {
    if (minter) return true
    if (tokenMintProgress.step !== "1b") {
      return true
    } else if (tokenMintProgress.step === "1b") {
      return false
    }
    return false
  }, [tokenMintProgress, minter]);

  const onConnectWallet = useCallback(() => {
    showConnect({
      appDetails,
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }, []);

  const nextStep = useCallback(() => {
    if (minter) return;
    if (!tokenMintProgress.step) return;
    if ((tokenMintProgress.step !== current.toString()) && (tokenMintProgress.step !== "1b")) {
      if (tokenMintProgress.step === "2b") {
        setCurrent(2)
      } else {
        setCurrent(Number(tokenMintProgress.step));
      }
    }
  }, [setCurrent, tokenMintProgress, current, minter])

  const updateTokenMintStep = (step: string) => {
    setTokenMintProgress({ ...tokenMintProgress, step: step })
  };

  const handleForm = async () => {
    try {
      if (!userSession.isUserSignedIn()) {
        return;
      }
      setLoading(true);
      const formData = form.getFieldsValue();
      const metadata = {
        name: formData.token_name,
        description: formData.token_desc,
        image: formData.token_image,
      };
      const data = JSON.stringify(metadata);
      const filename = `${metadata.name.replace(/ /g, '-')}.json`
      const token_uri = await uploadToGaia(filename, data, 'application/json');
      if (token_uri === "") {
        toast.error("Please connect Wallet")
        return;
      }
      const contract = generateContract(
        formData.token_name,
        token_uri,
        formData.token_ticker,
        formData.token_supply,
      );
      const contractName = `${formData.token_ticker}`;
      const tokenAddress = `${getUserPrincipal()}.${contractName}`;
      await doContractDeploy({
        network: networkInstance,
        anchorMode: AnchorMode.Any,
        codeBody: contract,
        contractName,
        onFinish: (data) => {
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
        },
        onCancel: () => {
          setLoading(false)
          console.log("onCancel:", "Transaction was canceled");
        },
      });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const fetchTransactionStatus = useCallback(async () => {
    try {
      if (tokenMintProgress.tx_status !== "pending") return;
      setLoading(true);
      const txn = tokenMintProgress;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: ApiURLS[network].getTxnInfo + `${txn.tx_id} `,
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(config);
      if (response.data.tx_status !== "pending") {
        txn.tx_status = response.data.tx_status;
        if (response.data.tx_status === "success") {
          toast.success(`${txn.action} Successful`);
          if (!minter) {
            txn.step = "1b"
          }
          if (minter) {
            setTokenMintProgress({ ...initialData })
            form.resetFields()
          } else {
            setTokenMintProgress({ ...txn })
          }
        } else {
          toast.error(`${txn.action} Failed`);
          setTokenMintProgress({ ...txn })
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [tokenMintProgress, setTokenMintProgress, minter, form]);

  useEffect(() => {
    nextStep()
    const interval = setInterval(() => {
      if (tokenMintProgress.tx_status !== "pending") return;
      fetchTransactionStatus();
    }, 1000);
    //Clearing the interval
    return () => clearInterval(interval);
  }, [
    tokenMintProgress,
    fetchTransactionStatus,
    nextStep
  ]);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setIsSignedIn(true);
    }
    setHasCheckedSession(true);
  }, []);


  if (!hasCheckedSession) {
    return null;
  }

  return (
    <>
      <motion.div className="max-w-[450px] mx-auto p-4 bg-[#121d16] relative border-[1px] border-primary-60">
        <div className="-mb-4 flex justify-between items-center">
          <h3 className="text-[1.2rem]">
            {getCurrent() ? "Token Minter" : "SocialFi"}
            <BsDot className="inline text-2xl text-primary-50" />
          </h3>
        </div>
        <Divider />

        <div>
          {getCurrent() ? (
            <>
              <Form layout="vertical" form={form} onFinish={handleForm} initialValues={tokenMintProgress}>
                <Form.Item
                  label="Token Image"
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
                {isSignedIn ? (
                  <div>
                    <Button
                      className="bg-primary-50 w-full relative h-[45px]"
                      size="large"
                      type="primary"
                      htmlType="submit"
                      disabled={loading}
                    >
                      {!loading ? (
                        <span>Continue</span>
                      ) : (
                        <span>Minting In Progess</span>
                      )}
                    </Button>
                    {(loading && tokenMintProgress.tx_id !== "") && (
                      <div className="text-xs flex flex-row items-center justify-center mt-2">
                        <Link
                          href={getExplorerLink(
                            network,
                            tokenMintProgress.tx_id,
                          )}
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
                    updateTokenMintStep("2");
                    setCurrent(2);
                  }}
                  className="h-[45px] bg-primary-20/5 border-primary-50 text-primary-50"
                >
                  No
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    updateTokenMintStep("1");
                    setCurrent(1);
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
