"use client"

import {
  Avatar,
  Layout,
  Menu,
  MenuProps,
} from "antd"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react"
import { PetraWallet } from "petra-plugin-wallet-adapter"

import GenealogyTreeLogo from "@/icons/GenealogyTreeLogo"
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
    label: <Link href="/">Genealogy Tree</Link>,
    icon: <GenealogyTreeLogo className="w-6" />,
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
      <Layout className="h-screen">
        <Sider
          collapsedWidth={55}
          collapsible
          defaultCollapsed={true}
        >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" items={menuItems} />
        </Sider>
        {
          /* <Header className="!p-3">
          <Flex className="h-full"
            justify="space-between"
            align="center">
            <Link href="/">
              <GenealogyTreeLogo className="w-12" />
            </Link>
            <WalletSelector />
          </Flex>
        </Header> */
        }
        <Content className="h-full overflow-auto no-scrollbar">
          {children}
        </Content>
      </Layout>
    </AptosWalletAdapterProvider>
  )
}
