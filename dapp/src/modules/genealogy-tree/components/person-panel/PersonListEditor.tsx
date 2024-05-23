"use client"

import {
  FC,
  useMemo,
} from "react"
import { Collapse } from "antd"
import {
  Edge,
  Node,
} from "reactflow"

import PersonMetadataEditor, { PersonMetadataEditorProps } from "./PersonMetadataEditor"
import { EditorNodeProps } from "@/modules/genealogy-tree/model"
import { PersonMetadata } from "@/contract"

const { Panel } = Collapse

type PersonListEditorProps = {
  nodes: Node<EditorNodeProps<PersonMetadata>>[]
  edges: Edge[]
}

const PersonListEditor: FC<PersonListEditorProps> = ({ nodes }) => {
  const renderPanels = useMemo(() => {
    return nodes.map(n => {
      const editorProps: PersonMetadataEditorProps = {
        id: n.id,
        metadata: n.data.onChainData,
      }

      const className = n.data.isNew
        ? "bg-orange-200"
        : ""

      return (
        <Panel key={n.id} className={className} header={n.data.onChainData.name}>
          <PersonMetadataEditor {...editorProps} />
        </Panel>
      )
    })
  }, [nodes])

  const activeKey = useMemo<string[] | undefined>(() => {
    const newNodeKey = nodes.filter(n => n.data.isNew)
      .map(n => n.data.onChainData.id)

    return newNodeKey.length === 0
      ? undefined
      : newNodeKey
  }, [nodes])

  return (
    <Collapse
      activeKey={activeKey}
      accordion
      expandIconPosition="end"
    >
      {renderPanels}
    </Collapse>
  )
}

export default PersonListEditor
