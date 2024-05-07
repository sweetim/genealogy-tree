"use client"

import GenealogyTreeEditor from "@/modules/genealogy-tree/components/GenealogyTreeEditor";

type CollectionPageProps = {
  params: {
    id: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <GenealogyTreeEditor />
  )
}
