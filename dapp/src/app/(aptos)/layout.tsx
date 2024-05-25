"use client"

import {
  Avatar,
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
} from "antd"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { PetraWallet } from "petra-plugin-wallet-adapter"

import {
  PlusOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons"
import Link from "next/link"

const wallets = [
  new PetraWallet(),
]

const { Sider, Content } = Layout

type MenuItem = Required<MenuProps>["items"][number]

const menuItems: MenuItem[] = [
  {
    key: "0",
    className: "!p-0",
    disabled: true,
    label: <Link href="/">Genealogy Tree</Link>,
    icon: (
      <div className="h-full w-[47px] flex items-center justify-center">
        <Avatar className="!p-0" size={40} src="/tree.svg" />
      </div>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "2",
    label: <Link href="/wallet">Wallet</Link>,
    icon: <WalletOutlined />,
  },
  {
    key: "3",
    label: <Link href="/create">Create</Link>,
    icon: <PlusOutlined />,
  },
]

export default function CollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              triggerBg: "#24272a",
              siderBg: "#24272a",
              // triggerColor: ",
            },
            Menu: {
              darkItemDisabledColor: "white",
              darkItemBg: "#24272a",
              iconSize: 20,
              darkItemHoverBg: "#282b2e",
              darkItemSelectedBg: "rgb(100 116 139)",
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
              mode="inline"
              defaultSelectedKeys={[ "2" ]}
              items={menuItems}
            />
          </Sider>
          <Content className="h-full overflow-auto no-scrollbar">
            {children}
          </Content>
        </Layout>
      </ConfigProvider>
    </AptosWalletAdapterProvider>
  )
}
