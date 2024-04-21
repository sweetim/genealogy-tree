import { useCallback, FC, createRef, useEffect, useRef, useMemo } from "react";
import ReactFlow, { Node, useNodesState, useEdgesState, addEdge, useReactFlow, Connection, Controls, ControlButton, MiniMap, Background, BackgroundVariant, ReactFlowProvider, OnConnect, OnConnectStart, OnConnectEnd, Edge, NodeProps, Handle, Position } from 'reactflow';
import * as Dagre from '@dagrejs/dagre'

import 'reactflow/dist/style.css';
import { AlignCenterOutlined } from "@ant-design/icons";
import { PersonMetadata } from "./GenealogyTreeEditor";
import { Flex, Typography } from "antd";

type GenealogyTreeProps = {
  nodes: Node<PersonMetadata>[],
  edges: Edge[],
}

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: any) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node: any) => g.setNode(node.id, { width: nodeWidth, height: nodeHeight }));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: any) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
const { Text } = Typography;

const PersonNode: FC<NodeProps<PersonMetadata>> = ({ data, isConnectable }) => {
  // function TextUpdaterNode({ data, isConnectable }: NodeProps<TextUpdaterNodeProps>) {

  return (
    <div className="text-updater-node">
      <Handle
        className="bg-red-600"
        type="target"
        position={Position.Top}
        isConnectable={isConnectable} />
      <Flex align="center" justify='center' vertical className='h-full'>
        <Text strong>{data.name}</Text>
        <Text type="secondary">{data.dateOfBirth?.getFullYear()}</Text>
        {/* <Title className="m-0" level={5}>{data.label}</Title> */}
      </Flex>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

const nodeWidth = 142;
const nodeHeight = 85;

const GenealogyTreeReactFlow: FC<GenealogyTreeProps> = ({ nodes: initialNodes, edges: initialEdges }) => {
  const { fitView, screenToFlowPosition, getNode } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const layouted = getLayoutedElements(initialNodes, initialEdges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    // window.requestAnimationFrame(() => {
    //   fitView();
    // });
  }, [initialNodes, initialEdges])

  const connectingNodeId = useRef<string | null>(null);

  const onConnect: OnConnect = useCallback(
    (params) => {
      connectingNodeId.current = null
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const getId = () => Date.now().toString();
  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const currentNode = getNode(connectingNodeId.current)
      const currentMousePoisition = screenToFlowPosition({
        x: event instanceof MouseEvent ? event.clientX : 0,
        y: event instanceof MouseEvent ? event.clientY : 0,
      })

      const { y: currentNode_y } = currentNode?.position!

      // negative is above in react flow coordinate system
      const isAboveCurrentNode = () => {
        return currentMousePoisition.y < currentNode_y
      }

      const id = getId()

      const newNode: Node<PersonMetadata> = {
        id,
        position: currentMousePoisition,
        type: "personNode",
        data: {
          name: id.toString(),
          dateOfBirth: new Date("01-01-1921")
        },
      };

      const newEdge: Edge = {
        id: `e${connectingNodeId.current}-${id}`,
        source: isAboveCurrentNode() ? id : connectingNodeId.current,
        target: isAboveCurrentNode() ? connectingNodeId.current : id,
        type: 'smoothstep',
        // sourceHandle: "bottom",
        // targetHandle: "top"
      }

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));

    },
    [screenToFlowPosition],
  );

  function resetView() {
    const layouted = getLayoutedElements(nodes, edges, { direction: "TB" });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }

  const nodeTypes = useMemo(() => ({
    personNode: PersonNode
  }), [])

  return (
    <ReactFlow
    nodeTypes={nodeTypes}
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

const GenealogyTree: FC<GenealogyTreeProps> = ({ nodes, edges }) => {
  return (
    <ReactFlowProvider >
      <GenealogyTreeReactFlow edges={edges} nodes={nodes} />
    </ReactFlowProvider >
  )
}

export default GenealogyTree
