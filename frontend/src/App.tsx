import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Flex, Layout } from "antd";

import GenealogyTreeLogo from "./icons/GenealogyTreeLogo";
import GenealogyTreeEditor from "./modules/genealogy-tree/components/GenealogyTreeEditor";

const { Content, Header } = Layout

function App() {
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
      </Content>
    </Layout>
  )
}

export default App
