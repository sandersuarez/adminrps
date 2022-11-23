import styled from '@emotion/styled'
import margins from '../../styles/margins'

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  row-gap: ${ margins.mobile.vertical };
  
  & > div {
    display: flex;
    flex-direction: column;
  }
`

export default FieldWrapper