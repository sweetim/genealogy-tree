import { FC } from "react"
import { Card } from "antd"
import Meta from "antd/lib/card/Meta"

import { GenealogyTreeMetadata } from "@/contract"

const CollectionCard: FC<GenealogyTreeMetadata> = (props) => {
  return (
    <Card
      hoverable
      cover={
        <img alt={props.description}
          src={props.uri} />
      }
    >
      <Meta title={props.name}
        description={props.description} />
    </Card>
  )
}

export default CollectionCard
