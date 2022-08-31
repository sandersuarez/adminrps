import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import fonts from '../styles/fonts'

const ExitButton = styled.button`
  // reset styling
  border: none;
  font: inherit;
  opacity: 1;
  appearance: none;

  background: ${ colors.primary };
  color: ${ colors.background };
  border-radius: .25em;
  padding: .22em .3em;
  ${ fonts.orderNumber }
`

export default ExitButton