import { FC } from "react"
import { Col, Row } from "antd"

import GenealogyTree from "./GenealogyTree"
import PersonEditor from "./PersonEditor"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"

const GenealogyTreeEditor: FC = () => {
  const nodes = useGenealogyTreeEditorStore((state) => state.nodes);
  const edges = useGenealogyTreeEditorStore((state) => state.edges);

  return (
    <Row className="h-full">
      <Col className="h-full overflow-auto no-scrollbar" span={6}>
        <PersonEditor edges={edges} nodes={nodes} />
      </Col>
      <Col span={18}>
        <GenealogyTree edges={edges} nodes={nodes} />
      </Col>
    </Row>
  )
}

export default GenealogyTreeEditor
