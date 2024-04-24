import { FC } from "react"
import { Button, Col, Row, Space } from "antd"

import GenealogyTree from "./GenealogyTree"
import PersonEditor from "./PersonEditor"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"

const GenealogyTreeEditor: FC = () => {
  const nodes = useGenealogyTreeEditorStore((state) => state.nodes)
  const edges = useGenealogyTreeEditorStore((state) => state.edges)
  const saveToChain = useGenealogyTreeEditorStore(state => state.saveToChain)


  function exportClickHandler() {
    console.log({
      nodes,
      edges
    })
  }

  function saveClickHandler() {
    saveToChain()
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
