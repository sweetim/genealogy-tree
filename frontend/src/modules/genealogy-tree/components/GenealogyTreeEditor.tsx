import { FC, useEffect } from "react"
import { Button, Col, Flex, Row, Typography } from "antd"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import * as diff from "fast-array-diff"

import GenealogyTree from "./GenealogyTree"
import PersonEditor from "./PersonEditor"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"
import { MODULE_ADDRESS, getAllPersonMetadata, getAllPersonRelation } from "../contract"
import { getAptosClient } from "../../../common/aptosClient"

const { Text } = Typography;

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
    ]).then(([person, relation]) => setDataFromOnChain(person, relation))
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
      <Col className="h-full" span={6}>
        <Flex className="h-full" vertical>
          <Flex className="bg-blue-100 p-3" align="center" justify="space-between">
            {nodes.length > 0 && <Text strong>LOH Family</Text>}
            {account && <Flex gap="small" align="center">
              <Button onClick={exportClickHandler}>Export</Button>
              <Button onClick={saveClickHandler}>Save</Button>
            </Flex>}
          </Flex>
          <div className="h-full overflow-auto no-scrollbar">
            <PersonEditor edges={edges} nodes={nodes} />
          </div>
        </Flex>
      </Col>
      <Col span={18}>
        {nodes.length > 0 && <GenealogyTree edges={edges} nodes={nodes} />}
      </Col>
    </Row>
  )
}

export default GenealogyTreeEditor
