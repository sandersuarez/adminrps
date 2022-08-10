import React, { FC, Key, MouseEventHandler, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import DetailsButton from '../DetailsButton'
import Button from '../Button'
import fonts from '../../styles/fonts'
import breakpoints from '../../styles/breakpoints'
import ButtonTypes from '../../shapes/ButtonTypes'
import { motion } from 'framer-motion'

const Container = styled(motion.details)`
  display: flex;
  border-radius: 0.5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;

  p {
    margin: 0;
  }
`

const Summary = styled.summary`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    overflow: hidden;
    white-space: nowrap;
  }
`

const Content = styled.div`
  --horizontal-margin: 1rem;
  --vertical-margin: 1rem;
  display: flex;
  flex-wrap: wrap;
  margin-top: .5rem;
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

const NoRemoveMessage = styled.p`
  ${ fonts.formMessage }
`

export interface CustomerProps {
  key: Key
  name: string
  phoneNumber: string
  removable: boolean
}

const EditableCustomer: FC<CustomerProps> = ({ name, phoneNumber, removable }) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [height, setHeight] = React.useState<string>('unset')

  const containerRef = useRef<HTMLDetailsElement | null>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setOpen(!open)
    if (!containerRef.current!.open) {
      containerRef.current!.open = true
    }
  }

  useEffect(() => {
    setHeight(`${ containerRef.current!.offsetHeight }px`)
  }, [])

  const variants = {
    opened: {
      height: 'auto',
    },
    closed: {
      height: `${ height }`,
    },
  }

  return (
    <Container
      variants={ variants }
      transition={ { ease: 'easeOut', duration: .3 } }
      animate={ open ? 'opened' : 'closed' }
      onClick={ handleClick! }
      ref={ containerRef }
    >
      <Summary>
        <p>{ name } ({ phoneNumber })</p>
        <DetailsButton open={ open } />
      </Summary>
      <Content>
        <Button customType={ ButtonTypes.Secondary }>Editar</Button>
        <Button customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar</Button>
        {
          removable &&
          <NoRemoveMessage>No es posible eliminar este cliente porque tiene pedidos registrados a su
            nombre.</NoRemoveMessage>
        }
      </Content>
    </Container>
  )
}

export default EditableCustomer