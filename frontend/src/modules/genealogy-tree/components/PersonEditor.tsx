import { Button, Collapse, CollapseProps, DatePicker, Form, Input, Radio } from "antd";
import { FC, useEffect, useState } from "react"
import { Node, Edge } from "reactflow"
import { PersonMetadata } from "./GenealogyTreeEditor";
import dayjs from "dayjs";


type PersonMetadataEditorProps = {
  metadata: PersonMetadata
}

type PersonMetadataForm = {
  name: string,
  gender: number,
  dateOfBirth: string,
  dateOfDeath: string
}

const PersonMetadataEditor: FC<PersonMetadataEditorProps> = ({ metadata }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const updatePersonUpdateFinishHandler = (values: PersonMetadataForm) => {
    console.log(values)
    console.log(dayjs(values.dateOfBirth).format("DD-MM-YYYY"))
    console.log(dayjs(values.dateOfDeath).format("DD-MM-YYYY"))
  }

  const initialValues = {
    ...metadata,
    dateOfBirth: dayjs(metadata.dateOfBirth),
    dateOfDeath: dayjs(metadata.dateOfDeath),
  }

  return (
    <Form {...formItemLayout} variant="outlined"
      name="updatePersonForm"
      onFinish={updatePersonUpdateFinishHandler}
      initialValues={initialValues}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please input!' }]}>
        <Radio.Group value={metadata.gender}>
          <Radio.Button value={1}>Male</Radio.Button>
          <Radio.Button value={2}>Female</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        label="Date of Death"
        name="dateOfDeath"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <DatePicker renderExtraFooter={
          () => (
            <>
              <Button>Alive</Button>
            </>
          )
        } />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Button className="bg-red-200" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  )
}

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
