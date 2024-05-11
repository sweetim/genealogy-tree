import { FC } from "react"
import dayjs, { Dayjs } from "dayjs"
import { Button, DatePicker, Form, Input, Radio, Space } from "antd"
import { PersonGender, PersonMetadata } from "../model"
import useGenealogyTreeEditorStore from "../store/useGenealogyTreeEditorStore"
import { getAptosClient } from "../../../common/aptosClient"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { MODULE_ADDRESS } from "../contract"

export type PersonMetadataEditorProps = {
  id: string,
  metadata: PersonMetadata
}

type PersonMetadataEditorForm = {
  id: string,
  name: string,
  gender: number,
  dateOfBirth: Dayjs,
  dateOfDeath: Dayjs | null,
}

const DATE_FORMAT = "YYYY-MM-DD"

const aptos = getAptosClient()

const PersonMetadataEditor: FC<PersonMetadataEditorProps> = ({ id, metadata }) => {
  const { signAndSubmitTransaction, account } = useWallet()

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

  const updatePersonUpdateFinishHandler = (values: PersonMetadataEditorForm) => {
    const dateOfDeath = values.dateOfDeath
      ? dayjs(values.dateOfDeath).format(DATE_FORMAT)
      : ""

    updatePerson(id, {
      ...values,
      dateOfBirth: dayjs(values.dateOfBirth).format(DATE_FORMAT),
      dateOfDeath,
    })
  }

  const claimNFTClickHandler = async () => {
    const response = await signAndSubmitTransaction({
      sender: account?.address,
      data: {
        function: `${MODULE_ADDRESS}::contract::mint_person_nft`,
        functionArguments: [
          id
        ],
      },
    });

    await aptos.waitForTransaction({ transactionHash: response.hash });
  }

  const initialValues: PersonMetadataEditorForm = {
    id,
    name: metadata.name || "",
    gender: metadata.gender || 0,
    dateOfBirth: dayjs(metadata.dateOfBirth),
    dateOfDeath: metadata.dateOfDeath ? dayjs(metadata.dateOfDeath) : null,
  }

  return (
    <Form {...formItemLayout} variant="outlined" disabled={!account}
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
        {account && <Space >
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button type="primary" danger htmlType="button" onClick={claimNFTClickHandler}>
            Claim NFT
          </Button>
        </Space>}
      </Form.Item>
    </Form>
  )
}

export default PersonMetadataEditor
