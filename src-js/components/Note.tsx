import React, { FC, Key, MouseEventHandler } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import OrderProductsTable from './orders/OrderProductsTable'
import { DraftMessage, DraftMessageTypes } from '../hooks/useDrafts'
import DraftShape from '../shapes/DraftShape'
import { OrderMessage, OrderMessageTypes } from '../hooks/useOrders'
import OrderShape from '../shapes/OrderShape'

const PickUpTime = styled.p`
  --border-distance: .85em;
  position: absolute;
  line-height: .85em;
  top: var(--border-distance);
  right: var(--border-distance);

  ${ breakpoints.tablet } {
    top: 1.3rem;
    right: 1.6rem;
  }
`

const Container = styled.article`
  position: relative;
  display: flex;
  flex-flow: column;
  background: ${ colors.section };
  padding: .85em;
  min-height: 6.05em;

  h3 {
    line-height: .8em;
    margin-bottom: .85em;
  }

  p {
    margin: 0;

    &:nth-of-type(1) {
      margin-top: auto;
    }

    &:nth-of-type(2) {
      line-height: .9em;
      margin-top: .45em;
      margin-bottom: auto;
    }
  }

  ${ OrderProductsTable } {
    display: none
  }

  ${ breakpoints.tablet } {
    padding: 1.5rem;

    h3 {
      margin: 0 0 1.4rem 0;
    }
  }

  ${ breakpoints.smallDesktop } {
    ${ OrderProductsTable } {
      display: unset
    }
  }
`

export interface NoteProps {
  key: Key
  index: number
  id: string | undefined
  className?: string
  draft?: DraftShape
  order?: OrderShape
  setColDraftMessage?: (message: DraftMessage | undefined) => void
  setColOrderMessage?: (message: OrderMessage | undefined) => void
  onClick: MouseEventHandler<HTMLElement>
}

/**
 * Container that renders a layer as a card for an order or draft depending on its type.
 */
const Note: FC<NoteProps> = (
  {
    className: className,
    index,
    id,
    draft,
    order,
    setColDraftMessage,
    setColOrderMessage,
    onClick,
  },
) => {

  let children
  if (draft !== undefined) {
    children =
      <>
        <h3>{ 'Borrador ' + draft.coddraft }</h3>
        {
          draft.namecustomer !== null && draft.namecustomer !== undefined &&
          <p>{ draft.namecustomer }</p>
        }
        {
          draft.namecustomertmp !== null && draft.namecustomertmp !== undefined &&
          <p>{ draft.namecustomertmp }</p>
        }
        {
          (draft.namecustomer === null || draft.namecustomer === undefined) &&
          (draft.namecustomertmp === null || draft.namecustomertmp === undefined) &&
          <p><i>{ '(Sin nombre)' }</i></p>
        }
        {
          draft.telcustomer !== null && draft.telcustomer !== undefined &&
          <p>{ 'Teléfono: ' + draft.telcustomer }</p>
        }
        {
          draft.telcustomertmp !== null && draft.telcustomertmp !== undefined &&
          <p>{ 'Teléfono: ' + draft.telcustomertmp }</p>
        }
        {
          (draft.telcustomer === null || draft.telcustomer === undefined) &&
          (draft.telcustomertmp === null || draft.telcustomertmp === undefined) &&
          <p>{ 'Teléfono: ' }<i>{ '(Sin teléfono)' }</i></p>
        }
        {
          draft.pickuptime !== null && draft.pickuptime !== undefined &&
          <PickUpTime>{ draft.pickuptime.substring(0, 5) }</PickUpTime>
        }
      </>
  } else if (order !== undefined) {
    children =
      <>
        <h3>{ 'Nº ' + order.numdayorder }</h3>
        <p>{ order.namecustomer }</p>
        <p>{ order.telcustomer }</p>
        <PickUpTime>{ order.pickuptime.substring(0, 5) }</PickUpTime>
        {
          index < 4 &&
          <OrderProductsTable
            orderProducts={ order.products }
          />
        }
      </>
  } else {
    let error = 'Error: No note data value set'
    if (setColDraftMessage !== undefined) {
      setColDraftMessage({ content: error, type: DraftMessageTypes.Error })
    }
    if (setColOrderMessage !== undefined) {
      setColOrderMessage({ content: error, type: OrderMessageTypes.Error })
    }
    if (console && console.error) {
      console.error(error)
    }
  }

  return <Container id={ id } className={ className } onClick={ onClick } children={ children } />
}

export default styled(Note)``
