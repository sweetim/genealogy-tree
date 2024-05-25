"use client"

import { FC } from "react"
import { Button } from "antd"
import GoogleLogo from "@/icons/GoogleLogo"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"
import { EphemeralKeyPair } from "@aptos-labs/ts-sdk"

const googleRedirectUrl = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || ""
const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

const WalletLoginButton: FC = () => {
  const setEphemeralKeyPair = useEphemeralKeyPairStore(state => state.setEphemeralKeyPair)

  function signInClickHandler() {
    const ephemeralKeyPair = EphemeralKeyPair.generate()
    const redirectUrl = new URL(googleRedirectUrl)
    const searchParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}/callback`,
      response_type: "id_token",
      scope: "openid email profile",
      nonce: ephemeralKeyPair.nonce,
    })

    setEphemeralKeyPair(ephemeralKeyPair)

    redirectUrl.search = searchParams.toString()
    window.location.href = redirectUrl.toString()
  }

  return (
    <Button
      className="!inline-flex !align-middle"
      shape="round"
      onClick={signInClickHandler}
      icon={<GoogleLogo className="w-6 h-6" />}
      size="large"
    >
      Sign in with Google
    </Button>
  )
}

export default WalletLoginButton
