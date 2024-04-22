import { FC } from "react"
import dayjs from "dayjs"
import { Button, DatePicker, Form, Input, Radio } from "antd"
import { PersonGender, PersonMetadata } from "../model"

type PersonMetadataEditorProps = {
  metadata: PersonMetadata
}

export type PersonMetadataForm = {
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
      name={`updatePersonForm-${metadata.name}`}
      onFinish={updatePersonUpdateFinishHandler}
      initialValues={initialValues}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please input!' }]}>
        <Radio.Group value={metadata.gender}>
          <Radio.Button value={PersonGender.Male}>Male</Radio.Button>
          <Radio.Button value={PersonGender.Female}>Female</Radio.Button>
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
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PersonMetadataEditor
