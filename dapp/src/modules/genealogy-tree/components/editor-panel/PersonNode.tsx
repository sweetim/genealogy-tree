"use client"

import {
  Avatar,
  Flex,
  Skeleton,
  Typography,
} from "antd"
import { FC } from "react"
import {
  Handle,
  NodeProps,
  Position,
} from "reactflow"

import { PersonMetadata } from "@/contract"
import { EditorNodeProps } from "../../model"

const { Text } = Typography

const PersonNode: FC<NodeProps<EditorNodeProps<PersonMetadata>>> = ({ data, isConnectable }) => {
  const isNewPerson = data.onChainData.name?.includes("NEW Person")
  console.log(data.onChainData)
  const imageUri = data.onChainData.image_uri.length === 0
    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/1200px-Question_Mark.svg.png"
    : data.onChainData.image_uri
  const yearOfBirth = (new Date(data.onChainData.date_of_birth || Date.now())).getFullYear()
  const yearOfDeath = data.onChainData.date_of_death
    ? (new Date(data.onChainData.date_of_death)).getFullYear()
    : "living"

  const yearsOfLiving = `${yearOfBirth} - ${yearOfDeath}`

  const renderAvatar = isNewPerson
    ? <Skeleton.Avatar className="m-2 w-10" size={64} shape="circle" />
    : <Avatar className="m-2" size={64} src={imageUri} />

  return (
    <div className="text-updater-node">
      <Handle type="target" className="bg-red-600" position={Position.Top} isConnectable={isConnectable} />
      <Flex align="center" justify="center" vertical className="h-full">
        {renderAvatar}
        <Text strong>{data.onChainData.name} ({data.onChainData.gender === 1 ? "M" : "F"})</Text>
        <Text type="secondary">{yearsOfLiving}</Text>
      </Flex>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}

export default PersonNode
