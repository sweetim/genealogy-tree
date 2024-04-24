import { Handle, NodeProps, Position } from "reactflow";
import { FC } from "react";
import { Avatar, Flex, Typography } from "antd";

import { PersonMetadata } from "../model";

const { Text } = Typography;

const PersonNode: FC<NodeProps<PersonMetadata>> = ({ data, isConnectable }) => {
  const imageUri = `https://robohash.org/${data.name}?set=set1`
  const yearOfBirth = (new Date(data.dateOfBirth!)).getFullYear()
  const yearOfDeath = data.dateOfDeath
    ? (new Date(data.dateOfDeath)).getFullYear()
    : "living"

  const yearsOfLiving = `${yearOfBirth} - ${yearOfDeath}`

  return (
    <div className="text-updater-node">
      <Handle type="target"
        className="bg-red-600"
        position={Position.Top}
        isConnectable={isConnectable} />
      <Flex align="center" justify='center' vertical className='h-full'>
        <Avatar className="m-1" size={64} src={imageUri} />
        <Text strong>{data.name}</Text>
        <Text type="secondary">{yearsOfLiving}</Text>
      </Flex>
      <Handle type="source"
        position={Position.Bottom}
        isConnectable={isConnectable} />
    </div>
  )
}

export default PersonNode