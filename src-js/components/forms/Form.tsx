import React from 'react'
import styled from '@emotion/styled'
import margins from '../../styles/margins'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: ${ margins.mobile.mediumVertical };

  div {
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }

  input {
    align-self: stretch;
    margin-top: ${ margins.mobile.vertical };
  }
`

export default Form