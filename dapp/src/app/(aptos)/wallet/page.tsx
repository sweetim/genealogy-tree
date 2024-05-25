"use client"

import {
  FC,
  useEffect,
  useState,
} from "react"
import {
  formatAptCoin,
  getAptosClient,
} from "@/common/aptosClient"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"

const aptosClient = getAptosClient()

const WalletPage: FC = () => {
  const [ balance, setBalance ] = useState(0)

  const keylessAccount = useEphemeralKeyPairStore(state => state.keylessAccount)

  useEffect(() => {
    async function getWalletBalance() {
      if (!keylessAccount) return

      const balance = await aptosClient.account.getAccountAPTAmount({
        accountAddress: keylessAccount.accountAddress,
      })
      console.log(balance)
      const coinsData = await aptosClient.account.getAccountCoinsData({
        accountAddress: keylessAccount.accountAddress,
      })
      console.log(coinsData)

      setBalance(formatAptCoin(balance))
    }

    getWalletBalance()
  }, [ keylessAccount ])

  return (
    <>
      <h1>{keylessAccount?.accountAddress.toString()}</h1>
      <h2>{balance} APT</h2>
    </>
  )
}

export default WalletPage
