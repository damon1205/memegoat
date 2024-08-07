import { TokenData, TokenDataMeta } from "@/interface";
import { getTokens } from "@velarprotocol/velar-sdk";
import { splitNGetCA } from "./swap";
import { alexSDK, getTokenInfo } from "./velar.data";

export const fetchTokens = async () => {
  const [alexTokens, velarTokens] = await Promise.all([
    alexSDK.fetchSwappableCurrency(),
    getTokens(),
  ]);
  // setAlexTokens(alexTokens);
  // setVelarTokens(velarTokens);
  const vTokens = velarTokens || {};
  const alexTokenMap = new Map(alexTokens.map((token) => [token.name, token]));
  const tokensData: TokenData[] = alexTokens.map((token) => ({
    symbol: token.id,
    name: token.name,
    address: splitNGetCA(token.underlyingToken),
    icon: token.icon,
    decimals: token.name === "ALEX" || "LiALEX" ? token.wrapTokenDecimals : 6,
  }));
  const missingTokens = Object.keys(vTokens).filter(
    (token) => !alexTokenMap.has(token)
  );
  const missingTokenData: TokenDataMeta[] = await Promise.all(
    missingTokens.map(getTokenInfo)
  );
  missingTokenData.forEach((tokenData) => {
    if (tokenData) {
      tokensData.push({
        symbol: tokenData.symbol,
        name: tokenData.name,
        address: tokenData.contract_principal,
        icon: tokenData.image_uri,
        decimals: tokenData.decimals,
      });
    }
  });
  // setAllTokens(tokensData);
  return { alexTokens, velarTokens, tokensData };
};

// const fetchTransactionStatus = useCallback(async () => {
//   try {
//     if (tokenMintProgress.tx_status !== "pending") return
//     setLoading(true)
//     const txn = tokenMintProgress
//     const axiosConfig = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: ApiURLS[network].getTxnInfo + `${txn.tx_id} `,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//     const response = await axios.request(axiosConfig)
//     if (response.data.tx_status !== "pending") {
//       txn.tx_status = response.data.tx_status
//       if (response.data.tx_status === "success") {
//         config({
//           message: `${txn.action} Successful`,
//           title: "Staking",
//           type: "success",
//         })
//         if (!minter) {
//           txn.step = "2"
//         }
//         if (minter) {
//           await uploadCampaign({ ...tokenMintProgress, is_campaign: false })
//           setTokenMintProgress({ ...initialData })
//           form.resetFields()
//         } else {
//           setTokenMintProgress({ ...txn })
//         }
//       } else {
//         config({
//           message: `${txn.action} Failed`,
//           title: "Staking",
//           type: "error",
//         })
//         setTokenMintProgress({ ...txn })
//       }
//       setLoading(false)
//     }
//   } catch (error) {
//     setLoading(false)
//     console.error(error)
//   }
// }, [tokenMintProgress, setTokenMintProgress, minter, form, config])

// useEffect(() => {
//   nextStep()
//   // const interval = setInterval(() => {
//   //   if (tokenMintProgress.tx_status !== "pending") return
//   //   fetchTransactionStatus()
//   // }, 1000)
//   // //Clearing the interval
//   // return () => clearInterval(interval)
// }, [
//   // tokenMintProgress,
//   // fetchTransactionStatus,
//   nextStep
// ])
