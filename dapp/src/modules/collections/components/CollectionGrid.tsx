import { GenealogyTreeMetadata } from "@/contract"
import { Col, Row } from "antd"
import { FC } from "react"
import CollectionCard from "./CollectionCard"

type CollectionGridProps = {
  data: GenealogyTreeMetadata[]
  className?: string
}

const CollectionGrid: FC<CollectionGridProps> = ({ className, data }) => {
  const renderCollectionCols = () => {
    return data.map(metadata => {
      return (
        <Col key={metadata.id}
          className="gutter-row"
          xs={{ flex: '100%' }}
          sm={{ flex: '50%' }}
          md={{ flex: '25%' }}>
          <CollectionCard {...metadata} />
        </Col>
      )
    })
  }

  return (
    <Row className={`w-full ${className}`} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      {renderCollectionCols()}
    </Row>
  )
}

export default CollectionGrid
