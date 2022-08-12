import React, { FC } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import IconDown from './svg/IconDown'
import { motion } from 'framer-motion'

const SlideButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`

const svgStyles = css`
  width: 1.4rem;
`

interface IProps {
  open: boolean
}

const DetailsButton: FC<IProps> = ({ open }) => {
  return (
    <SlideButtonContainer animate={ open ? { rotate: 180 } : null } transition={ { ease: 'easeOut', duration: .3 } }>
      <IconDown css={ svgStyles } />
    </SlideButtonContainer>
  )
}

export default DetailsButton