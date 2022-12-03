import React from 'react'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import Options from '../buttons/Options'
import breakpoints from '../../styles/breakpoints'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: ${ margins.mobile.mediumVertical };

  & > div {
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }

  ${ Options } {
    flex-direction: row;
  }

  ${ breakpoints.tablet } {
    row-gap: ${ margins.tablet.mediumVertical };
  }
`

export default Form