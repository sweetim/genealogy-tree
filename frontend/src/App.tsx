import { createRef, useEffect, useState } from 'react'

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import FamilyTree from './modules/genealogy-tree/components/GenealogyTree';
import { Button, Flex, Layout } from 'antd';
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { PERSON_INFO } from './data';


const { Content, Header } = Layout

const MODULE_ADDRESS = "0x865dddd118a8e93c4852691fabe7c55f3db4bb67fbc354edeb2b401c7d6d3bc4"

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

type GenealogyTree = {
  childrens: string[],
  id: string,
  parents: string[],
  metadata: GenealogyTreePersonMetadata
}

type GenealogyTreePersonMetadata = {
  name: string,
  age: number,
  date_of_birth: string,
  gender: number,
  date_of_death: string,
  image_uri: string,
  location: string,
}

function App() {
  const { account, signAndSubmitTransaction } = useWallet()
  const [data, setData] = useState<any>();

  async function getGenealogyTree() {
    try {
      const [value] = await aptos.view<GenealogyTree[][]>({
        payload: {
          function: `${MODULE_ADDRESS}::contract::get_genealogy_tree`,
        }
      })
      const output = value.map(v => ({
        name: v.metadata.name,
        children: v.childrens.map(c => ({
          name: value[Number(c)].metadata.name,
          children: value[Number(c)].childrens.map(i => ({
            name: value[Number(i)].metadata.name,
            childrens: []
          }))
        }))
      }))
      setData(output[0])
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    // getGenealogyTree()
  }, [])


  async function populatePersonClickHandler() {
    if (!account) return;
    console.log(account.address)

    const index = 12
    const transaction: InputTransactionData = {
      data: {
        function: `${MODULE_ADDRESS}::contract::register_person`,
        functionArguments: Object.values(PERSON_INFO[index])
      }
    }

    console.log(PERSON_INFO[index])
    try {
      const response: any = await signAndSubmitTransaction(transaction)
      await aptos.waitForTransaction({ transactionHash: response.hash })
    } catch (error) {
      console.log(error)
    }
  }

  async function updatePersonRelationClickHandler() {
    const transaction: InputTransactionData = {
      data: {
        function: `${MODULE_ADDRESS}::contract::update_person_relation`,
        functionArguments: [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          [
            [],
            [0],
            [0],
            [0],
            [0],
            [0],
            [2],
            [2],
            [3],
            [3],
            [4],
            [4],
            [4],
          ],
          [
            [1, 2, 3, 4, 5],
            [],
            [6, 7],
            [8, 9],
            [10, 11, 12],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
          ]
        ]
      }
    }
    try {
      const response: any = await signAndSubmitTransaction(transaction)
      await aptos.waitForTransaction({ transactionHash: response.hash })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout className="h-screen">
      <Header>
        <Flex className="h-full"
          justify="space-between"
          align="center">
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
