import { Button, Collapse, CollapseProps, DatePicker, Form, Input } from "antd";
import { FC, useEffect, useState } from "react"
import { Node, Edge } from "reactflow"
import { PersonMetadata } from "./GenealogyTreeEditor";

type PersonMetadataEditorProps = {
  metadata: PersonMetadata
}

const PersonMetadataEditor: FC<PersonMetadataEditorProps> = ({ metadata }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };


  return (
    // <>
    //   <p>{metadata.name}</p>
    //   <p>{metadata.dateOfBirth?.toDateString()}</p>
    //   <p>{metadata.dateOfDeath?.toDateString()}</p>
    //   <p>{metadata.gender}</p>
    //   <p>{metadata.age}</p>
    // </>
    <Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }}>
      <Form.Item label="Input" name="Input" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="DatePicker"
        name="DatePicker"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

type PersonEditorProps = {
  nodes: Node<PersonMetadata>[],
  edges: Edge[],
}


const PersonEditor: FC<PersonEditorProps> = ({ nodes, edges }) => {
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

  return <Collapse expandIconPosition="end" onChange={onChange} items={items} />;
}

export default PersonEditor
