import { FC, useEffect } from "react"
import { Button, Col, Row, Space } from "antd"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

import GenealogyTree from "./GenealogyTree"
import PersonEditor from "./PersonEditor"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"
import { MODULE_ADDRESS, getAllPersonMetadata, getAllPersonRelation } from "../contract"
import { getAptosClient } from "../../../common/aptosClient"
import * as diff from "fast-array-diff"


const aptos = getAptosClient()

const GenealogyTreeEditor: FC = () => {
  const nodes = useGenealogyTreeEditorStore((state) => state.nodes)
  const nodesFromOnChain = useGenealogyTreeEditorStore((state) => state.nodesFromOnChain)
  const edges = useGenealogyTreeEditorStore((state) => state.edges)
  const edgesFromOnChain = useGenealogyTreeEditorStore((state) => state.edgesFromOnChain)
  const setDataFromOnChain = useGenealogyTreeEditorStore((state) => state.setDataFromOnChain)

  const { signAndSubmitTransaction, account } = useWallet();

  useEffect(() => {
    Promise.all([
      getAllPersonMetadata(),
      getAllPersonRelation(),
    ]).then(([ person, relation ]) => setDataFromOnChain(person, relation))
  }, [])

  function exportClickHandler() {
    console.log({
      nodes,
      edges
    })
  }

  async function saveClickHandler() {
    const { added: addedNodes } = diff.diff(nodesFromOnChain, nodes)
    const { added: addedEdges } = diff.diff(edgesFromOnChain, edges)

    for (const node of addedNodes) {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::contract::create_person_metadata`,
          functionArguments: [
            node.id,
            node.data.name,
            node.data.gender,
            node.data.dateOfBirth,
            node.data.dateOfDeath,
            `https://robohash.org/${node.data.name}?set=set1`
          ],
        },
      });

      await aptos.waitForTransaction({ transactionHash: response.hash });
    }

    for (const edge of addedEdges) {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::contract::create_person_relation`,
          functionArguments: [
            edge.source,
            edge.target
          ],
        },
      });

      await aptos.waitForTransaction({ transactionHash: response.hash });
    }

    console.log("save completed")
  }

  return (
    <Row className="h-full">
      <Col className="h-full overflow-auto no-scrollbar" span={6}>
        <Space className="p-2">
          <Button onClick={exportClickHandler}>Export</Button>
          <Button onClick={saveClickHandler}>Save</Button>
        </Space>
        <PersonEditor edges={edges} nodes={nodes} />
      </Col>
      <Col span={18}>
        <GenealogyTree edges={edges} nodes={nodes} />
      </Col>
    </Row>
  )
}

export default GenealogyTreeEditor
