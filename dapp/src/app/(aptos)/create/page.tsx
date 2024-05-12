import Image from "next/image"

import CreateCollectionForm from "@/modules/collections/components/CreateCollectionForm"

export default function CreatePage() {
  return (
    <div className="flex h-full justify-center items-center flex-col">
      <Image className="p-1.5 content-center"
        src="https://st2.depositphotos.com/3842881/5486/i/450/depositphotos_54861319-stock-illustration-grandparents-with-grandchildred.jpg"
        alt="family potrait"
        width={400}
        height={400} />
      <div className="text-center">
        <CreateCollectionForm />
      </div>
    </div>
  )
}
