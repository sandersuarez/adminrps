import React, { FC, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import breakpoints from '../../styles/breakpoints'
import SearchBar from '../SearchBar'
import NoteContainer from '../NoteContainer'
import Alert from '../Alert'
import Note, { NoteProps } from '../Note'
import Pagination from '../Pagination'
import fonts from '../../styles/fonts'
import margins from '../../styles/margins'
import Button from '../buttons/Button'
import { css } from '@emotion/react'
import ButtonTypes from '../../shapes/ButtonTypes'
import { GetOrders, OrderMessage, OrderMessageTypes } from '../../hooks/useOrders'
import AlertTypes from '../../shapes/AlertTypes'
import Panels from '../../shapes/Panels'
import OrderShape from '../../shapes/OrderShape'
import { forEach } from 'lodash'

const Container = styled.article`
  margin-top: ${ margins.mobile.bigVertical };
  display: flex;
  flex-direction: column;
  gap: ${ margins.mobile.mediumVertical };

  ${ Note } {
    h3 {
      ${ fonts.orderNumber }
    }
  }

  ${ breakpoints.tablet } {
    margin-top: ${ margins.tablet.bigVertical };
    gap: ${ margins.tablet.mediumVertical };
  }

  ${ breakpoints.smallDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 3;
      }
    }
  }

  ${ breakpoints.mediumDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 6;
      }
    }
  }

  ${ breakpoints.bigDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 3;
      }
    }
  }

  ${ breakpoints.veryBigDesktop } {
    ${ Note } {
      &:not(:nth-of-type(n+5)) {
        grid-column-end: span 4;
      }
    }
  }
`

interface IProps {
  activePage: number
  totalPages: number
  setActivePage: (page: number) => void
  setFirstSidePanel: (Panel: Panels) => void
  handleOpenSidePanel: () => void
  handleNewOrder: () => void
  message: OrderMessage | undefined
  setColMessage: (message: OrderMessage | undefined) => void
  getOrders: (data: GetOrders['Request']) => void
  orders: OrderShape[] | undefined
  triggerGetOrders: boolean
  setTriggerGetOrders: (state: boolean) => void
}

/*
<SearchBar />
      <Alert message={ 'error' } type={ 'error' } />
      <NoteContainer noteList={ [] } />
      <Pagination />
 */

/**
 * Component that contains all the data to manage the active orders of the user. It lists them, and provides a search
 * bar to filter by phone number or customer name, pagination, and responsive styles to make them awesome in all
 * kind of versions.
 */
const ActiveOrders: FC<IProps> = (
  {
    activePage,
    totalPages,
    setActivePage,
    setFirstSidePanel,
    handleOpenSidePanel,
    handleNewOrder,
    message,
    setColMessage,
    getOrders,
    orders,
    triggerGetOrders,
    setTriggerGetOrders,
  }) => {

  const [phoneNameCustomer, setPhoneNameCustomer] = useState<string>('')
  const [notes, setNotes] = useState<ReactElement<NoteProps>[]>()

  const [matchesTablet, setMatchesTablet] =
    useState<boolean>(window.matchMedia('(min-width: 700px)').matches)

  const doGetOrders = () => {
    // noinspection SpellCheckingInspection
    getOrders({
      telnamecustomer: phoneNameCustomer,
      orders_number: matchesTablet ? 30 : 16,
      today: 1,
    })
  }

  const handleClick: MouseEventHandler<HTMLElement> = (e) => {
    /*setFirstSidePanel(Panels.Orders)
    getOrder(Number(e.currentTarget.id))
    handleOpenSidePanel()*/
  }

  const generateNotes = () => {
    let notes: ReactElement<NoteProps>[] = []
    if (orders !== undefined) {
      forEach(orders, (order, index) => {

        // noinspection SpellCheckingInspection
        notes.push(
          <Note
            key={ index }
            index={ index }
            id={ order.codorder.toString() }
            order={ order }
            setColOrderMessage={ setColMessage }
            onClick={ handleClick }
          />,
        )
      })
    }
    setNotes(notes)
  }

  useEffect(() => {
    if (phoneNameCustomer != '') {
      setColMessage(undefined)
    }
  }, [phoneNameCustomer])

  useEffect(doGetOrders, [activePage, phoneNameCustomer, matchesTablet])
  useEffect(generateNotes, [orders])

  useEffect(() => {
    window
      .matchMedia('(min-width: 700px)')
      .addEventListener('change', e => setMatchesTablet(e.matches))
  }, [])

  useEffect(() => {
    if (triggerGetOrders) {
      setTriggerGetOrders(false)
      doGetOrders()
    }
  }, [triggerGetOrders])

  return (
    <Container>
      <h2>Pedidos en elaboración</h2>
      {
        message !== undefined && message.type === OrderMessageTypes.Info &&
        <Alert message={ message.content } type={ AlertTypes.Empty } />
      }
      {
        message !== undefined && message.type === OrderMessageTypes.Error &&
        <Alert message={ message.content + '. Contacte con el administrador.' } type={ AlertTypes.Error } />
      }
      {
        message !== undefined && message.type === OrderMessageTypes.Warning &&
        <Alert message={ message.content } type={ AlertTypes.Warning } />
      }
      <Button
        customType={ ButtonTypes.Primary }
        css={ css`align-self: start` }
        onClick={ handleNewOrder }
      >
        { 'Nuevo pedido' }
      </Button>
      <SearchBar searchString={ phoneNameCustomer } setSearchString={ setPhoneNameCustomer } />
      {
        orders !== undefined &&
        <>
          <NoteContainer noteList={ notes } />
          <Pagination activePage={ activePage } totalPages={ totalPages } setActivePage={ setActivePage } />
        </>
      }
    </Container>
  )
}

export default ActiveOrders