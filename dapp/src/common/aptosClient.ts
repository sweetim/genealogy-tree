import {
  Aptos,
  AptosConfig,
  EphemeralKeyPair,
  Network,
} from "@aptos-labs/ts-sdk"

export type KeylessAccountCallbackPayload = {
  nonce: string
}

const NETWORK = Network.TESTNET
const APT_COIN_DECIMAL = 8

export function getAptosClient() {
  const aptosConfig = new AptosConfig({ network: NETWORK })
  const aptos = new Aptos(aptosConfig)

  return aptos
}

export function getAptosExplorerUrl(account: string): string {
  return `https://explorer.aptoslabs.com/account/${account}?network=${NETWORK}`
}

export const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url)
  const fragment = urlObject.hash.substring(1)
  const params = new URLSearchParams(fragment)
  return params.get("id_token")
}

export const validateEphemeralKeyPair = (
  nonce: string,
  ephemeralKeyPair: EphemeralKeyPair,
): boolean => {
  const isExpired = ephemeralKeyPair.expiryDateSecs > BigInt(Math.floor(Date.now() / 1000))
  const isNonceEqual = nonce === ephemeralKeyPair.nonce

  return isExpired && isNonceEqual
}

export const formatAptCoin = (input: number): number => {
  return input / Math.pow(10, APT_COIN_DECIMAL)
}
