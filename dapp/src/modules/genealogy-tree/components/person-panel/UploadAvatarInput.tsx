import { PlusOutlined } from "@ant-design/icons"
import {
  Form,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd"
import {
  FC,
  useState,
} from "react"
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

type UploadAvatarInputProps = {
  id: string
  imageUri: string
  onUploadedImage: (ipfsUri: string) => void
}

const UploadAvatarInput: FC<UploadAvatarInputProps> = ({ imageUri, id, onUploadedImage }) => {
  const [ form ] = Form.useForm()
  const [ previewOpen, setPreviewOpen ] = useState(false)
  const [ previewImage, setPreviewImage ] = useState(imageUri)

  const [ fileList, setFileList ] = useState<UploadFile[]>([])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFileList(newFileList)

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const uploadPros: UploadProps = {
    listType: "picture-circle",
    fileList,
    onPreview: handlePreview,
    customRequest: async (options) => {
      if (options.onProgress) {
        options.onProgress({ percent: 0 })
      }

      if (options?.file instanceof File) {
        const file = options.file
        const resJwt = await fetch(
          "/api/upload",
          { method: "POST" },
        )

        const { jwt } = await resJwt.json()

        if (options.onProgress) {
          options.onProgress({ percent: 20 })
        }

        const formData = new FormData()
        formData.append(
          "file",
          file,
          `{id}-(${file.name})`,
        )

        const resIpfs = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            body: formData,
          },
        )

        const json = await resIpfs.json()

        console.log(json)
        const { IpfsHash } = json

        onUploadedImage(`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${IpfsHash}`)
      }

      if (options.onSuccess && options.onProgress) {
        options.onProgress({ percent: 100 })
        options.onSuccess("OK")
      }
    },
    onChange: handleChange,
  }

  return (
    <>
      <Upload
        {...uploadPros}
      >
        {fileList.length === 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  )
}

export default UploadAvatarInput
