"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, Button } from "antd"
import { MdOutlineSwapVert } from "react-icons/md"
import { Slippage } from "./Slippage"
import { SelectToken } from "../shared/SelectToken"
import { MdKeyboardArrowDown } from "react-icons/md"
import { useNotificationConfig } from "@/hooks/useNotification"
import { TokenData } from "@/interface"
import { Currency } from "alex-sdk"
import { alexSDK, velarSDK } from "@/utils/velar.data"
import { SwapType } from "@velarprotocol/velar-sdk"
import { appDetails, contractAddress, fetchSTXBalance, getUserPrincipal, getUserTokenBalance, networkInstance, userSession } from "@/utils/stacks.data"
import { checkInAlexName, getAlexRouteId, checkInVelar, calculateSwapVelarMulti, calculateSwapVelar, getAlexName, getAlexTokenAddress, getTokenAddressHiro, splitNGetCA } from "@/utils/swap"
import { storePendingTxn } from "@/lib/contracts/launchpad"
import { splitToken } from "@/utils/helpers"
import { contractPrincipalCV, AnchorMode, uintCV, boolCV, someCV, listCV, noneCV, PostConditionMode, ContractPrincipalCV, UIntCV } from "@stacks/transactions"
import { useConnect } from "@stacks/connect-react"
import { useTokensContext } from "@/provider/Tokens"

export interface out {
  value: number
}

