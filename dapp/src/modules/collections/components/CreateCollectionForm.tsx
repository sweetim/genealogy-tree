"use client"

import {
  FC,
  useMemo,
} from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import {
  Button,
  Form,
  FormProps,
  Input,
} from "antd"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { GenealogyTreeMetadata } from "@/contract"
import { MODULE_ADDRESS } from "@/contract"
import { getAptosClient } from "@/common/aptosClient"
import LoginMethodSelection from "@/modules/connect/LoginMethodSelection"
import { useEphemeralKeyPairStore } from "@/store/useEphemeralKeyPairStore"

type CreateCollectionFormProps = {
  className?: string
}

const aptos = getAptosClient()

const CreateCollectionForm: FC<CreateCollectionFormProps> = ({ className }) => {
  const router = useRouter()
  const { account, signAndSubmitTransaction } = useWallet()
  const keylessAccount = useEphemeralKeyPairStore(state => state.keylessAccount)

  const isLogin = useMemo(() => {
    return !!keylessAccount || !!account
  }, [ keylessAccount, account ])

  const onFinish: FormProps<GenealogyTreeMetadata>["onFinish"] = async (values) => {
    const id = uuidv4()

    const response = await signAndSubmitTransaction({
      sender: account?.address,
      data: {
        function: `${MODULE_ADDRESS}::contract::create_genealogy_tree_collection`,
        functionArguments: [
          id,
          values.name,
          values.description,
          values.uri,
        ],
      },
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })

    router.push(`/family/${encodeURIComponent(id)}`)
  }

  const renderConnectUI = () => {
    return (
      <div>
        <p className="p-5 text-slate-900">create your family tree and start growing it</p>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          // wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
          size="large"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<GenealogyTreeMetadata>
            label="Name"
            name="name"
            rules={[ { required: true, message: "Please input your family tree name" } ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<GenealogyTreeMetadata>
            label="Description"
            name="description"
            rules={[ { required: true, message: "Please input your desciption" } ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item<GenealogyTreeMetadata>
            label="Image"
            name="uri"
            rules={[ { required: true, message: "Please input your image uri" } ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit">
              Create Your Family Tree
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  return (
    <div>
      {isLogin
        ? renderConnectUI()
        : <LoginMethodSelection />}
    </div>
  )
}

export default CreateCollectionForm
