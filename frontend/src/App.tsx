import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { createRef, useEffect, useState } from 'react'


import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import FamilyTree from './modules/genealogy-tree/components/GenealogyTree';
import { Button, Flex, Layout } from 'antd';
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';

import GenealogyTreeLogo from './icons/GenealogyTreeLogo';


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
        <FamilyTree data={data} />
      </Content>
    </Layout>
  )
}

export default App
