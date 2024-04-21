import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { useState } from "react"

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import GenealogyTree from "./modules/genealogy-tree/components/GenealogyTree";
import { Flex, Layout } from "antd";

import GenealogyTreeLogo from "./icons/GenealogyTreeLogo";
import Sider from "antd/es/layout/Sider";
import GenealogyTreeEditor from "./modules/genealogy-tree/components/GenealogyTreeEditor";

const { Content, Header } = Layout

function App() {
  // const { account, signAndSubmitTransaction } = useWallet()
  const [data, setData] = useState<any>();

  return (
    <Layout className="h-screen">
      <Header>
        <Flex className="h-full"
          justify="space-between"
          align="center">
          <GenealogyTreeLogo className="w-12" />
          <WalletSelector />
        </Flex>
      </Header>
        <Content className="h-full">
        <GenealogyTreeEditor />
          {/* */}
        </Content>
{/*
      <Layout className="h-full">
        <Sider className="bg-blue-200">
          Sider
        </Sider>
      </Layout> */}
    </Layout>
  )
}

export default App
