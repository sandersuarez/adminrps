import styled from '@emotion/styled'
import margins from '../../styles/margins'
import breakpoints from '../../styles/breakpoints'

const DetailsContent = styled.div`
  --horizontal-margin: ${ margins.mobile.vertical };
  --vertical-margin: ${ margins.mobile.vertical };

  display: flex;
  flex-wrap: wrap;
  padding: .75em 1em;
  column-gap: var(--horizontal-margin);
  row-gap: var(--vertical-margin);

  p {
    flex-grow: 1;
    max-width: 36.5rem;
  }

  ${ breakpoints.smallTablet } {
    display: grid;
    grid-template-columns: min-content auto;

    p {
      grid-column: 2;
    }

    button {
      justify-self: start;
    }
  }

  ${ breakpoints.tablet } {
    --horizontal-margin: 2rem;
  }
`

export default DetailsContent