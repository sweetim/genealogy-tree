import { Col, Row } from "antd"
import { FC } from "react"
import GenealogyTree from "./GenealogyTree"
import { Edge, Node } from "reactflow";
import PersonEditor from "./PersonEditor";

export enum PersonGender {
  Male = 1,
  Female
}

export type PersonMetadata = {
  name?: string,
  age?: number,
  dateOfBirth?: string,
  dateOfDeath?: string,
  gender?: PersonGender,
  imageUri?: string,
}

const initialNodes: Node<PersonMetadata>[] = [
  { id: "0", position: { x: 0, y: 0 }, data: { name: 'loh kam chew', dateOfBirth: "01-01-1921", gender: 1 }, type: "personNode" },
  { id: "1", position: { x: 0, y: 0 }, data: { name: 'loh wai meng', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "2", position: { x: 0, y: 0 }, data: { name: 'loh wai keen', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "3", position: { x: 0, y: 0 }, data: { name: 'loh wai sum', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "4", position: { x: 0, y: 0 }, data: { name: 'loh wai weng', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "5", position: { x: 0, y: 0 }, data: { name: 'loh wai mei', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "6", position: { x: 0, y: 0 }, data: { name: 'ho swee leong', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "7", position: { x: 0, y: 0 }, data: { name: 'ho swee tim', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "8", position: { x: 0, y: 0 }, data: { name: 'loh jin xiang', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "9", position: { x: 0, y: 0 }, data: { name: 'loh jin hoong', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "10", position: { x: 0, y: 0 }, data: { name: 'loh kai li', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "11", position: { x: 0, y: 0 }, data: { name: 'loh kai syuen', dateOfBirth: "01-01-1921" }, type: "personNode" },
  { id: "12", position: { x: 0, y: 0 }, data: { name: 'loh kai tyng', dateOfBirth: "01-01-1921" }, type: "personNode" },
]

const initialEdges: Edge[] = [
  { id: 'e0-1', source: '0', target: '1', type: 'smoothstep' },
  { id: 'e0-2', source: '0', target: '2', type: 'smoothstep' },
  { id: 'e0-3', source: '0', target: '3', type: 'smoothstep' },
  { id: 'e0-4', source: '0', target: '4', type: 'smoothstep' },
  { id: 'e0-5', source: '0', target: '5', type: 'smoothstep' },
  { id: 'e2-6', source: '2', target: '6', type: 'smoothstep' },
  { id: 'e2-7', source: '2', target: '7', type: 'smoothstep' },
  { id: 'e3-8', source: '3', target: '8', type: 'smoothstep' },
  { id: 'e3-9', source: '3', target: '9', type: 'smoothstep' },
  { id: 'e4-10', source: '4', target: '10', type: 'smoothstep' },
  { id: 'e4-11', source: '4', target: '11', type: 'smoothstep' },
  { id: 'e4-12', source: '4', target: '12', type: 'smoothstep' },
];

const GenealogyTreeEditor: FC = () => {
  return (
    <Row className="h-full">
      <Col className="h-full overflow-auto no-scrollbar" span={6}>
        <PersonEditor edges={initialEdges} nodes={initialNodes} />
      </Col>
      <Col span={18}>
        <GenealogyTree edges={initialEdges} nodes={initialNodes} />
      </Col>
    </Row>
  )
}

export default GenealogyTreeEditor
