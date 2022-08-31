import styled from '@emotion/styled'
import margins from '../../styles/margins'

const DetailsSummary = styled.summary`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .75em 1em;
  column-gap: ${ margins.mobile.lateral };

  p {
    overflow: hidden;
    white-space: nowrap;
  }
`

export default DetailsSummary