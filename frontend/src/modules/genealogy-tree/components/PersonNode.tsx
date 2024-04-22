import { Handle, NodeProps, Position } from "reactflow";
import { FC } from "react";
import { Flex, Typography } from "antd";

import { PersonMetadata } from "../model";

const { Text } = Typography;

const PersonNode: FC<NodeProps<PersonMetadata>> = ({ data, isConnectable }) => {
  return (
    <div className="text-updater-node">
      <Handle type="target"
        className="bg-red-600"
        position={Position.Top}
        isConnectable={isConnectable} />
      <Flex align="center" justify='center' vertical className='h-full'>
        <Text strong>{data.name}</Text>
        <Text type="secondary">{(new Date(data.dateOfBirth!)).getFullYear()}</Text>
      </Flex>
      <Handle type="source"
        position={Position.Bottom}
        isConnectable={isConnectable} />
    </div>
  )
}

export default PersonNode
