import React, { FC, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import ButtonTypes from '../shapes/ButtonTypes'
import margins from '../styles/margins'
import PaginationButton from './buttons/PaginationButton'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-self: center;
  row-gap: ${ margins.mobile.vertical };
  column-gap: ${ margins.mobile.littleGap };

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.littleGap };
  }
`

interface IProps {
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
}

const Pagination: FC<IProps> = ({ totalPages, activePage, setActivePage }) => {

  const [breakpoint] = useState<string>(totalPages > 4 ? '33.56em' : '26.68em')
  const [matches, setMatches] = useState<boolean>(window.matchMedia('(min-width: ' + breakpoint + ')').matches)

  useEffect(() => {
    window
      .matchMedia('(min-width: ' + breakpoint + ')')
      .addEventListener('change', e => setMatches(e.matches))
  }, [])

  if (totalPages > 1) {

    const spaceToBegin = activePage - 1
    const spaceToTotal = totalPages - activePage

    return (
      <Container>
        {
          (spaceToBegin > 0) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            css={ (!matches && spaceToBegin > 2) ? css`margin-right: ${ margins.mobile.littleGap }` : null }
            onClick={ () => setActivePage(1) }
          >
            { 1 }
          </PaginationButton>
        }
        {
          ((!matches && spaceToBegin > 2) || (matches && spaceToBegin > 3)) &&
          <PaginationButton customType={ ButtonTypes.Empty }
                            css={ !matches ? css`display: none` : null }>{ '...' }</PaginationButton>
        }
        {
          (spaceToBegin > 2) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            css={ !matches ? css`display: none` : null }
            onClick={ () => setActivePage(activePage - 2) }
          >
            { activePage - 2 }
          </PaginationButton>
        }
        {
          (spaceToBegin > 1) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            onClick={ () => setActivePage(activePage - 1) }
          >
            { activePage - 1 }
          </PaginationButton>
        }
        <PaginationButton customType={ ButtonTypes.Primary }>{ activePage }</PaginationButton>
        {
          (spaceToTotal > 1) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            onClick={ () => setActivePage(activePage + 1) }
          >
            { activePage + 1 }
          </PaginationButton>
        }
        {
          (spaceToTotal > 2) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            css={ !matches ? css`display: none` : null }
            onClick={ () => setActivePage(activePage + 2) }
          >
            { activePage + 2 }
          </PaginationButton>
        }
        {
          ((!matches && spaceToTotal > 2) || (matches && spaceToTotal > 3)) &&
          <PaginationButton customType={ ButtonTypes.Empty }
                            css={ !matches ? css`display: none` : null }>{ '...' }</PaginationButton>
        }
        {
          (spaceToTotal > 0) &&
          <PaginationButton
            customType={ ButtonTypes.Auxiliar }
            css={ (!matches && spaceToTotal > 2) ? css`margin-left: ${ margins.mobile.littleGap }` : null }
            onClick={ () => setActivePage(totalPages) }
          >
            { totalPages }
          </PaginationButton>
        }
      </Container>
    )
  } else {
    return (<></>)
  }
}

export default Pagination