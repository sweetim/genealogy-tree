import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react"
import {
  Button,
  Menu,
  Modal,
  Typography,
} from "antd"
import {
  AptosStandardSupportedWallet,
  isRedirectable,
  useWallet,
  Wallet,
  WalletName,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react"
import { WalletOutlined } from "@ant-design/icons"
const { Text } = Typography

type WalletLoginProps = {
  isModalOpen?: boolean
  setModalOpen?: Dispatch<SetStateAction<boolean>>
}

export default function WalletLogin({
  isModalOpen,
  setModalOpen,
}: WalletLoginProps) {
  const [ walletSelectorModalOpen, setWalletSelectorModalOpen ] = useState(false)

  useEffect(() => {
    if (isModalOpen !== undefined) {
      setWalletSelectorModalOpen(isModalOpen)
    }
  }, [ isModalOpen ])

  const { connect, disconnect, account, wallets, connected } = useWallet()

  const onWalletButtonClick = () => {
    if (connected) {
      disconnect()
    } else {
      setWalletSelectorModalOpen(true)
    }
  }

  const onWalletSelected = (wallet: WalletName) => {
    connect(wallet)
    setWalletSelectorModalOpen(false)
    if (setModalOpen) {
      setModalOpen(false)
    }
  }
  const onCancel = () => {
    setWalletSelectorModalOpen(false)
    if (setModalOpen) {
      setModalOpen(false)
    }
  }
  const buttonText = account?.ansName
    ? account?.ansName
    : truncateAddress(account?.address)
  return (
    <>
      <Button
        className="!w-56"
        shape="round"
        onClick={() => onWalletButtonClick()}
        icon={<WalletOutlined />}
        size="large"
      >
        {connected ? buttonText : "Connect using Wallet"}
      </Button>
      <Modal
        title={<div className="text-center text-lg">Connect Wallet</div>}
        centered
        open={walletSelectorModalOpen}
        onCancel={onCancel}
        footer={[]}
        closable={false}
        zIndex={9999}
      >
        {!connected && (
          <Menu>
            {wallets?.map((wallet: Wallet | AptosStandardSupportedWallet) => {
              return walletView(wallet, onWalletSelected)
            })}
          </Menu>
        )}
      </Modal>
    </>
  )
}

const truncateAddress = (address: string | undefined) => {
  if (!address) return
  return `${address.slice(0, 6)}...${address.slice(-5)}`
}

const walletView = (
  wallet: Wallet | AptosStandardSupportedWallet,
  onWalletSelected: (wallet: WalletName) => void,
) => {
  const isWalletReady = wallet.readyState === WalletReadyState.Installed
    || wallet.readyState === WalletReadyState.Loadable

  // The user is on a mobile device
  if (!isWalletReady && isRedirectable()) {
    const mobileSupport = (wallet as Wallet).deeplinkProvider
    // If the user has a deep linked app, show the wallet
    if (mobileSupport) {
      return (
        <Menu.Item
          key={wallet.name}
          onClick={() => onWalletSelected(wallet.name)}
        >
          <div className="flex justify-between text-xl">
            <div className="flex align-middle">
              <img src={wallet.icon} width={25} style={{ marginRight: 10 }} />
              <Text className="text-lg">{wallet.name}</Text>
            </div>
            <Button className="bg-slate-300">
              <Text className="bg-red-200">Connect</Text>
            </Button>
          </div>
        </Menu.Item>
      )
    }
    // Otherwise don't show anything
    return null
  } else {
    // The user is on a desktop device
    return (
      <Menu.Item
        key={wallet.name}
        onClick={wallet.readyState === WalletReadyState.Installed
            || wallet.readyState === WalletReadyState.Loadable
          ? () => onWalletSelected(wallet.name)
          : () => window.open(wallet.url)}
      >
        <div className="flex justify-between text-xl">
          <div className="flex items-center">
            <img src={wallet.icon} width={25} style={{ marginRight: 10 }} />
            <Text className="text-lg">{wallet.name}</Text>
          </div>
          {wallet.readyState === WalletReadyState.Installed
              || wallet.readyState === WalletReadyState.Loadable
            ? (
              <Button className="bg-red-300">
                <Text className="wallet-connect-button-text">Connect</Text>
              </Button>
            )
            : <Text className="items-center pr-5 !text-blue-500">Install</Text>}
        </div>
      </Menu.Item>
    )
  }
}
