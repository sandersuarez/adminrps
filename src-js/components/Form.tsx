import React from 'react'
import styled from '@emotion/styled'
import margins from '../styles/margins'
import breakpoints from '../styles/breakpoints'
import colors from '../styles/colors'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: ${ margins.mobile.mediumVertical };

  div {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    row-gap: ${ margins.mobile.vertical };

    p {
      margin: 0;
      color: ${ colors.danger };
    }
  }

  input {
    align-self: stretch;
  }

  ${ breakpoints.tablet } {
    margin-top: 2rem;
    row-gap: 1.5rem;
  }
`

export default Form