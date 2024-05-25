import {
  Divider,
  Space,
} from "antd"
import { FC } from "react"
import KeylessWalletLogin from "./KeylessWalletLogin"
import WalletLogin from "./WalletLogin"

const LoginMethodSelection: FC = () => {
  return (
    <Space direction="vertical" size={[ 32, 32 ]}>
      <p className="text-slate-900">Connect your wallet with us and start growing your family tree</p>
      <KeylessWalletLogin />
      <Divider plain className="!m-0 ">or</Divider>
      <WalletLogin />
    </Space>
  )
}

export default LoginMethodSelection
