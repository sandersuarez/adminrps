import React, { FC, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import margins from '../styles/margins'
import colors from '../styles/colors'

const Container = styled(motion.p)`
  margin-top: 0;
  margin-bottom: ${ margins.mobile.littleGap };
  color: ${ colors.danger };
`

const ContainerVariants = {
  hide: {
    opacity: 0,
    display: 'none',
  },
  show: {
    opacity: 1,
    display: 'inline',
  },
}

interface IProps {
  message: string
}

/**
 * Component that defines a message to be displayed at the bottom of an input after incorrect validation.
 */
const InputMessage: FC<IProps> = ({ message }) => {
  const [shownMessage, setShownMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (message !== undefined) {
      setShownMessage(message)
    }
  }, [message])

  return (
    <Container
      variants={ ContainerVariants }
      transition={ { ease: 'easeInOut', duration: .3 } }
      initial={ 'hide' }
      animate={ message ? 'show' : 'hide' }
    >
      <i className='bi bi-exclamation-triangle-fill'></i>
      <span>{ '\t' + shownMessage }</span>
    </Container>
  )
}

export default InputMessage