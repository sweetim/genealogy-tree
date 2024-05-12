"use client"

import { AlignCenterOutlined } from "@ant-design/icons";
import * as Dagre from '@dagrejs/dagre';
import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow';
import { v4 as uuidv4 } from "uuid";

import 'reactflow/dist/style.css';

import { EditorNodeProps } from "../model";
import PersonNode from "./PersonNode";
import useGTEditorStore from "../store/useGTEditorStore";
import { PersonMetadata } from "@/contract";

type GenealogyTreeProps = {
  nodes: Node<EditorNodeProps<PersonMetadata>>[],
  edges: Edge[],
}

const NODE_DEFAULT_DIMENSTION = {
  width: 150,
  height: 135
}

enum GraphDirection {
  TB = "TB",
  LR = "LR"
}

const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  graph.setGraph({
    rankdir: GraphDirection.TB
  });

  edges.forEach(
    (edge) => graph.setEdge(
      edge.source,
      edge.target))

  nodes.forEach(
    (node) => graph.setNode(
      node.id,
      {
        width: NODE_DEFAULT_DIMENSTION.width,
        height: NODE_DEFAULT_DIMENSTION.height
      }));

  Dagre.layout(graph)

  return {
    nodes: nodes.map((node) => {
      const { x, y } = graph.node(node.id);
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const GenealogyTreeReactFlow: FC<GenealogyTreeProps> = ({ nodes: initialNodes, edges: initialEdges }) => {
  const connectingNodeId = useRef<string | null>(null);

  // const addNewPerson = useGenealogyTreeEditorStore((state) => state.addNewPerson)
  const addNewNode = useGTEditorStore((state) => state.addNewNode)

  const { fitView, screenToFlowPosition, getNode } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  function relayoutGraph(nodes: Node[], edges: Edge[]) {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }

  useEffect(() => {
    relayoutGraph(initialNodes, initialEdges)
  }, [initialNodes, initialEdges])

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

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const currentNode = getNode(connectingNodeId.current)
      const currentMousePoisition = screenToFlowPosition({
        x: event instanceof MouseEvent ? event.clientX : 0,
        y: event instanceof MouseEvent ? event.clientY : 0,
      })

      // negative is above in react flow coordinate system
      const isAboveCurrentNode = () => {
        const y = currentNode?.position.y || 0

        return currentMousePoisition.y < y
      }

      const id = uuidv4()
      const source = isAboveCurrentNode() ? id : connectingNodeId.current
      const target = isAboveCurrentNode() ? connectingNodeId.current : id

      addNewNode(
        id,
        source,
        target,
        currentMousePoisition.x,
        currentMousePoisition.y)
    },
    [screenToFlowPosition, getNode],
  );

  function resetView() {
    relayoutGraph(nodes, edges)
  }

  const nodeTypes = useMemo(() => ({
    personNode: PersonNode
  }), [])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
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
      {/* <MiniMap /> */}
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
  )
}

const GenealogyTree: FC<GenealogyTreeProps> = ({ nodes, edges }) => {
  return (
    <ReactFlowProvider>
      <GenealogyTreeReactFlow edges={edges} nodes={nodes} />
    </ReactFlowProvider >
  )
}

export default GenealogyTree
