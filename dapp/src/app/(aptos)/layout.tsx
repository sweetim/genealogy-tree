"use client"

import {
  Avatar,
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
} from "antd"

import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react"
import { PetraWallet } from "petra-plugin-wallet-adapter"

import {
  PlusOutlined,
  SmileFilled,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FC,
  ReactNode,
  useMemo,
} from "react"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"

const wallets = [
  new PetraWallet(),
]

const { Sider, Content } = Layout

type MenuItem = Required<MenuProps>["items"][number]

const CollectionLayoutContainter: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const removeKeylessAccount = useEphemeralKeyPairStore(state => state.removeKeylessAccount)
  const keylessAccount = useEphemeralKeyPairStore(state => state.keylessAccount)
  const { account, disconnect, connected } = useWallet()

  const isLogin = useMemo(() => {
    return !!keylessAccount || !!account
  }, [ keylessAccount, account ])

  const menuItems: MenuItem[] = useMemo(() => {
    const loginItems: MenuItem[] = [
      {
        type: "divider",
      },
      {
        key: "/wallet",
        label: <Link href="/wallet">Wallet</Link>,
        icon: <WalletOutlined />,
      },
      {
        key: "/create",
        label: <Link href="/create">Create</Link>,
        icon: <PlusOutlined />,
      },
      {
        key: "profile",
        label: <Link href="/">Profile</Link>,
        icon: <SmileFilled />,
        children: [
          { key: "logout", label: "Logout", onClick: logoutClickHandler },
        ],
      },
    ]

    const nonLoginItems: MenuItem[] = [
      {
        key: "/family",
        className: "!p-0",
        disabled: true,
        label: <Link href="/">Genealogy Tree</Link>,
        icon: (
          <div className="h-full w-[47px] flex items-center justify-center">
            <Avatar className="!p-0" size={40} src="/tree.svg" />
          </div>
        ),
      },
    ]

    if (!isLogin) return nonLoginItems

    return [
      ...nonLoginItems,
      ...loginItems,
    ]
  }, [ isLogin ])

  const activeMenu = useMemo(() => {
    return menuItems.filter(item => item?.key?.toString().includes(pathname))
      .map(item => item?.key?.toString() || "")
  }, [ pathname, menuItems ])

  function logoutClickHandler() {
    if (connected) {
      disconnect()
    }

    if (!!keylessAccount) {
      removeKeylessAccount()
    }
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            triggerBg: "#24272a",
            siderBg: "#24272a",
          },
          Menu: {
            darkItemDisabledColor: "white",
            darkItemBg: "#24272a",
            iconSize: 20,
            darkItemHoverBg: "#282b2e",
            darkItemSelectedBg: "rgb(100 116 139)",
            darkPopupBg: "#24272a",
          },
        },
      }}
    >
      <Layout className="h-screen">
        <Sider
          collapsedWidth={55}
          collapsible
          defaultCollapsed={true}
        >
          <Menu
            className="!mt-3"
            theme="dark"
            mode="vertical"
            selectedKeys={activeMenu}
            items={menuItems}
          />
        </Sider>
        <Content className="h-full overflow-auto no-scrollbar">
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default function CollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <CollectionLayoutContainter>
        {children}
      </CollectionLayoutContainter>
    </AptosWalletAdapterProvider>
  )
}
