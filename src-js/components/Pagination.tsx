import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import margins from '../styles/margins'

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-self: center;
  row-gap: ${ margins.mobile.vertical };
  column-gap: ${ margins.mobile.littleGap };
`

const pagButtonStyles = css`
  position: relative;
  border-radius: 0;
  padding: 1.4em;

  p {
    position: absolute;
    font-weight: normal;
    margin: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const firstButtonStyles = css`
  margin-right: ${ margins.mobile.littleGap };
  
  @media only screen and (min-width: 26.68em) {
    margin: 0;
  }
`

const lastButtonStyles = css`
  margin-left: ${ margins.mobile.littleGap };

  @media only screen and (min-width: 26.68em) {
    margin: 0;
  }
`

const firstAuxButtonsStyles = css`
  display: none;

  @media only screen and (min-width: 26.68em) {
    display: inherit;
  }
`

const lastAuxButtonsStyles = css`
  display: none;

  @media only screen and (min-width: 33.56em) {
    display: inherit;
  }
`

const PaginationButton: FC<{ className?: string, customType: ButtonTypes, children?: ReactNode }> =
  ({
     className,
     customType,
     children,
   }) => {
    return (
      <Button className={ className } customType={ customType } css={ pagButtonStyles }>
        <p>{ children }</p>
      </Button>
    )
  }

const Pagination = () => {
  return (
    <Container>
      <PaginationButton customType={ ButtonTypes.Auxiliar } css={ firstButtonStyles }>{ 1 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Empty } css={ firstAuxButtonsStyles }>{ '...' }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Auxiliar } css={ lastAuxButtonsStyles }>{ 2 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Auxiliar }>{ 3 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Primary }>{ 4 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Auxiliar }>{ 5 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Auxiliar } css={ lastAuxButtonsStyles }>{ 6 }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Empty } css={ firstAuxButtonsStyles }>{ '...' }</PaginationButton>
      <PaginationButton customType={ ButtonTypes.Auxiliar } css={ lastButtonStyles }>{ 10 }</PaginationButton>
    </Container>
  )
}

export default Pagination