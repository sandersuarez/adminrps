import styled from '@emotion/styled'
import margins from '../../styles/margins'
import breakpoints from '../../styles/breakpoints'

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  row-gap: ${ margins.mobile.gridSpace };

  & > div {
    display: flex;
    flex-direction: column;
  }

  ${ breakpoints.tablet } {
    row-gap: ${ margins.tablet.gridSpace };
  }
`

export default FieldWrapper