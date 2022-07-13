import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div({
  display: 'none',
  position: 'relative',
  margin: '1rem 0 0 0',
  [breakpoints.smallDesktop]: {
    display: 'unset',
  },
})

const TableContainer = styled.div({
  padding: '1rem',
  background: colors.background,
  maxHeight: '25.6rem',
  overflowY: 'auto',
  msOverflowStyle: 'none',
  cursor: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [breakpoints.bigDesktop]: {
    maxHeight: '19.2rem',
  },
})

const Table = styled.table({
  borderCollapse: 'collapse',
  width: '100%',
  borderColor: colors.text,
  thead: {
    borderBottom: '1px solid',
  },
  'td:not(:first-of-type), th:not(:first-of-type)': {
    borderLeft: 'solid 1px',
  },
  'tbody tr:last-of-type': {
    borderTop: 'solid 1px',
    fontWeight: 'bold',
  },
  'th, tbody tr:last-of-type td:nth-of-type(2)': {
    textAlign: 'center',
  },
  'td:not(:nth-of-type(1))': {
    textAlign: 'right',
  },
  'th, td': {
    padding: '0.5rem 1rem',
  },
  'tr:first-of-type td': {
    paddingTop: '1rem',
  },
  'tr:nth-last-of-type(2) td': {
    paddingBottom: '1rem',
  },
  span: {
    whiteSpace: 'nowrap',
  },
})

const Gradient = styled.div({
  position: 'absolute',
  width: '100%',
  height: '1rem',
  bottom: 0,
  left: 0,
  background: 'linear-gradient(0deg, ' + colors.background + ' 0%, transparent 100%)',
})

interface OrderProductsTableProps {
  className?: string
}

/**
 * Component that renders a products resume table for an order. The resume table may let the user edit the list. It
 * contains the name of the product with the unitary price, the amount, and the total price.
 */
const OrderProductsTable: FC<OrderProductsTableProps> = ({ className }) => {
  // todo: render table depending on a products prop
  return (
    <Container className={ className }>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th scope='col'></th>
              <th scope='col'>{ 'Cantidad' }</th>
              <th scope='col'>{ 'Precio' }</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ 'Agua ' }<span>{ '(1,00 €)' }</span></td>
              <td>{ 1 }</td>
              <td>{ '1,00 €' }</td>
            </tr>
            <tr>
              <td scope='row'>{ 'Pollo ' }<span>{ '(5,00 €)' }</span></td>
              <td>{ 1 }</td>
              <td>{ '5,00 €' }</td>
            </tr>
            <tr>
              <td scope='row'>{ 'Patatas ' }<span>{ '(5,00 €)' }</span></td>
              <td>{ 1 }</td>
              <td>{ '5,00 €' }</td>
            </tr>
            <tr>
              <td scope='row'></td>
              <td>{ 'Total' }</td>
              <td>{ '11,00 €' }</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
      <Gradient />
    </Container>
  )
}

export default styled(OrderProductsTable)``