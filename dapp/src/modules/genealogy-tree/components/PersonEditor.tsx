"use client"

import { FC, useEffect, useState } from "react"
import { Collapse, CollapseProps } from "antd";
import { Node, Edge } from "reactflow"

import PersonMetadataEditor, { PersonMetadataEditorProps } from "./PersonMetadataEditor";
import { EditorNodeProps, PersonMetadata } from "../model";

type PersonEditorProps = {
  nodes: Node<EditorNodeProps<PersonMetadata>>[],
  edges: Edge[],
}

const PersonEditor: FC<PersonEditorProps> = ({ nodes }) => {
  const [items, setItems] = useState<CollapseProps['items']>([])

  useEffect(() => {
    const itemNodes = nodes.map(n => {
      const editorProps: PersonMetadataEditorProps = {
        id: n.id,
        metadata: n.data.onChainData
      }

      return {
        key: n.id,
        label: n.data.onChainData.name,
        children: <PersonMetadataEditor {...editorProps} />,
      }
    })

    setItems(itemNodes)
  }, [nodes])

  return (
    <Collapse accordion
      expandIconPosition="end"
      items={items} />
  )
}

export default PersonEditor
