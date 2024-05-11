"use client"

import GenealogyTreeEditor from "@/modules/genealogy-tree/components/GenealogyTreeEditor";

type GenealogyTreePageProps = {
  params: {
    id: string
  }
}

export default function CollectionPage({ params }: GenealogyTreePageProps) {
  return (
    <GenealogyTreeEditor />
  )
}
