"use client"

import {
  getAptosClient,
  parseJWTFromURL,
  validateEphemeralKeyPair,
} from "@/common/aptosClient"
import type { KeylessAccountCallbackPayload } from "@/common/aptosClient"
import LoadingGif from "@/modules/common/LoadingGif"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useMemo,
} from "react"

const aptosClient = getAptosClient()

export default function CallbackPage() {
  const router = useRouter()

  const ephemeralKeyPairStorage = useEphemeralKeyPairStore(state => state.ephemeralKeyPairStorage)
  const removeEphemeralKeyPair = useEphemeralKeyPairStore(state => state.removeEphemeralKeyPair)

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

  const ephemeralKeyPair = useMemo(() => {
    if (!jwtNonce) return
    const ephemeralKeyPair = ephemeralKeyPairStorage[jwtNonce]

    const isJwtNonceValid = validateEphemeralKeyPair(jwtNonce, ephemeralKeyPair)

    if (!isJwtNonceValid) {
      removeEphemeralKeyPair(jwtNonce)
    }

    return isJwtNonceValid
      ? ephemeralKeyPair
      : null
  }, [ jwtNonce ])

  useEffect(() => {
    async function deriveAccount() {
      if (!jwt) return
      if (!ephemeralKeyPair) return

      const keylessAccount = await aptosClient.deriveKeylessAccount({
        jwt,
        ephemeralKeyPair,
      })

      setKeylessAccount(keylessAccount)

      router.push("/wallet")
    }

    deriveAccount()
  }, [ jwt, ephemeralKeyPair ])

  return <LoadingGif />
}
