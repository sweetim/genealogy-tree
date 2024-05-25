import { FC } from "react"
import Image from "next/image"

type LoadingGifProps = {
  className?: string
  text?: string
}

const LoadingGif: FC<LoadingGifProps> = ({ className, text }) => {
  const loadingText = text || "seeding and growing tree..."

  return (
    <div className={`flex justify-center items-center h-full flex-col ${className}`}>
      <Image
        src="/growing_tree.webp"
        width={250}
        height={250}
        alt="growing tree"
      />
      <p>{loadingText}</p>
    </div>
  )
}

export default LoadingGif
