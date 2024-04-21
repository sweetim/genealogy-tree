import { useCallback, FC, createRef, useEffect, useRef } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, Connection, Controls, ControlButton, MiniMap, Background, BackgroundVariant, ReactFlowProvider } from 'reactflow';
import * as Dagre from '@dagrejs/dagre'

import 'reactflow/dist/style.css';
import { AlignCenterOutlined } from "@ant-design/icons";

interface GenealogyTreeNode {
  name: string;
  children?: GenealogyTreeNode[];
}

type GenealogyTreeProps = {
  data: GenealogyTreeNode
}
const initialNodes = [
  { id: "0", position: { x: 0, y: 0 }, data: { label: 'loh kam chew' } },
  { id: "1", position: { x: 0, y: 0 }, data: { label: 'loh wai meng' } },
  { id: "2", position: { x: 0, y: 0 }, data: { label: 'loh wai keen' } },
  { id: "3", position: { x: 0, y: 0 }, data: { label: 'loh wai sum' } },
  { id: "4", position: { x: 0, y: 0 }, data: { label: 'loh wai weng' } },
  { id: "5", position: { x: 0, y: 0 }, data: { label: 'loh wai mei' } },
  { id: "6", position: { x: 0, y: 0 }, data: { label: 'ho swee leong' } },
  { id: "7", position: { x: 0, y: 0 }, data: { label: 'ho swee tim' } },
  { id: "8", position: { x: 0, y: 0 }, data: { label: 'loh jin xiang' } },
  { id: "9", position: { x: 0, y: 0 }, data: { label: 'loh jin hoong' } },
  { id: "10", position: { x: 0, y: 0 }, data: { label: 'loh kai li' } },
  { id: "11", position: { x: 0, y: 0 }, data: { label: 'loh kai syuen' } },
  { id: "12", position: { x: 0, y: 0 }, data: { label: 'loh kai tyng' } }
]

const initialEdges = [
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

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any, edges: any, options: any) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: any) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};


const GenealogyTreeReactFlow: FC<GenealogyTreeProps> = ({ data }) => {
  const { fitView, screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

  }, [initialNodes, initialEdges])

  const connectingNodeId = useRef(null);

  const onConnect = useCallback(
    (params: Connection) => {
      connectingNodeId.current = null
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  );

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  let id = 1000;
  const getId = () => `${id++}`;
  const onConnectEnd = useCallback(
    (event: any) => {
      console.log("hello")
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target?.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId()
        const newNode: any = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `new ${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  useEffect(() => {
    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [])

  function resetView() {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      console.log("here")
      fitView();
    });
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      fitView
    >
      <Controls>
        <ControlButton onClick={resetView}>
          <AlignCenterOutlined />
        </ControlButton>
      </Controls>
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}

const GenealogyTree: FC<GenealogyTreeProps> = ({ data }) => {
  return (
    <ReactFlowProvider >
      <GenealogyTreeReactFlow data={data} />
    </ReactFlowProvider >
  )
}

export default GenealogyTree
