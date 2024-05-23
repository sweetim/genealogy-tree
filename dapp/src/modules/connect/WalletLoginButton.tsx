"use client"

import { FC } from "react"
import useEphemeralKeyPair from "@/store/useEphemeralKeyPair"

const WalletLoginButton: FC = () => {
  const ephemeralKeyPair = useEphemeralKeyPair()

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      || "1024813723580-i5iqaeqmg1odi6kk6vshcko6dht6rsrm.apps.googleusercontent.com",
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:3000
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs (single-page applications) as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  })
  redirectUrl.search = searchParams.toString()
  return (
    <>
      <a href={redirectUrl.toString()}>
        <button>Sign in with Google</button>
      </a>
    </>
  )
}

export default WalletLoginButton
