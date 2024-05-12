import { FC } from "react"
import dayjs, { Dayjs } from "dayjs"
import { Button, DatePicker, Form, Input, Radio, Space } from "antd"
import { useWallet } from "@aptos-labs/wallet-adapter-react"

import { getAptosClient } from "@/common/aptosClient"
import useGTEditorStore from "../store/useGTEditorStore"
import { MODULE_ADDRESS, PersonGender, PersonMetadata, getDefaultPersonMetadata } from "@/contract"

export type PersonMetadataEditorProps = {
  id: string,
  metadata: PersonMetadata
}

type PersonMetadataEditorForm = {
  id: string,
  name: string,
  gender: number,
  dateOfBirth: Dayjs | null,
  dateOfDeath: Dayjs | null,
}

const DATE_FORMAT = "YYYY-MM-DD"

const aptos = getAptosClient()

const PersonMetadataEditor: FC<PersonMetadataEditorProps> = ({ id, metadata }) => {
  const { signAndSubmitTransaction, account } = useWallet()

  const updateNode = useGTEditorStore((state) => state.updateNode)

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
    const { dateOfBirth, dateOfDeath, ...others } = values

    const date_of_death = dateOfDeath
      ? dayjs(dateOfDeath).format(DATE_FORMAT)
      : ""

    updateNode(id, {
      ...getDefaultPersonMetadata(),
      ...others,
      id,
      date_of_birth: dayjs(dateOfBirth).format(DATE_FORMAT),
      date_of_death
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
    dateOfBirth: metadata.date_of_birth.length === 0 ? null : dayjs(metadata.date_of_birth),
    dateOfDeath: metadata.date_of_death.length === 0 ? null : dayjs(metadata.date_of_death),
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
