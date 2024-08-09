import axios from 'axios';
import { NFTStorage } from 'nft.storage';
import { getContractLink, getUserPrincipal, network, traitAddress, userSession } from './stacks.data';
import { callReadOnlyFunction, cvToValue, StandardPrincipalCV } from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { cvValue, TX, } from '@/interface';
import { PutFileOptions, Storage } from "@stacks/storage";
import config from './config';
import moment from 'moment';
import SHA256 from 'crypto-js/sha256';
import { enc, HmacSHA512 } from 'crypto-js';
import { instance } from './api';
export interface MetadataI {
  name: string,
  description: string,
  image: string
}
export function isNotNull<T>(input: T | undefined | null): input is T {
  return input != null;
}

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

export const getAddress = (address: StandardPrincipalCV) => {
  return (address as unknown as cvValue).value;
};


export async function uploadToIPFS(data: Blob): Promise<string> {
  const client = new NFTStorage({ token: config.NFT_META_KEY });
  const cid = await client.storeBlob(data)
  return cid;
}

export async function uploadToGaia(filename: string, data: string | Uint8Array | ArrayBufferView | Blob, type: string): Promise<string> {
  if (!userSession.isUserSignedIn()) return "";
  const putFileOptions: PutFileOptions = {
    contentType: type,
    encrypt: false,
    dangerouslyIgnoreEtag: true,
  }
  const storage = new Storage({ userSession });
  const fileUrl = await storage.putFile(filename, data, putFileOptions);
  return fileUrl;
}

function extractFungibleTokenText(source: string): string {
  const regex = /\(define-fungible-token\s+([^)]+)\)/;
  const match = source.match(regex);
  return match ? match[1].trim() : "";
}

export const getTokenSource = async (address: string, contractName: string) => {
  console.log(address, contractName)
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: getContractLink(network, address, contractName),
      headers: {
        "Content-Type": "application/json",
        'x-api-key': 'b28d0f9f8fe9fefa3b3c2f952643ecb2'
      },
    };
    const response = await axios.request(config);
    const name = extractFungibleTokenText(response.data.source);
    return name;
  } catch (error) {
    console.error(error);
    return ""
  }
}

function extractIpfsHash(url: string): string | null {
  const ipfsPattern = /\/ipfs\/([a-zA-Z0-9]+)$/;
  const match = url.match(ipfsPattern);
  return match ? match[1] : null;
}

export const getTokenURI = async (token: string, networkInstance: StacksNetwork) => {
  const tokens = splitToken(token);
  const result = await callReadOnlyFunction({
    contractAddress: tokens[0],
    contractName: tokens[1],
    functionName: "get-token-uri",
    functionArgs: [],
    senderAddress: getUserPrincipal(),
    network: networkInstance,
  });
  let uri = (cvToValue(result).value as unknown as cvValue).value;

  if (uri.includes('ipfs')) {
    uri = cleanIPFS(uri);
  }
  const metadata = loadMetadata(uri)
  return metadata
}

export const cleanIPFS = (uri: string) => {
  const match = extractIpfsHash(uri);
  if (match) {
    return `https://nftstorage.link/ipfs/${match}`
  }
  return uri
}

export const loadMetadata = async (url: string) => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.request(config);
    return response.data as MetadataI;
  } catch (error) {
    console.error(error);
    return { name: "", description: "", image: "" }
  }
}

export const getToken = async (address: string, contractName: string) => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: getContractLink(network, address, contractName),
      headers: {
        "Content-Type": "application/json",
        'x-api-key': '10a0b6d06387564651f3c26a75474a82'
      },
    };
    const response = await axios.request(config);
    const name = extractFungibleTokenText(response.data.source);
    return name;
  } catch (error) {
    console.error(error);
    return ""
  }
}

export const splitToken = (pair: string) => {
  const data = pair.split(".");
  return data;
};

export const getDuration = (date: Date) => {
  return moment(date).fromNow(false);
};

export function generateContract(token_name: string, token_uri: string, token_ticker: string, token_supply: string) {
  token_supply = (Number(token_supply) * 1000000).toString();
  return (
    `
;; ---------------------------------------------------------
;; ${token_name.toUpperCase()} Token
;; ---------------------------------------------------------

(impl-trait '${traitAddress(network)}.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token ${token_ticker})

(define-constant contract-owner tx-sender)

(define-data-var token-uri (optional (string-utf8 256)) (some u"${token_uri}"))

(define-constant ERR_NOT_AUTHORIZED (err u1000))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_NOT_AUTHORIZED)
    (try! (ft-transfer? ${token_ticker} amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-balance (owner principal))
  (ok (ft-get-balance ${token_ticker} owner))
)

(define-read-only (get-name)
  (ok "${token_name}")
)

(define-read-only (get-symbol)
  (ok "${token_ticker}")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply ${token_ticker}))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (set-token-uri (value (string-utf8 256)))
  (if (is-eq tx-sender contract-owner)
    (ok (var-set token-uri (some value)))
    (err ERR_NOT_AUTHORIZED)
  )
)

(define-public (send-many (recipients (list 1000 { to: principal, amount: uint, memo: (optional (buff 34)) })))
  (fold check-err (map send-token recipients) (ok true))
)

(define-private (check-err (result (response bool uint)) (prior (response bool uint)))
  (match prior ok-value result err-value (err err-value))
)

(define-private (send-token (recipient { to: principal, amount: uint, memo: (optional (buff 34)) }))
  (send-token-with-memo (get amount recipient) (get to recipient) (get memo recipient))
)

(define-private (send-token-with-memo (amount uint) (to principal) (memo (optional (buff 34))))
  (let ((transferOk (try! (transfer amount tx-sender to memo))))
    (ok transferOk)
  )
)

(begin
  (try! (ft-mint? ${token_ticker} u${token_supply} contract-owner))
)
`
  )
}

export function genHex(input: string) {
  const hash = SHA256(input);
  const hexString = hash.toString(enc.Hex);
  return hexString
}

export function hashTransaction(tx: TX) {
  const hash = HmacSHA512(JSON.stringify(tx), config.WEBHOOK_SECRET);
  const hexString = hash.toString(enc.Hex);
  return hexString
}
