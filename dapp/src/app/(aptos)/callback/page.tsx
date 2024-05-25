"use client"

import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import {
  FC,
  useEffect,
  useMemo,
} from "react"
import {
  getAptosClient,
  parseJWTFromURL,
} from "@/common/aptosClient"
import type { KeylessAccountCallbackPayload } from "@/common/aptosClient"
import LoadingGif from "@/modules/common/LoadingGif"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"
import NoSSR from "@/modules/common/NoSSR"

const aptosClient = getAptosClient()

const DeriveKeylessAccount: FC = () => {
  const router = useRouter()

  const ephemeralKeyPairStorage = useEphemeralKeyPairStore(state => state.ephemeralKeyPairStorage)
  const setKeylessAccount = useEphemeralKeyPairStore(state => state.setKeylessAccount)

  const jwt = useMemo(
    () => parseJWTFromURL(window.location.href),
    [ window.location.href ],
  )

  const jwtNonce = useMemo(() => {
    const jwt = parseJWTFromURL(window.location.href)
    if (!jwt) return null

    const payload = jwtDecode<KeylessAccountCallbackPayload>(jwt)
    return payload.nonce
  }, [ jwt ])

  useEffect(() => {
    async function deriveAccount() {
      if (!jwt) return
      if (!jwtNonce) return
      if (!ephemeralKeyPairStorage) return

      const ephemeralKeyPair = ephemeralKeyPairStorage[jwtNonce]

      if (!ephemeralKeyPair) return

      const keylessAccount = await aptosClient.deriveKeylessAccount({
        jwt,
        ephemeralKeyPair,
      })

      setKeylessAccount(keylessAccount)

      router.push("/wallet")
    }

    deriveAccount()
  }, [ jwt, jwtNonce, ephemeralKeyPairStorage ])

  return <LoadingGif />
}

export default function CallbackPage() {
  return (
    <NoSSR>
      <DeriveKeylessAccount />
    </NoSSR>
  )
}
