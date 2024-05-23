"use client"

import { getAptosClient } from "@/common/aptosClient"
import { useKeylessAccount } from "@/modules/connect/KeylessAccountContext"
import { getLocalEphemeralKeyPair } from "@/store/useEphemeralKeyPair"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url)
  const fragment = urlObject.hash.substring(1)
  const params = new URLSearchParams(fragment)
  return params.get("id_token")
}

const aptosClient = getAptosClient()

export default function CallbackPage() {
  const { keylessAccount: ka, setKeylessAccount } = useKeylessAccount()
  async function deriveAccount() {
    const jwt = parseJWTFromURL(window.location.href) || ""

    const payload = jwtDecode<{ nonce: string }>(jwt)
    const jwtNonce = payload.nonce

    const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce)!
    const keylessAccount = await aptosClient.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    })

    const accountCoinsData = await aptosClient.getAccountCoinsData({
      accountAddress: keylessAccount?.accountAddress.toString(),
    })
    // account does not exist yet -> fund it
    if (accountCoinsData.length === 0) {
      try {
        await aptosClient.fundAccount({
          accountAddress: keylessAccount.accountAddress,
          amount: 200000000, // faucet 2 APT to create the account
        })
      } catch (error) {
        console.log("Error funding account: ", error)
      }
    }

    console.log("Keyless Account: ", keylessAccount.accountAddress.toString())
    setKeylessAccount(keylessAccount)
  }

  useEffect(() => {
    deriveAccount()
  }, [])

  useEffect(() => {
    async function getBalance() {
      if (!ka) return

      const balance = await aptosClient.account.getAccountAPTAmount({
        accountAddress: ka?.accountAddress!,
      })

      console.log(balance)

      await aptosClient.fundAccount({
        accountAddress: ka?.accountAddress!,
        amount: 200000000, // faucet 2 APT to create the account
      })

      const balance1 = await aptosClient.account.getAccountAPTAmount({
        accountAddress: ka?.accountAddress!,
      })
      console.log(balance1)
    }
    getBalance()
  }, [ka])

  return (
    <>
      <h2>{JSON.stringify(ka && ka.accountAddress.toString())}</h2>
    </>
  )
}
