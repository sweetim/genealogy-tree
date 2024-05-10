import CollectionGrid from "@/modules/collections/components/CollectionGrid";
import { getAllCollection } from "@/contract";
import { Button } from "antd";
import Image from "next/image"
import Link from "next/link";

export default async function Home() {
  let allCollection = await getAllCollection();

  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="text-center">
        <div className="flex justify-center">
          <Image className="p-1.5 content-center"
            src="https://i.pinimg.com/736x/3d/28/7c/3d287c564e222651c87196b5a6104c39.jpg"
            alt="family potrait"
            width={500}
            height={500} />
        </div>
        <h1 className="text-5xl p-5">Genealogy Tree</h1>
        <p className="text-slate-900">tokenize your family tree here and store them to eternity in the blockchain</p>
        <p className="text-slate-900">roots run deep. plant your family tree now and watch your history blossom for generations to come</p>
      </div>
      <Button className="m-10" shape="round" size="large" type="primary" >
        <Link href="/create">start your family tree now</Link>
      </Button>
      <CollectionGrid data={allCollection} className="p-3" />
    </div>
  );
}
