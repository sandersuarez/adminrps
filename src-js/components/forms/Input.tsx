import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import { HTMLMotionProps, motion } from 'framer-motion'

/**
 * Component that defines a custom input to be reused across the application
 */
const MotionInput = styled(motion.input)`
  // reset styling
  appearance: none;
  font: inherit;

  // custom styling
  display: block;
  padding: .75em 1.25em;
  max-width: 51.2rem;
  background: ${ colors.background };
  border-radius: .5rem;
  border: 1px solid ${ colors.primary };

  &:focus {
    outline: none;
    box-shadow: none;
  }
`

interface IProps extends HTMLMotionProps<'input'> {
  valid?: boolean
}

const Input: FC<IProps> = ({ valid = true, ...inputProps }) => {
  return (
    <MotionInput
      transition={ { ease: 'easeInOut', duration: .1 } }
      initial={ { borderColor: colors.primary } }
      animate={ valid ? { borderColor: colors.primary } : { borderColor: colors.danger } }
      { ...inputProps }
    />
  )
}

export default Input