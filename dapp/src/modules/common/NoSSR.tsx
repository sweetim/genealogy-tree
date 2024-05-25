"use client"

import {
  useEffect,
  useState,
} from "react"
import type {
  FC,
  ReactElement,
} from "react"

type NoSSRProps = {
  children: ReactElement
}

const NoSSR: FC<NoSSRProps> = ({ children }) => {
  const [ hasMounted, setHasMounted ] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

export default NoSSR
