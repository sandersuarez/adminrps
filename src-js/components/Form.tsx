import React from 'react'
import styled from '@emotion/styled'
import margins from '../styles/margins'

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
  }

  input {
    align-self: stretch;
  }
`

export default Form