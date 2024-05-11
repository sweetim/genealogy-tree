import { FC } from "react"
import { Card } from "antd"
import Meta from "antd/lib/card/Meta"

import { GenealogyTreeMetadata } from "@/contract"
import Link from "next/link"

const CollectionCard: FC<GenealogyTreeMetadata> = (props) => {
  return (
    <Link href={`/family/${encodeURIComponent(props.id)}`}>
      <Card
        hoverable
        cover={
          <img
            alt={props.description}
            src={props.uri} />
        }
      >
        <Meta title={props.name}
          description={props.description} />
      </Card>
    </Link>
  )
}

export default CollectionCard
