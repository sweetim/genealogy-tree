import { createRef, useEffect, useState } from 'react'

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

import FamilyTree from './components/FamilyTree';
import { Button } from 'antd';
import { InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

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
  const [ data, setData ] = useState<any>();

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
    getGenealogyTree()
  }, [])


  async function populatePersonClickHandler() {
    if (!account) return;
    console.log(account.address)

    const PERSON_INFO = [
      {
        name: "loh kam chew",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1921-01-01",
        date_of_death: "1981-01-01",
        age: 60
      },
      {
        name: "loh wai meng",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1961-01-01",
        date_of_death: "",
        age: 63
      },
      {
        name: "loh wai keen",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 2,
        date_of_birth: "1963-01-01",
        date_of_death: "",
        age: 61
      },
      {
        name: "loh wai sum",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1965-01-01",
        date_of_death: "",
        age: 59
      },
      {
        name: "loh wai weng",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1967-01-01",
        date_of_death: "",
        age: 57
      },

      {
        name: "loh wai mei",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 2,
        date_of_birth: "1969-01-01",
        date_of_death: "",
        age: 55
      },
      {
        name: "ho swee leong",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1980-01-01",
        date_of_death: "",
        age: 44
      },
      {
        name: "ho swee tim",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "1990-01-01",
        date_of_death: "",
        age: 34
      },
      {
        name: "loh jin xiang",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "2000-01-01",
        date_of_death: "",
        age: 24
      },
      {
        name: "loh jin hoong",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 1,
        date_of_birth: "2002-01-01",
        date_of_death: "",
        age: 22
      },
      {
        name: "loh kai li",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 2,
        date_of_birth: "2002-01-01",
        date_of_death: "",
        age: 22
      },
      {
        name: "loh kai syuen",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 2,
        date_of_birth: "2005-01-01",
        date_of_death: "",
        age: 19
      },
      {
        name: "loh kai tyng",
        location: "MY",
        image_uri: "https:://google.com",
        gender: 2,
        date_of_birth: "2005-01-01",
        date_of_death: "",
        age: 19
      }
    ]

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
    const PERSON_INFO = [
      {
        person_indexs: 0,
        parents: [],
        childrens: [1, 2, 3, 4, 5]
      },
      {
        person_indexs: 1,
        parents: [0],
        childrens: []
      },
      {
        person_indexs: 2,
        parents: [0],
        childrens: [6, 7]
      },
      {
        person_indexs: 3,
        parents: [0],
        childrens: [8, 9]
      },
      {
        person_indexs: 4,
        parents: [0],
        childrens: [10, 11, 12]
      },
      {
        person_indexs: 5,
        parents: [0],
        childrens: []
      },
      {
        person_indexs: 6,
        parents: [2],
        childrens: []
      },
      {
        person_indexs: 7,
        parents: [2],
        childrens: []
      },
      {
        person_indexs: 8,
        parents: [3],
        childrens: []
      },
      {
        person_indexs: 9,
        parents: [3],
        childrens: []
      },
      {
        person_indexs: 10,
        parents: [4],
        childrens: []
      },
      {
        person_indexs: 11,
        parents: [4],
        childrens: []
      },
      {
        person_indexs: 12,
        parents: [4],
        childrens: []
      },
    ]

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
    <div  style={{ width: '100%', height: '100vh' }}>
      <WalletSelector />
      <Button onClick={populatePersonClickHandler}>Populate persons</Button>
      <Button onClick={updatePersonRelationClickHandler}>Update persons relation</Button>
      {data && <FamilyTree data={data}></FamilyTree>}
    </div>
  )
}

export default App
