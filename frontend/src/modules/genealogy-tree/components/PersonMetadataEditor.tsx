import { FC } from "react"
import dayjs, { Dayjs } from "dayjs"
import { Button, DatePicker, Form, Input, Radio } from "antd"
import { PersonGender, PersonMetadata } from "../model"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"

type PersonMetadataEditorProps = {
  metadata: PersonMetadata
}

type PersonMetadataForm = {
  name: string,
  gender: number,
  dateOfBirth: Dayjs,
  dateOfDeath: Dayjs | null
}

const DATE_FORMAT = "YYYY-MM-DD"

const PersonMetadataEditor: FC<PersonMetadataEditorProps> = ({ metadata }) => {
  const updatePerson = useGenealogyTreeEditorStore((state) => state.updatePerson)

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
    const dateOfDeath = values.dateOfDeath
      ? dayjs(values.dateOfDeath).format(DATE_FORMAT)
      : ""

    updatePerson({
      ...values,
      dateOfBirth: dayjs(values.dateOfBirth).format(DATE_FORMAT),
      dateOfDeath,
    })
  }

  const initialValues = {
    ...metadata,
    dateOfBirth: dayjs(metadata.dateOfBirth),
    dateOfDeath: metadata.dateOfDeath ? dayjs(metadata.dateOfDeath) : null,
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
      >
        <DatePicker />
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
