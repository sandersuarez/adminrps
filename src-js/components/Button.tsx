import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'

const Base = styled.button({
  // reset styling
  border: 'none',
  font: 'inherit',
  opacity: 1,
  appearance: 'none',
  // custom styling
  height: '4.5rem',
  padding: '0 1.7rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '2.2rem',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',

  '&[disabled]': {
    opacity: .6,
  }
})

const Button = {

  Secondary: styled(Base)({
    background: colors.secondary,
  }),

  Danger: styled(Base)({
    background: colors.danger,
    color: '#fff',

    '&[disabled]': {
      opacity: .3,
      color: '#000',
    }
  }),

}

export default Button