import { getAptosClient } from "@/common/aptosClient"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"
import { AccountAddress } from "@aptos-labs/ts-sdk"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

export type CoinsData = {
  name: string
  symbol: string
  iconUri: string
  amount: number
  decimals: number
}

export type DigitalAssetsData = {
  name: string
  description: string
  imageUri: string
}

const aptosClient = getAptosClient()

const SYMBOL_ICON_URI: Record<string, string> = {
  APT: "/aptos.svg",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
}

export function useAllWalletInfo() {
  const [ coinsData, setCoinsData ] = useState<CoinsData[]>([])
  const [ digitalAssetsData, setDigitalAssetsData ] = useState<DigitalAssetsData[]>([])

  const {
    connected: isWalletConnected,
    account: walletAccount,
    disconnect: walletDisconnect,
  } = useWallet()

  const keylessAccount = useEphemeralKeyPairStore(state => state.keylessAccount)
  const removeKeylessAccount = useEphemeralKeyPairStore(state => state.removeKeylessAccount)
  const isKeylessAccountConnected = useEphemeralKeyPairStore(state => state.isConnected)

  const accountAddress = useMemo(() => {
    if (walletAccount) return AccountAddress.fromString(walletAccount.address)
    if (keylessAccount) return keylessAccount.accountAddress

    return null
  }, [ walletAccount, keylessAccount ])

  useEffect(() => {
    async function getCoinData() {
      if (!accountAddress) return

      const coinsData = await aptosClient.account.getAccountCoinsData({
        accountAddress,
      })

      setCoinsData(coinsData.map(data => {
        const symbol = data.metadata?.symbol || ""
        const iconUri = data.metadata?.icon_uri || SYMBOL_ICON_URI[symbol]

        return {
          name: data.metadata?.name || "",
          symbol,
          iconUri,
          amount: data.amount,
          decimals: data.metadata?.decimals || 0,
        }
      }))
    }

    getCoinData()
  }, [ accountAddress ])

  useEffect(() => {
    async function getDigitalAssetsData() {
      if (!accountAddress) return

      const digitalAssetsData = await aptosClient.account.getAccountOwnedTokens({
        accountAddress,
      })

      setDigitalAssetsData(digitalAssetsData.map(asset => ({
        name: asset.current_token_data?.token_name || "",
        description: asset.current_token_data?.description || "",
        imageUri: asset.current_token_data?.token_uri || "",
      })))
    }

    getDigitalAssetsData()
  }, [ accountAddress ])

  const disconnectAllWallet = useCallback(() => {
    if (keylessAccount) {
      removeKeylessAccount()
    }

    if (walletAccount) {
      walletDisconnect()
    }
  }, [ keylessAccount, walletAccount, walletDisconnect ])

  return {
    isConnected: isWalletConnected || isKeylessAccountConnected,
    isWalletConnected,
    walletAccount,
    isKeylessAccountConnected,
    keylessAccount,
    accountAddress,
    coinsData,
    digitalAssetsData,
    disconnectAllWallet,
  }
}
