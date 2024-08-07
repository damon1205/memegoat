"use client"
import { Avatar, Button, DatePicker, GetProps, Input, Radio, Select } from "antd"
import dayjs from "dayjs"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { BsLockFill } from "react-icons/bs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { FinishedTxData, useConnect } from "@stacks/connect-react"
import { contractAddress, fetchCurrNoOfBlocks, fetchSTXBalance, getUserPrincipal, getUserTokenBalance, network, networkInstance } from "@/utils/stacks.data"
import { formatBal, formatNumber } from "@/utils/format"
import { CsvObject } from "@/interface"
import { tupleCV, uintCV, standardPrincipalCV, createAssetInfo, FungibleConditionCode, makeStandardFungiblePostCondition, makeStandardSTXPostCondition, AnchorMode, boolCV, contractPrincipalCV, listCV, PostConditionMode } from "@stacks/transactions"
import { getTokenSource, splitToken } from "@/utils/helpers"
import { storeDB } from "@/lib/contracts/locker"
import { useRouter } from "next/navigation"
import { useNotificationConfig } from "@/hooks/useNotification"
import { useTokenLocker } from "@/hooks/useTokenLocker"

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().endOf('day');
};

export const LockerSetup = () => {
  const router = useRouter()
  const { config } = useNotificationConfig()
  const { doContractCall } = useConnect();
  const [amount, setAmount] = useState(0)
  const [percent, setPercent] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [withdrawerAddress, setWithdrawerAddress] = useState("");
  const [memegoatBalance, setMemegoatBalance] = useState<number>(0);
  const [isSelectedOption, setIsSelectedOption] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [noOfBlocks, setNoOfBlocks] = useState<number>(0);
  const defaultPercent = [25, 50, 75, 100]
  const amountRef = useRef(null) as any
  const [vesting, setVestToken] = useState<boolean>(false);
  const { tokenLockerDetails } = useTokenLocker()
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [unvestBlocks, setVestingBlocks] = useState<CsvObject[] | null>(null);
  const [addressInfo, setAddressInfo] = useState<CsvObject[] | null>(
    null,
  );
  const [txData, setTxData] = useState<FinishedTxData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const stxBalance = await fetchSTXBalance()
      setStxBalance(stxBalance);

      const memegoatBalance = await getUserTokenBalance(`${contractAddress}.memegoatstx`);
      console.log(memegoatBalance)
      setMemegoatBalance(memegoatBalance);

      if (tokenLockerDetails) {
        console.log(tokenLockerDetails)
        const balance = await getUserTokenBalance(tokenLockerDetails.tokenAddress)
        setBalance(balance)
      }
    }

    fetchData()
  }, [tokenLockerDetails])

  const getDifferenceInBlocks = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = Date.now();
    const diff = date.getTime() - now;
    if (now > date.getTime()) {
      return 0;
    }
    const diffInSecs = diff / 1000;
    const diffInBlocks = diffInSecs / 600;
    setNoOfBlocks(Number(diffInBlocks.toFixed(0)));
    return diffInBlocks.toFixed(0)
  };

  const handleDateChange = (dateStr: string) => {
    const date = new Date(dateStr)
    setDate(date);
    getDifferenceInBlocks(dateStr);
  };

  const convertTime = (dateObj: Date) => {
    return moment(dateObj).format("LLLL");
  };

  const getDuration = (date: Date) => {
    return moment(date).fromNow(false);
  };

  const feeIsSTx = () => isSelectedOption === 1;

  const feeIsGoatSTX = () => isSelectedOption === 2;


  const handleOptionClick = (index: number) => {
    setIsSelectedOption(index);
  };


  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCanWithdraw(event.target.value === "yes");
  };

  const handleLock = async () => {
    if (!tokenLockerDetails) return;
    setIsProcessing(true);

    const toWithdrawerAddress = canWithdraw
      ? withdrawerAddress
      : getUserPrincipal();

    const tokenAddress = splitToken(tokenLockerDetails.tokenAddress);
    const postConditionCode = FungibleConditionCode.LessEqual;
    const assetContractName = tokenAddress[1];
    const assetName = await getTokenSource(tokenAddress[0], tokenAddress[1]);

    if (assetName === "") {
      config({ message: 'Error with token contract', title: 'Locker', type: 'error' })
      return
    }
    const fungibleAssetInfo = createAssetInfo(
      tokenAddress[0],
      assetContractName,
      assetName,
    );
    const postConditionAmount = BigInt(amount)

    const fungiblePostConditionToken = makeStandardFungiblePostCondition(
      getUserPrincipal(),
      postConditionCode,
      postConditionAmount,
      fungibleAssetInfo,
    );

    const postConditionAmountFee = BigInt(1000000000);

    const fungibleAssetInfoGoat = createAssetInfo(
      contractAddress,
      'memegoatstx',
      'memegoatstx',
    );

    const fungiblePostConditionGOATSTX = makeStandardFungiblePostCondition(
      getUserPrincipal(),
      postConditionCode,
      postConditionAmountFee,
      fungibleAssetInfoGoat,
    );

    const postConditionAddress = getUserPrincipal();
    const postConditionCodeSTX = FungibleConditionCode.LessEqual;
    const postConditionAmountSTX = BigInt(1000000);

    const standardSTXPostCondition = makeStandardSTXPostCondition(
      postConditionAddress,
      postConditionCodeSTX,
      postConditionAmountSTX,
    );

    const blockheight = await fetchCurrNoOfBlocks();

    const unlockBlocksCv = unvestBlocks && vesting ? unvestBlocks.map(data => (tupleCV({
      height: uintCV(Number(getDifferenceInBlocks(data.height)) + blockheight),
      percentage: uintCV(data.percentage),
    }))) : [tupleCV({ height: uintCV(noOfBlocks + blockheight), percentage: uintCV(100) })];

    const addressInfoCv = addressInfo && vesting ? addressInfo.map(data => tupleCV({
      address: standardPrincipalCV(data.address),
      amount: uintCV(Number(data.amount) * 1000000),
      "withdrawal-address": standardPrincipalCV(data.address)
    })) : [tupleCV({ address: standardPrincipalCV(getUserPrincipal()), amount: uintCV(amount), "withdrawal-address": standardPrincipalCV(toWithdrawerAddress) })]

    doContractCall({
      network: networkInstance,
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName: "memegoat-token-locker-v1-1",
      functionName: "lock-token",
      functionArgs: [
        uintCV(amount),
        boolCV(feeIsSTx()),
        contractPrincipalCV(tokenAddress[0], tokenAddress[1]),
        contractPrincipalCV(
          contractAddress,
          "memegoatstx",
        ),
        boolCV(vesting),
        listCV(unlockBlocksCv),
        listCV(addressInfoCv)
      ],
      postConditionMode: PostConditionMode.Deny,
      postConditions: feeIsSTx() ? [fungiblePostConditionToken, standardSTXPostCondition] : [fungiblePostConditionToken, fungiblePostConditionGOATSTX],
      onFinish: (data) => {
        setTxData(data);
        setIsProcessing(false);
        storeDB(data.txId, amount, noOfBlocks, tokenLockerDetails);
        router.push("/locker/userlocks");
      },
      onCancel: () => {
        setIsProcessing(false)
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  return (
    <>
      {tokenLockerDetails &&
        <div className="mb-7">
          <div className="p-4 text-center from-primary-50/15 to-primary-70/20 bg-gradient-to-r text-primary-50 relative overflow-hidden mb-5">
            <span>Token Locker</span>

            <div className="absolute top-0 right-0 text-primary-10/5 text-[5.5rem]">
              <BsLockFill />
            </div>
          </div>

          <div className="bg-[rgba(72,145,90,0.05)] border-0 border-[rgba(16,69,29,0.85)] p-4 md:p-6 backdrop-blur-[12px] text-sm">
            <div className="flex gap-3 items-center mb-5">
              <Avatar src={tokenLockerDetails.image_uri} size={50} />
              <div>
                <h3>{tokenLockerDetails.name}</h3>
                <p className="mb-1 text-sm text-custom-white/60">
                  Balance:{" "}
                  <span className="text-primary-30">
                    {balance.toLocaleString()} {tokenLockerDetails.symbol}
                  </span>
                </p>
              </div>
            </div>

            <div className="my-7 space-y-5">
              <div>
                <p className="text-primary-50 mb-3">Amount of Tokens to Lock</p>
                <div className="">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4 border-[1px] border-primary-100/85 p-1 px-4 grid grid-cols-4 gap-4 from-primary-90/25 to-transparent bg-gradient-to-r">
                      {defaultPercent.map((value) => {
                        const active = value === percent
                        const activeCls = active ? "bg-primary-50/30" : ""
                        return (
                          <p
                            key={value}
                            className={`${activeCls} p-2 flex items-center justify-center cursor-pointer`}
                            onClick={() => {
                              setPercent(value)
                              amountRef.current.value = (value * balance / 100)
                              setAmount(value * balance / 100 * 1e6)
                            }}
                          >
                            {value}%
                          </p>
                        )
                      })}
                    </div>
                    <div className="col-span-2">
                      <input
                        className="outline-none bg-primary-60/10 w-full h-full px-2 border-[1px] border-primary-100/85 placeholder:text-sm"
                        type="number"
                        ref={amountRef}
                        max={balance}
                        placeholder="custom"
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          const percent = (value * 100) / balance
                          setAmount(value * 1e6)
                          setPercent(percent)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <p className="text-primary-50 mb-3">Vest Tokens</p>
                  <Radio.Group
                    defaultValue={false}
                    onChange={(e) => setVestToken(e.target.value)}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </div>
                {!vesting ? (
                  <div>
                    <p className="text-custom-white/60">Unlock Date</p>
                    <div className="from-primary-90/20 to-transparent bg-gradient-to-r  mt-3 text-custom-white/80 p-4 text-sm">
                      <p className="text-primary-20 ">{convertTime(date)}</p>
                      <p className="my-2">{getDuration(date)} - {noOfBlocks}&nbsp;block(s))</p>
                      <DatePicker
                        format="YYYY-MM-DD HH:mm"
                        use12Hours={true}
                        disabledDate={disabledDate}
                        showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
                        className="bg-transparent border-primary-80/85 text-primary-30 w-[50%]"
                        onChange={(_value, dateString) => {
                          handleDateChange(dateString as string)
                        }}
                      />
                    </div>
                    <div className="my-5">
                      <p className="my-3">Who can withdraw the tokens?</p>
                      <Radio.Group
                        onChange={(e) => handleRadioChange(e as never)}
                        defaultValue={"no"}
                      >
                        <Radio value={"yes"}>Someone Else</Radio>
                        <Radio value={"no"}>Me</Radio>
                      </Radio.Group>

                      {canWithdraw && (
                        <Input
                          placeholder="Unlocker Address"
                          className="mt-3"
                          onChange={(e) =>
                            setWithdrawerAddress(e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="from-primary-90/20 to-transparent bg-gradient-to-r  mt-3 text-custom-white/80 p-4 text-sm">
                    <div>
                      <p>Enter Vesting Periods and Percentage</p>
                      <div className="mt-2">
                        <Input type="file" className="bg-transparent" />
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Import
                          </Button>
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Export
                          </Button>
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p>Enter Addresses and Amount Allocated</p>
                      <div className="mt-2">
                        <Input type="file" className="bg-transparent" />
                        <div className="mt-2 grid grid-cols-3 gap-3">
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Import
                          </Button>
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Export
                          </Button>
                          <Button className="w-full bg-transparent border-primary-80 text-primary-50 mb-1">
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t-[1px] border-t-primary-80/35 py-4">
                <p className="text-primary-50 mb-3">Fee Option</p>
                <div className="grid grid-cols-2 gap-4 text-custom-white/60">
                  <div>
                    <Button className={`w-full bg-transparent ${feeIsGoatSTX() && 'border-primary-80'} text-primary-50 mb-1`} onClick={() => handleOptionClick(2)}>
                      GOATSTX
                    </Button>
                    <p>Balance: {formatNumber(memegoatBalance.toFixed(2))}</p>
                  </div>
                  <div>
                    <Button className={`w-full bg-transparent ${feeIsSTx() && 'border-primary-80'} text-primary-50 mb-1`} onClick={() => handleOptionClick(1)}>
                      STX
                    </Button>
                    <p>Balance: {formatBal(stxBalance)}</p>
                  </div>
                </div>
                <p className="mt-5 text-custom-white/60">
                  Once tokens are locked they cannot be withdrawn under any
                  circumstances until the timer has expired. Please ensure the
                  parameters are correct, as they are final.
                </p>
              </div>

              <div className="flex my-4 gap-3 items-center">
                <button
                  className="py-3 border border-primary-80 text-primary-50 hover:border-primary-80 w-full rounded-md"
                  onClick={() => handleLock()}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    "Awaiting Confirmation"
                  ) : txData ? (
                    "Transaction Submitted"
                  ) : (
                    "Lock"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </>

  )
}
