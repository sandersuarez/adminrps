import React, { FC } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import breakpoints from '../../styles/breakpoints'
import margins from '../../styles/margins'
import fonts from '../../styles/fonts'
import { css } from '@emotion/react'
import IconDown from '../svg/IconDown'
import IconUp from '../svg/IconUp'

const ResetButton = styled.button`
  border: none;
  font: inherit;
  opacity: 1;
  appearance: none;
`

const RemoveButton = styled(ResetButton)`
  background: ${ colors.danger };
  color: ${ colors.background };
  border-radius: 999em;
  padding: .22em .3em;
  ${ fonts.orderNumber }
`

const ArrowButton = styled(ResetButton)`
  display: flex;
  background: ${ colors.primary };
  border-radius: 999em;
  padding: .85em .7em;
  
  svg {
    fill: ${ colors.background };
    width: .8em;
  }
`

const CellWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${ margins.mobile.littleGap };
`

const Gradient = styled.div`
  position: absolute;
  width: 100%;
  height: ${ margins.mobile.mediumVertical };
  bottom: 0;
  left: 0;
  background: linear-gradient(0deg, ${ colors.background } 20%, transparent 100%);
`

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border-color: ${ colors.separators };

  thead {
    border-bottom: 1px solid;
  }

  td:not(:first-of-type), th:not(:first-of-type) {
    border-left: solid 1px;
  }

  tbody tr:last-of-type {
    border-top: solid 1px;
    font-weight: bold;
  }

  th,
  tbody tr:last-of-type td:nth-of-type(2),
  tbody tr:not(:last-of-type) td:nth-of-type(2) {
    text-align: center;
  }

  td:not(:nth-of-type(1)) {
    text-align: right;
  }

  th, td {
    padding: ${ margins.mobile.tinyLateral } ${ margins.mobile.littleGap };
  }

  tr:first-of-type td {
    padding-top: ${ margins.mobile.mediumVertical };
  }

  tr:nth-last-of-type(2) td {
    padding-bottom: ${ margins.mobile.mediumVertical };
  }

  span {
    white-space: nowrap;
  }
`

const TableContainer = styled.div`
  padding: ${ margins.mobile.lateral };
  background: ${ colors.background };
  max-height: 25.6rem;
  overflow-y: auto;
  cursor: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  ${ breakpoints.bigDesktop } {
    max-height: 19.2rem;
  }
`

const Container = styled.div`
  position: relative;
`

interface OrderProductsTableProps {
  className?: string
  editable: boolean
}

/**
 * Component that renders a products resume table for an order. The resume table may let the user edit the list. It
 * contains the name of the product with the unitary price, the amount, and the total price.
 */
const OrderProductsTable: FC<OrderProductsTableProps> = ({ className, editable }) => {
  // todo: render table depending on a products prop
  return (
    <Container className={ className }>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th scope={ 'col' }></th>
              <th scope={ 'col' }>{ 'Cantidad' }</th>
              <th scope={ 'col' }>{ 'Precio' }</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope={ 'row' }>
                {
                  editable ?
                    <CellWrapper>
                      <RemoveButton>
                        <i className={ 'bi bi-x' } />
                      </RemoveButton>
                      <div>{ 'Agua ' }<span>{ '(1,00 €)' }</span></div>
                    </CellWrapper>
                    :
                    <>{ 'Agua ' }<span>{ '(1,00 €)' }</span></>
                }
              </td>
              <td>
                {
                  editable ?
                    <CellWrapper css={ css`justify-content: center` }>
                      <ArrowButton>
                        <IconDown/>
                      </ArrowButton>
                      { 1 }
                      <ArrowButton>
                        <IconUp/>
                      </ArrowButton>
                    </CellWrapper>
                    :
                    1
                }
              </td>
              <td>{ '1,00 €' }</td>
            </tr>
            <tr>
              <td scope={ 'row' }>
                {
                  editable ?
                    <CellWrapper>
                      <RemoveButton>
                        <i className={ 'bi bi-x' } />
                      </RemoveButton>
                      <div>{ 'Pollo ' }<span>{ '(5,00 €)' }</span></div>
                    </CellWrapper>
                    :
                    <>{ 'Pollo ' }<span>{ '(5,00 €)' }</span></>
                }
              </td>
              <td>
                {
                  editable ?
                    <CellWrapper css={ css`justify-content: center` }>
                      <ArrowButton>
                        <IconDown/>
                      </ArrowButton>
                      { 1 }
                      <ArrowButton>
                        <IconUp/>
                      </ArrowButton>
                    </CellWrapper>
                    :
                    1
                }
              </td>
              <td>{ '5,00 €' }</td>
            </tr>
            <tr>
              <td scope={ 'row' }>
                {
                  editable ?
                    <CellWrapper>
                      <RemoveButton>
                        <i className={ 'bi bi-x' } />
                      </RemoveButton>
                      <div>{ 'Patatas ' }<span>{ '(5,00 €)' }</span></div>
                    </CellWrapper>
                    :
                    <>{ 'Patatas ' }<span>{ '(5,00 €)' }</span></>
                }
              </td>
              <td>
                {
                  editable ?
                    <CellWrapper css={ css`justify-content: center` }>
                      <ArrowButton>
                        <IconDown/>
                      </ArrowButton>
                      { 1 }
                      <ArrowButton>
                        <IconUp/>
                      </ArrowButton>
                    </CellWrapper>
                    :
                    1
                }
              </td>
              <td>{ '5,00 €' }</td>
            </tr>
            <tr>
              <td scope={ 'row' }></td>
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