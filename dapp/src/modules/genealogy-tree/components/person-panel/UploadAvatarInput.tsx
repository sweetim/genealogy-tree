import { PlusOutlined } from "@ant-design/icons"
import {
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
import { upload } from "@vercel/blob/client"
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

type UploadAvatarInputProps = {
  imageUri: string
}

const UploadAvatarInput: FC<UploadAvatarInputProps> = ({ imageUri }) => {
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
    action: "/api/upload",
    listType: "picture-circle",
    fileList,
    onPreview: handlePreview,
    customRequest: async (options) => {
      console.log(options)
      if (options.onProgress) {
        console.log(0)
        options.onProgress({ percent: 0 })
      }

      if (options?.file instanceof File) {
        const file = options.file

        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })

        console.log(newBlob)
        console.log("done")
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
