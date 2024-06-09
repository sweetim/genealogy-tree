"use client"

import { getAptosClient } from "@/common/aptosClient"
import {
  GenealogyTreeMetadata,
  MODULE_ADDRESS,
} from "@/contract"
import { useAllWalletInfo } from "@/hooks/useAllWalletInfo"
import LoginMethodSelection from "@/modules/connect/LoginMethodSelection"
import UploadAvatarInput from "@/modules/genealogy-tree/components/person-panel/UploadAvatarInput"
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react"
import {
  Button,
  Form,
  FormProps,
  Input,
} from "antd"
import { useRouter } from "next/navigation"
import { FC } from "react"
import { v4 as uuidv4 } from "uuid"

type CreateCollectionFormProps = {
  className?: string
}

const aptos = getAptosClient()

const CreateCollectionForm: FC<CreateCollectionFormProps> = ({ className }) => {
  const [ form ] = Form.useForm()
  const router = useRouter()
  const { isConnected, accountAddress, keylessAccount, isKeylessAccountConnected, signAndSubmitTransaction } =
    useAllWalletInfo()

  const onFinish: FormProps<GenealogyTreeMetadata>["onFinish"] = async (values) => {
    if (!accountAddress) return

    const transactionArgs: InputTransactionData = {
      sender: accountAddress,
      data: {
        function: `${MODULE_ADDRESS}::contract::create_genealogy_tree_collection`,
        functionArguments: [
          values.id,
          values.name,
          values.description,
          values.uri,
        ],
      },
    }

    await signAndSubmitTransaction(transactionArgs)

    router.push(`/family/${encodeURIComponent(values.id)}`)
  }

  function onUploadedImageHandler(imageUri: string) {
    console.log(imageUri)
    form.setFieldValue("uri", imageUri)
  }

  const initialValues: GenealogyTreeMetadata = {
    id: uuidv4(),
    name: "",
    description: "",
    uri: "",
  }

  const renderConnectUI = () => {
    return (
      <div>
        <p className="p-5 text-slate-900">create your family tree and start growing it</p>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          style={{ maxWidth: 800 }}
          size="large"
          initialValues={initialValues}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<GenealogyTreeMetadata>
            label="Id"
            name="id"
          >
            <Input disabled />
          </Form.Item>

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
            rules={[ { required: true, message: "Please upload your image" } ]}
          >
            <div className="flex">
              <UploadAvatarInput
                id={initialValues.id}
                imageUri={initialValues.uri}
                uploadListType="picture"
                onUploadedImage={onUploadedImageHandler}
              />
            </div>
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
      {isConnected
        ? renderConnectUI()
        : <LoginMethodSelection />}
    </div>
  )
}

export default CreateCollectionForm
