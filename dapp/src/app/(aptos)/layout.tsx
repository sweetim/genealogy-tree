"use client";

import { Flex, Layout } from "antd";
import { Header, Content } from "antd/lib/layout/layout";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import Link from "next/link";

import GenealogyTreeLogo from "@/icons/GenealogyTreeLogo";

const wallets = [
  new PetraWallet()
]

export default function CollectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <Layout className="h-screen">
        <Header>
          <Flex className="h-full"
            justify="space-between"
            align="center">
            <Link href="/">
              <GenealogyTreeLogo className="w-12" /></Link>
            <WalletSelector />
          </Flex>
        </Header>
        <Content className="h-full">
          {children}
        </Content>
      </Layout>
    </AptosWalletAdapterProvider>
  )
}
