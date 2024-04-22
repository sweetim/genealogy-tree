import { FC, useEffect, useState } from "react"
import { Collapse, CollapseProps } from "antd";
import { Node, Edge } from "reactflow"

import PersonMetadataEditor from "./PersonMetadataEditor";
import { PersonMetadata } from "../model";

type PersonEditorProps = {
  nodes: Node<PersonMetadata>[],
  edges: Edge[],
}

const PersonEditor: FC<PersonEditorProps> = ({ nodes }) => {
  const [items, setItems] = useState<CollapseProps['items']>([])

  useEffect(() => {
    const itemNodes = nodes.map(n => ({
      key: n.id,
      label: n.data.name,
      children: <PersonMetadataEditor metadata={n.data} />,
    }))

    setItems(itemNodes)
  }, [])

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return <Collapse accordion
     expandIconPosition="end" onChange={onChange} items={items} />;
}

export default PersonEditor
