import React, {FC, ReactNode} from 'react'

const Main: FC<{ children: ReactNode }> = ({children}) => {
  return (
    <main>{children}</main>
  )
}

export default Main