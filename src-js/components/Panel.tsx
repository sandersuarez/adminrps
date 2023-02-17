import React from 'react'
import margins from '../styles/margins'
import Options from './buttons/Options'
import breakpoints from '../styles/breakpoints'
import styled from '@emotion/styled'

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }

  ${ Options } {
    flex-direction: initial;

    &:nth-last-of-type(1) {
      margin-top: ${ margins.mobile.mediumVertical };
    }
  }

  ${ breakpoints.tablet } {
    row-gap: ${ margins.tablet.mediumVertical };
    padding: ${ margins.tablet.lateral };

    ${ Options } {
      margin-top: 0;

      &:nth-last-of-type(1) {
        margin-top: ${ margins.tablet.mediumVertical };
      }
    }
  }
`

export default Panel