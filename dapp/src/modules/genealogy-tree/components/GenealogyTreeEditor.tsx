"use client"

import {
  FC,
  useEffect,
  useState,
} from "react"
import {
  Button,
  Card,
  Col,
  Flex,
  Row,
} from "antd"
import {
  ExportOutlined,
  SaveOutlined,
} from "@ant-design/icons"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import * as diff from "fast-array-diff"
import { isEqual } from "lodash"

import { GenealogyTree } from "./editor-panel"
import PersonListEditor from "./person-panel/PersonListEditor"
import {
  getAllPersonInCollection,
  getCollectionById,
  MODULE_ADDRESS,
} from "@/contract"
import { getAptosClient } from "@/common/aptosClient"
import useGTEditorStore from "../store/useGTEditorStore"
import {
  convertEditorStateToOnChainData,
  convertOnChainDataToBatchUpsertPersonArgs,
} from "../model"
import LoadingGif from "@/modules/common/LoadingGif"

const aptos = getAptosClient()

const { Meta } = Card

type GenealogyTreeEditorProps = {
  collectionId: string
}

const GenealogyTreeEditor: FC<GenealogyTreeEditorProps> = ({ collectionId }) => {
  const [ isLoading, setIsLoading ] = useState(true)

  const collectionMetadata = useGTEditorStore(state => state.collectionMetadata)
  const setCollectionMetadata = useGTEditorStore((state) => state.setCollectionMetadata)
  const setAllPerson = useGTEditorStore((state) => state.setAllPerson)
  const updateFromOnChainData = useGTEditorStore((state) => state.updateFromOnChainData)
  const nodes = useGTEditorStore((state) => state.nodes)
  const edges = useGTEditorStore((state) => state.edges)
  const person = useGTEditorStore((state) => state.person)

  const { signAndSubmitTransaction, account } = useWallet()

  useEffect(() => {
    setIsLoading(true)

    Promise.all([
      getAllPersonInCollection(collectionId),
      getCollectionById(collectionId),
    ]).then(([ person, collection ]) => {
      setAllPerson(person)
      setCollectionMetadata(collection)
      updateFromOnChainData()
    }).finally(() => {
      setIsLoading(false)
    })
  }, [ collectionId, setAllPerson, setCollectionMetadata, updateFromOnChainData ])

  function exportClickHandler() {
    console.log({
      nodes,
      edges,
    })
  }

  async function saveClickHandler() {
    const currentEditorState = convertEditorStateToOnChainData({
      nodes,
      edges,
    })

    const { added } = diff.diff(person, currentEditorState, isEqual)

    const batchUpsertPersonArgs = convertOnChainDataToBatchUpsertPersonArgs(added)
    const response = await signAndSubmitTransaction({
      sender: account?.address,
      data: {
        function: `${MODULE_ADDRESS}::contract::batch_upsert_person_metadata`,
        functionArguments: [
          collectionMetadata.id,
          batchUpsertPersonArgs.id,
          batchUpsertPersonArgs.name,
          batchUpsertPersonArgs.gender,
          batchUpsertPersonArgs.date_of_birth,
          batchUpsertPersonArgs.date_of_death,
          batchUpsertPersonArgs.image_uri,
          batchUpsertPersonArgs.parent_ids,
          batchUpsertPersonArgs.children_ids,
        ],
      },
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })

    alert(`${added.length} new entries added`)
  }

  const renderFinishLoading = () => {
    return (
      <Row className="h-full">
        <Col className="h-full" span={6}>
          <Flex className="h-full" vertical>
            <Card
              size="small"
              className="!rounded-none w-full !bg-slate-200"
              cover={
                <img
                  className="min-h-40 max-h-40 object-cover !rounded-none"
                  alt="collection image"
                  src={collectionMetadata.uri}
                />
              }
              actions={!account
                ? []
                : [
                  <Button
                    block
                    key="save"
                    type="text"
                    icon={<SaveOutlined />}
                    iconPosition="start"
                    onClick={saveClickHandler}
                  >
                    Save
                  </Button>,
                  <Button
                    block
                    key="export"
                    type="text"
                    icon={<ExportOutlined />}
                    iconPosition="start"
                    onClick={exportClickHandler}
                  >
                    Export
                  </Button>,
                ]}
            >
              <Meta
                title={collectionMetadata.name}
                description={collectionMetadata.description}
              />
            </Card>
            <div className="h-full overflow-auto no-scrollbar">
              <PersonListEditor edges={edges} nodes={nodes} />
            </div>
          </Flex>
        </Col>
        <Col span={18}>
          <GenealogyTree edges={edges} nodes={nodes} />
        </Col>
      </Row>
    )
  }

  return (
    <>
      {isLoading
        ? <LoadingGif />
        : renderFinishLoading()}
    </>
  )
}

export default GenealogyTreeEditor
