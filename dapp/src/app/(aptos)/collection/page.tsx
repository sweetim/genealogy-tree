import { getAllCollection } from "@/contract"
import CollectionGrid from "@/modules/collections/components/CollectionGrid"

export default async function FamilyPage() {
  const allCollection = await getAllCollection()

  return (
    <CollectionGrid
      className="h-full p-3 bg-zinc-200"
      data={allCollection}
    />
  )
}
