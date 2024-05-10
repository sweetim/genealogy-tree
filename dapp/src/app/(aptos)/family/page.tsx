import Image from "next/image"

export default function FamilyPage() {
  return (
    <div className="flex justify-center items-center h-full flex-col">
      <div className="text-center">
        <div className="flex justify-center">
          <Image className="p-1.5 content-center"
            src="https://st2.depositphotos.com/3842881/5486/i/450/depositphotos_54861319-stock-illustration-grandparents-with-grandchildred.jpg"
            alt="family potrait"
            width={500}
            height={500} />
        </div>
        <h1 className="text-5xl p-5">Create Family</h1>
        <p className="text-slate-900">tokenize your family tree here and store them to eternity in the blockchain</p>
        <p className="text-slate-900">roots run deep. plant your family tree now and watch your history blossom for generations to come</p>
      </div>
    </div>
  )
}
