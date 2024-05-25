import { Flex } from "antd"
import { FC, ReactElement } from "react"

type CenterDivProps = {
  children: ReactElement
}

const CenterDiv: FC<CenterDivProps> = ({ children }) => {
  return (
    <Flex
      justify="center"
      align="center"
      gap="small"
      vertical
      className="w-full h-full bg-colorful">
      {children}
    </Flex>
  )
}

export default CenterDiv
