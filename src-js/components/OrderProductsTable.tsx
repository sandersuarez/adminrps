import React from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div({
  display: 'none',
  flexFlow: 'column',
  background: colors.background,
  minWidth: 'max-content',
  margin: '1rem 0 0 0',
  [breakpoints.tablet]: {
    display: 'flex',
  },
})

const Row = styled.div({
  display: 'flex',
})

const OrderProductsTable = () => {
  return (
    <Container>
      <Row>
        <div></div>
        <div>{ 'Cantidad' }</div>
        <div>{ 'Precio' }</div>
      </Row>
      <Row>
        <div>{ 'Agua (1,00€)' }</div>
        <div>{ 1 }</div>
        <div>{ '1,00€' }</div>
      </Row>
      <Row>
        <div>{ 'Agua (1,00€)' }</div>
        <div>{ 1 }</div>
        <div>{ '1,00€' }</div>
      </Row>
      <Row>
        <div></div>
        <div>{ 'Total' }</div>
        <div>{ '11,00€' }</div>
      </Row>
    </Container>
  )
}

export default OrderProductsTable