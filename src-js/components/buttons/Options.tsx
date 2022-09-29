import React from 'react'
import styled from '@emotion/styled'
import margins from '../../styles/margins'
import breakpoints from '../../styles/breakpoints'

const Options = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: ${ margins.mobile.vertical };

  button:nth-of-type(2), button:nth-of-type(3) {
    white-space: break-spaces;
  }

  ${ breakpoints.tablet } {
    gap: 2rem;
    margin-top: 2rem;
  }
`

export default Options