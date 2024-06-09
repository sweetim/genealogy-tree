import {
  Avatar,
  Space,
} from "antd"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  return (
    <div className="h-full flex items-start flex-row">
      <Image
        className="absolute top-0  left-0 -z-10 object-cover h-screen w-screen"
        src="/bg_family.png"
        alt="bg_1"
        width={1280}
        height={720}
      />
      <div className="mx-20 mt-32 p-5 h-1/3 rounded-xl">
        <Space direction="vertical" size="large">
          <Space>
            <Avatar className="!bg-zinc-800 !p-2" size={68} src="/tree.svg" />
            <h1 className="text-4xl">Genealogy Tree</h1>
          </Space>
          <Space direction="vertical" size="small">
            <h2 className="text-6xl">
              I have <strong>planted</strong> mine,
            </h2>
            <h2 className="text-black text-6xl">
              have <strong>you</strong>?
            </h2>
          </Space>
          <Space className="mt-10" size="large">
            <Link href="/create">
              <div className="cursor-pointer rounded-xl p-5 min-w-48 hover:font-bold border-none text-white bg-zinc-800 hover:bg-zinc-600">
                <Space direction="vertical" size="large" align="center" className="w-full">
                  <Image className="min-h-16 max-h-16" src="/plant_now.png" width={64} height={64} alt="plant_now" />
                  <h1>Plant now</h1>
                </Space>
              </div>
            </Link>
            <Link href="/collection">
              <div className="cursor-pointer rounded-xl p-5 min-w-48 hover:font-bold border-none text-white bg-zinc-800 hover:bg-zinc-600">
                <Space direction="vertical" size="large" align="center" className="w-full">
                  <Image className="min-h-16 max-h-16" src="/forest.png" width={64} height={64} alt="forest" />
                  <h1>Explore forests</h1>
                </Space>
              </div>
            </Link>
          </Space>
        </Space>
      </div>
    </div>
  )
}
