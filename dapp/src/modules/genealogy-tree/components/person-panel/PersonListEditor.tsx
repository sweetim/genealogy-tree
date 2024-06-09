"use client"

import { Collapse } from "antd"
import {
  FC,
  useMemo,
} from "react"
import {
  Edge,
  Node,
} from "reactflow"

import { PersonMetadata } from "@/contract"
import { EditorNodeProps } from "@/modules/genealogy-tree/model"
import PersonMetadataForm, { PersonMetadataFormProps } from "./PersonMetadataForm"

const { Panel } = Collapse

type PersonListEditorProps = {
  nodes: Node<EditorNodeProps<PersonMetadata>>[]
  edges: Edge[]
}

const PersonListEditor: FC<PersonListEditorProps> = ({ nodes }) => {
  const renderPanels = useMemo(() => {
    return nodes.map(n => {
      const formProps: PersonMetadataFormProps = {
        id: n.id,
        metadata: n.data.onChainData,
      }

      const className = n.data.isNew
        ? "bg-orange-200"
        : ""

      return (
        <Panel key={n.id} className={className} header={n.data.onChainData.name}>
          <PersonMetadataForm {...formProps} />
        </Panel>
      )
    })
  }, [ nodes ])

  const activeKey = useMemo<string[] | undefined>(() => {
    const newNodeKey = nodes.filter(n => n.data.isNew)
      .map(n => n.data.onChainData.id)

    return newNodeKey.length === 0
      ? undefined
      : newNodeKey
  }, [ nodes ])

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