export const Swap = () => {
  const { doContractCall } = useConnect();
  const { velarTokens, alexTokens, allTokens, getTokenMetaBySymbol } = useTokensContext()
  const [token, setToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [amountOut, setAmountOut] = useState<number>(0);

  const [constraint, setConstraint] = useState<number>(0);
  const [velarRoute, setVelarRoutes] = useState<string[][]>([]);
  const [velarRates, setVelarRates] = useState<number[]>([]);
  const [velarMaxIndex, setVelarMaxIndex] = useState<number>(0);
  const [alexRoute, setAlexRoute] = useState<Currency[]>([]);
  const [alexRates, setAlexRates] = useState<number[]>([]);
  const [velarIndex, setVelarIndex] = useState<number>(0);
  const [alexIndex, setAlexIndex] = useState<number>(0);
  const [mode, setMode] = useState<number>(0); // 0 for straight velar swap, 1 for straight alex swap; 2 for velar-alex swap; 3 for alex-velar swap
  const [loading, setLoading] = useState<boolean>(false);
  const fromRef = useRef(null) as any
  const toRef = useRef(null) as any

  const setMax = () => {
    fromRef.current.value = balance
    toRef.current.value = balance
    setAmount(balance)
    setConstraint(Number(balance / 2) + constraint);
    // setTo((prev) => ({ ...prev, amount: balance * tokenRate }))
  }
  const setHalf = () => {
    fromRef.current.value = balance / 2
    setAmount(balance / 2)
    setConstraint(Number(balance / 2) + constraint);
    // setTo((prev) => ({ ...prev, amount: (balance / 2) * tokenRate }))
  }
  const [slippage, setSlippage] = useState<number>(3)

  const [viewRouteDetails, setViewRouteDetails] = useState(false)
  const toggleViewRouteDetails = () => setViewRouteDetails(!viewRouteDetails)

  const { config } = useNotificationConfig()

  const confirmSwap = () => {
    config({
      message:
        "Your swap is currently being processed and should be confirmed within 3-5 minutes. Please be patient as we complete the transaction.",
      title: "Swap request successfully received!",
      type: "success",
      details_link: "/",
    })
  }

  const handleSetFromToken = (token: TokenData) => {
    setToken(token.symbol ? token.symbol : token.name);
    setAmountOut(0);
    setVelarRates([]);
    setAlexRates([]);
    // setToTokens(tokens)
  };

  const handleSetToToken = (token: TokenData) => {
    setToToken(token.symbol ? token.symbol : token.name);
  };

  const getAlexImage = (symbol: string): string => {
    if (!alexTokens) return "";
    const token = alexTokens.find((token) => token.id === symbol);
    return token ? token.icon : "";
  };

  const reset = () => {
    setAlexIndex(0)
    setVelarIndex(0)
    setAlexRoute([])
    setVelarRoutes([])
    setAlexRates([])
    setVelarRates([])
    getRates(0, 0, [], [])
  }

  const switchTokens = async () => {
    if (!token || !toToken) return;
    const token1 = token;
    setToken(toToken);  // Swapping the tokens
    setToToken(token1);
    setAmount(0);
    setAmountOut(0);
    reset();
  };

  const getRates = useCallback(async (alexIndex: number, velarIndex: number, alexRoute: Currency[], velarRoute: string[][]) => {
    if (amount === 0) return;
    const amountToSwap = amount - (amount * 0.002);
    const processVelarRoute = async (inputAmount: number) => {
      if (velarRoute.length === 0) return 0;
      const amounts = [];
      for (const route of velarRoute) {
        let n = 0;
        let last = 1;
        let lastAmount = inputAmount;
        while (n < (route.length - 1)) {
          const swapInstance = await velarSDK.getSwapInstance({
            account: getUserPrincipal(),
            inToken: route[n],
            outToken: route[last],
          });
          const amountOut = await swapInstance.getComputedAmount({
            type: SwapType.ONE,
            amount: lastAmount,
          });
          // const result = (amountOut || {}).value || 0;
          const result = (amountOut as unknown as out).value
          console.log(`Velar ${route[n]} - ${route[last]} = ${result}`);
          last++;
          n++;
          lastAmount = result;
        }
        amounts.push(lastAmount);
      }
      setVelarRates(amounts);
      const maxIndex = amounts.reduce((maxIdx, num, idx, arr) => num > arr[maxIdx] ? idx : maxIdx, 0);
      setVelarMaxIndex(maxIndex)
      const maxAmount = Math.max(...amounts);
      return maxAmount;
    };

    const processAlexRoute = async (inputAmount: number) => {
      if (alexRoute.length === 0) return 0;
      const amounts = [];
      let n = 0;
      let last = 1;
      let lastAmount = BigInt(Math.round(inputAmount * 1e8));
      while (n < (alexRoute.length - 1)) {
        const rate = await alexSDK.getAmountTo(alexRoute[n], lastAmount, alexRoute[last]);
        console.log(`Alex ${alexRoute[n]} - ${alexRoute[last]} = ${rate}`);
        last++;
        n++;
        lastAmount = rate;
      }
      amounts.push(Number(lastAmount.toString()) / 1e8);
      setAlexRates(amounts);
      return Number(lastAmount.toString()) / 1e8;
    };

    if (alexIndex === 1 && velarIndex !== 1) {
      const finalAmountAlex = await processAlexRoute(amountToSwap);
      setMode(1)
      setAmountOut(finalAmountAlex);
    } else if (alexIndex !== 1 && velarIndex === 1) {
      const finalAmountVelar = await processVelarRoute(amountToSwap);
      setMode(0)
      setAmountOut(finalAmountVelar);
    } else if (alexIndex === 3 && velarIndex === 2) {
      const crossAmount = await processVelarRoute(amountToSwap);
      const finalAmount = await processAlexRoute(crossAmount);
      setMode(2)
      setAmountOut(finalAmount);
    } else if (alexIndex === 2 && velarIndex === 3) {
      const crossAmount = await processAlexRoute(amountToSwap);
      const finalAmount = await processVelarRoute(crossAmount);
      setMode(3)
      setAmountOut(finalAmount);
    } else {
      const finalAmountVelar = await processVelarRoute(amountToSwap);
      const finalAmountAlex = await processAlexRoute(amountToSwap);
      if (finalAmountVelar > finalAmountAlex) {
        setMode(0)
      } else {
        setMode(1)
      }
      const maxOut = Math.max(finalAmountVelar, finalAmountAlex)
      setAmountOut(maxOut);
      toRef.current.value = maxOut > 0 ? Number(maxOut).toFixed(5) : 0
    }
  }, [amount]);

  const getRoutes = useCallback(
    async (token: string, toToken: string) => {
      try {
        let velarMatch = 0;
        let velarRoutes: string[][] = [];

        let alexMatch = 0;
        let alexRoutes: Currency[] = [];
        console.log(token, toToken);

        if (checkInAlexName(token, alexTokens) && checkInAlexName(toToken, alexTokens)) {
          const fromId = getAlexRouteId(token, alexTokens);
          const toId = getAlexRouteId(toToken, alexTokens);
          if (fromId && toId) {
            alexRoutes = await alexSDK.getRouter(fromId, toId);
            alexMatch = 1;
          }
        } else if (checkInAlexName(token, alexTokens)) {
          if (token !== 'STX') {
            const fromId = getAlexRouteId(token, alexTokens);
            const toId = getAlexRouteId('STX', alexTokens)
            if (fromId) {
              alexMatch = 2;
              alexRoutes = await alexSDK.getRouter(fromId as Currency, toId as Currency)
            }
          } else {
            setAlexRoute([])
            setAlexIndex(0)
          }

        } else if (checkInAlexName(toToken, alexTokens)) {
          if (toToken !== 'STX') {
            const fromId = getAlexRouteId('STX', alexTokens)
            const toId = getAlexRouteId(toToken, alexTokens);
            if (toId) {
              alexMatch = 3;
              alexRoutes = await alexSDK.getRouter(fromId as Currency, toId as Currency)
            }
          } else {
            setAlexRoute([])
            setAlexIndex(0)
          }
        }
        if (
          checkInVelar(token, velarTokens) && checkInVelar(toToken, velarTokens)
        ) {
          velarRoutes = await calculateSwapVelarMulti(token, toToken);
          velarMatch = 1;
        } else if (checkInVelar(token, velarTokens)) {
          if (token !== 'STX') {
            velarRoutes = [await calculateSwapVelar(token, 'STX')];
            velarMatch = 2
          } else {
            setVelarRoutes([])
            setVelarIndex(0)
          }
        } else if (checkInVelar(toToken, velarTokens)) {
          console.log(toToken)
          if (toToken !== 'STX') {
            velarRoutes = [await calculateSwapVelar('STX', toToken)];
            velarMatch = 3
          } else {
            setVelarRoutes([])
            setVelarIndex(0)
          }
        }

        console.log(alexMatch, velarMatch)
        console.log(velarRoutes, alexRoutes)
        setVelarIndex(velarMatch);
        setVelarRoutes(velarRoutes);
        setAlexIndex(alexMatch);
        setAlexRoute(alexRoutes)
      } catch (e) {
        console.log(e);
      }
    },
    [alexTokens, velarTokens],
  );

  async function swapVelar(amount: number, minAmtOut: number, route: string[]) {
    if (!userSession.isUserSignedIn()) return;
    if (!token) return;
    const cvRoutes = route.map(token => {
      const split = splitToken(token);
      return contractPrincipalCV(split[0], split[1])
    })
    // return (console.log("Velar Swap", amount * 1e6, minAmtOut * 1e6, cvRoutes)) 0.0
    const min = minAmtOut - (minAmtOut * slippage / 100)
    const feeToken = cvRoutes[0]
    doContractCall({
      network: networkInstance,
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName: "memegoat-aggregator-v1-1",
      functionName: "dex-swap",
      functionArgs: [
        uintCV(Math.round(amount * 1e6)),
        uintCV(Math.round(min * 1e6)),
        contractPrincipalCV(contractAddress, 'velar-aggregator-v1'),
        boolCV(false),
        feeToken,
        someCV(listCV(cvRoutes)),
        noneCV(),
        noneCV()
      ],
      appDetails,
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      onFinish: (data) => {
        console.log(data)
        storePendingTxn(
          `Swap ${token} - ${toToken}`,
          data.txId,
          amount.toString(),
        );
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  async function swapAlex(amount: number, minAmtOut: number, route: string[], factors: number[]) {
    if (!userSession.isUserSignedIn()) return;
    if (!token) return;
    const cvRoutes = route.map(token => {
      const split = splitToken(token);
      return contractPrincipalCV(split[0], split[1])
    })

    const cvFactors = factors.slice(0, factors.length - 1).map(factor => {
      return uintCV(factor);
    })

    const min = minAmtOut - (minAmtOut * slippage / 100)
    const feeToken = cvRoutes[0]

    // return (console.log("Alex swap", amount * 1e8, minAmtOut * 1e8, cvRoutes, cvFactors))
    doContractCall({
      network: networkInstance,
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName: "memegoat-aggregator-v1-1",
      functionName: "dex-swap",
      functionArgs: [
        uintCV(Math.round(amount * 1e8)),
        uintCV(Math.round(min * 1e8)),
        contractPrincipalCV(contractAddress, 'alex-aggregator-v1'),
        boolCV(true),
        feeToken,
        noneCV(),
        someCV(listCV(cvRoutes)),
        someCV(listCV(cvFactors))
      ],
      appDetails,
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      onFinish: (data) => {
        console.log(data)
        storePendingTxn(
          `Swap ${token} - ${toToken}`,
          data.txId,
          amount.toString(),
        );
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  async function crossSwap(
    amount: number,
    minAmountOut: number,
    dex1: ContractPrincipalCV,
    dex2: ContractPrincipalCV,
    fromAlex: boolean,
    toAlex: boolean,
    factors: UIntCV[],
    velarRoute: ContractPrincipalCV[],
    alexRoute: ContractPrincipalCV[],
  ) {
    if (!userSession.isUserSignedIn()) return;
    if (!token) return;
    // return (console.log("cross swap", fromAlex ? amount * 1e8 : amount * 1e6, toAlex ? minAmountOut * 1e8 : minAmountOut * 1e6, dex1, dex2, fromAlex, toAlex, factors, velarRoute, alexRoute))
    const min = minAmountOut - (minAmountOut * slippage / 100)
    const feeToken = fromAlex ? alexRoute[0] : velarRoute[0]
    doContractCall({
      network: networkInstance,
      anchorMode: AnchorMode.Any,
      contractAddress,
      contractName: "memegoat-aggregator-v1-1",
      functionName: "cross-dex-swap",
      functionArgs: [
        uintCV(fromAlex ? Math.round(amount * 1e8) : Math.round(amount * 1e6)),
        uintCV(toAlex ? Math.round(min * 1e8) : Math.round(min * 1e6)),
        dex1,
        dex2,
        boolCV(fromAlex),
        boolCV(toAlex),
        feeToken,
        uintCV(slippage * 10000),
        someCV(listCV(factors)),
        someCV(listCV(velarRoute)),
        someCV(listCV(alexRoute)),
        noneCV()
      ],
      appDetails,
      postConditionMode: PostConditionMode.Allow,
      postConditions: [],
      onFinish: (data) => {
        console.log(data)
        storePendingTxn(
          `Swap ${token} - ${toToken}`,
          data.txId,
          amount.toString(),
        );
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  const swap = async () => {
    if (!token) return;
    if (!toToken) return;
    setLoading(true)
    try {
      if (mode === 0) {
        const route = velarRoute[velarMaxIndex];
        const routeAddresses = await Promise.all(route.map(async (symbol) => {
          const tokenData = getTokenMetaBySymbol(symbol)
          if (tokenData) {
            return tokenData.address
          } else {
            const address = await getTokenAddressHiro(symbol);
            return address
          }
        }))
        const minAmountOut = Math.max(...velarRates);
        await swapVelar(amount, minAmountOut, routeAddresses);
      } else if (mode === 1) {
        const route = alexRoute;
        const routeAddresses = route.map(symbol => {
          const address = getAlexTokenAddress(symbol, alexTokens);
          return address
        })
        const routeFactors = route.map(() => {
          return 1e8
        })
        const minAmountOut = Math.max(...alexRates);
        await swapAlex(amount, minAmountOut, routeAddresses, routeFactors)
        // await getQuoteAlex(amount, routeAddresses, routeFactors)
      } else if (mode === 2) {
        const route = velarRoute[velarMaxIndex];
        const velarRouteAddresses = await Promise.all(route.map(async (symbol) => {
          const tokenData = getTokenMetaBySymbol(symbol);
          let address: string;
          if (tokenData) {
            address = tokenData.address
          } else {
            address = await getTokenAddressHiro(symbol)
          }
          const split = splitToken(address);
          return contractPrincipalCV(split[0], split[1]);
        }))

        const alexRouteAddresses = alexRoute.map(symbol => {
          const address = getAlexTokenAddress(symbol, alexTokens);
          const split = splitToken(address);
          return contractPrincipalCV(split[0], split[1]);
        })
        const routeFactors = alexRoute.slice(0, alexRoute.length - 1).map(() => {
          return uintCV(1e8)
        })
        const minAmountOut = Math.max(...alexRates);
        await crossSwap(
          amount,
          minAmountOut,
          contractPrincipalCV(contractAddress, 'velar-aggregator-v1'),
          contractPrincipalCV(contractAddress, 'alex-aggregator-v1'),
          false,
          true,
          routeFactors,
          velarRouteAddresses,
          alexRouteAddresses
        )
      } else if (mode === 3) {
        const route = velarRoute[velarMaxIndex];
        const velarRouteAddresses = await Promise.all(route.map(async (symbol) => {
          const tokenData = getTokenMetaBySymbol(symbol);
          let address: string;
          if (tokenData) {
            address = tokenData.address
          } else {
            address = await getTokenAddressHiro(symbol)
          }
          const split = splitToken(address);
          return contractPrincipalCV(split[0], split[1]);
        }))
        const alexRouteAddresses = alexRoute.map(symbol => {
          const address = getAlexTokenAddress(symbol, alexTokens);
          const split = splitToken(address);
          return contractPrincipalCV(split[0], split[1]);
        })
        const routeFactors = alexRoute.slice(0, alexRoute.length - 1).map(() => {
          return uintCV(1e8)
        })
        const minAmountOut = Math.max(...velarRates);
        await crossSwap(
          amount,
          minAmountOut,
          contractPrincipalCV(contractAddress, 'alex-aggregator-v1'),
          contractPrincipalCV(contractAddress, 'velar-aggregator-v1'),
          true,
          false,
          routeFactors,
          velarRouteAddresses,
          alexRouteAddresses
        )
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token?.toLowerCase() === 'stx') {
        const stxBalance = await fetchSTXBalance()
        setBalance(stxBalance)
      } else {

        const tokenData = allTokens.find(tokenData => tokenData.name === token);

        if (tokenData) {
          const balance = await getUserTokenBalance(tokenData.address);
          setBalance(balance)
        }
      }
    }
  }, [token, allTokens])


  useEffect(() => {
    if (token && toToken) {
      getRoutes(token, toToken)
    }
  }, [token, toToken, getRoutes])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (constraint || (alexRoute && velarRoute && alexIndex && velarIndex)) {
        getRates(alexIndex, velarIndex, alexRoute, velarRoute)
      }
    }, 3000)
    return () => clearTimeout(delay)
  }, [alexRoute, velarRoute, getRates, alexIndex, velarIndex, constraint])

  const check1 = () => !(alexIndex == 2 && velarIndex === 1);

  const check3 = () => !(alexIndex == 3 && velarIndex === 1);

  const check2 = () => !(alexIndex == 1 && velarIndex === 3);

  const check4 = () => !(alexIndex == 1 && velarIndex === 2);


  return (
    <React.Fragment>
      <motion.div className="relative md:w-[450px] w-full mx-auto transition-all">
        <div className="w-full p-4  from-primary-100/25 to-primary-100/40 bg-gradient-to-r relative border-[1px] border-primary-100 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-lg">Swap</p>
            <Slippage
              {...{
                ...{
                  slippage,
                  setSlippage,
                },
              }}
            />
          </div>

          <div className="from-[#03DE5305] to-[#00FF1A29] bg-gradient-to-r rounded-lg  mt-3 text-custom-white/80 py-4 border-[1px] border-primary-100/60">
            <div className="flex gap-3 items-center justify-between px-4">
              <p className="text-xs">You pay</p>
              <div className="flex items-center gap-2">
                <button
                  className="text-white text-sm bg-[#0FFF671A] rounded-xl border-[1px] border-[#0FFF6714] py-1 px-3"
                  onClick={setHalf}
                >
                  50%
                </button>
                <button
                  className="text-white text-sm bg-[#0FFF671A] rounded-xl border-[1px] border-[#0FFF6714] py-1 px-3"
                  onClick={setMax}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between p-2 px-4">
              <input
                className="w-[170px] bg-transparent border-0 outline-none text-[36px] text-white font-semibold placeholder:text-white"
                type="number"
                inputMode="decimal"
                maxLength={5}
                pattern="^[0-9]*[.]?[0-9]*$"
                step=".01"
                placeholder="0.00"
                onChange={(e) => {
                  const value = e.target.value;
                  setAmount(Number(value))
                  setConstraint(Number(value) + constraint);
                }}
                ref={fromRef}
              />
              <div className="px-2 py-2 rounded-lg bg-[#00000033] border-[1px] border-[#FFFFFF1A]">
                <SelectToken tokens={allTokens} action={handleSetFromToken} />
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between px-4 mb-1">
              <p className="text-xs">
                {/* ~ ${Number(from.amount * dollarRate).toLocaleString()} */}
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-white">
                  <span className="text-sm mr-2 text-white/50">Balance:</span>
                  {balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center -mt-3">
            <Avatar
              className="bg-[#1AC05799] border-1 border-[#1AC057CC] shadow-xl cursor-pointer"
              size={40}
            >
              <MdOutlineSwapVert className="text-4xl text-custom-white" />
            </Avatar>
          </div>
          <div className="from-[#03DE5305] to-[#00FF1A29] bg-gradient-to-r rounded-lg  -mt-3 text-custom-white/60 py-4 border-[1px] border-primary-100/60">
            <div className="flex gap-3 items-center justify-between px-4">
              <p className="text-xs">You get</p>
              <div></div>
            </div>

            <div className="flex gap-3 items-center justify-between p-2 px-4">
              <input
                className="w-[170px] bg-transparent border-0 outline-none text-[36px] text-white font-semibold placeholder:text-white"
                type="number"
                inputMode="decimal"
                maxLength={5}
                pattern="^[0-9]*[.]?[0-9]*$"
                step=".01"
                placeholder="0.00"
                onChange={() => {
                  // setTo((prev) => ({ ...prev, amount: Number(e.target.value) }))
                  // setFrom((prev) => ({
                  //   ...prev,
                  //   amount: Number(e.target.value) / tokenRate,
                  // }))
                  // fromRef.current.value = Number(e.target.value) / tokenRate
                }}
                ref={toRef}
              />
              <div className="px-2 py-2 rounded-lg bg-[#00000033] border-[1px] border-[#FFFFFF1A]">
                <SelectToken tokens={allTokens} action={handleSetToToken} />
              </div>
            </div>

            <div className="flex gap-3 items-center justify-between px-4 mb-1">
              <p className="text-xs">
                {/* ~ ${Number(to.amount * dollarRate).toLocaleString()} */}
              </p>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-white">
                  <span className="text-sm mr-2 text-white/50">Balance:</span>0
                </p>
              </div>
            </div>
          </div>
          <div className="my-3">
            <Button
              className="w-full h-[43px] rounded-lg"
              size="large"
              type="primary"
              onClick={() => swap()}
            >
              Confirm Swap
            </Button>
            <p className="py-2 text-sm">
              {token && `1 ${token} ≈`}{" "}
              {toToken &&
                `${(amountOut / amount).toFixed(10)} ${toToken}`}
            </p>
            <motion.div
              className="text-primary-40 inline-flex gap-1 items-center cursor-pointer"
              onClick={toggleViewRouteDetails}
            >
              <p className="">
                {viewRouteDetails ? "hide details" : "view details"}
              </p>
              <MdKeyboardArrowDown size={20} />
            </motion.div>
          </div>

          {viewRouteDetails && (
            <div className="from-primary-60/5 to-primary-60/40 bg-gradient-to-r rounded-lg  mt-3 text-custom-white/60 px-4 p-2 text-sm">
              <p>Route Details</p>
              <>
                {alexIndex === 3 && velarIndex == 2 ?
                  (<>
                    {velarRoute.length > 0 && (
                      <div className="font-medium text-[16px] mb-5 mt-7 text-[#F4F3EE]">
                        Velar Routes: {velarRoute.map((route, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {index + 1}. {" "}
                              {route.map((step) => (
                                `${step}>`
                              ))}
                            </span>
                            <span>
                              {velarRates[index] &&
                                <>
                                  {velarRates[index]}{" "}{route[route.length - 1]}
                                </>
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {alexRoute.length > 0 && (
                      <div className="font-medium text-[16px] mb-5 mt-7 text-[#F4F3EE]">
                        Alex Route:
                        <div className="flex justify-between">
                          <span> 1. {alexRoute.map((route) => (
                            `${getAlexName(route, alexTokens)}>`
                          ))}</span>
                          {alexRates[0] &&
                            <>
                              {Number(alexRates[0])}{" "}{getAlexName(alexRoute[alexRoute.length - 1], alexTokens)}
                            </>
                          }
                        </div>
                      </div>
                    )}

                  </>) : (<>

                    {alexRoute.length > 0 && check1() && check3() && (
                      <div className="font-medium text-[16px] mb-5 mt-7 text-[#F4F3EE]">
                        Alex Route:
                        <div className="flex justify-between">
                          <span> 1. {alexRoute.map((route) => (
                            `${getAlexName(route, alexTokens)}>`
                          ))}</span>
                          {alexRates[0] &&
                            <>
                              {Number(alexRates[0])}{" "}{getAlexName(alexRoute[alexRoute.length - 1], alexTokens)}
                            </>
                          }
                        </div>
                      </div>
                    )}

                    {velarRoute.length > 0 && check2() && check4() && (
                      <div className="font-medium text-[16px] mb-5 mt-7 text-[#F4F3EE]">
                        Velar Routes: {velarRoute.map((route, index) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {index + 1}. {" "}
                              {route.map((step) => (
                                `${step}>`
                              ))}
                            </span>
                            <span>
                              {velarRates[index] &&
                                <>
                                  {velarRates[index]}{" "}{route[route.length - 1]}
                                </>
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>)
                }
              </>
            </div>
          )}

          <div className="mt-3 text-custom-white/60 text-sm">
            <div className="mt-2">
              <div className="flex gap-3 items-center justify-between py-1">
                <p>Minimum Output</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">{amountOut} {toToken}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Slippage Tolerance</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-primary-20">{slippage}%</p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Liquidity Provider Fee</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">
                    {token && (Number(amount) * (0.3 / 100)).toFixed(4)}{" "}
                    {token && token}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center justify-between py-1">
                <p>Route</p>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-white">
                    {token} {">"} {toToken}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  )
}
