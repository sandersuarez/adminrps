import styled from '@emotion/styled'
import margins from '../styles/margins'
import breakpoints from '../styles/breakpoints'

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: ${ margins.mobile.mediumVertical };
  margin-bottom: ${ margins.mobile.vertical };

  h2 {
    flex-grow: 1;
    margin: 0;
  }

  ${ breakpoints.tablet } {
    margin-bottom: ${ margins.tablet.gridSpace };
  }
`

export default TitleWrapper