import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import margins from '../../styles/margins'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 49.4rem;
  margin: auto;
  row-gap: ${margins.mobile.lateral};

  ${ breakpoints.tablet } {
    row-gap: 3rem;
  }

  ${ breakpoints.desktop } {
    flex-flow: row wrap;
    max-width: unset;
    justify-content: flex-start;
    align-items: flex-start;
    height: unset;
    margin-top: 1.5rem;
    column-gap: 3rem;
  }
`

const ArticleButtonsWrapper: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      { children }
    </Wrapper>
  )
}

export default ArticleButtonsWrapper