import React, { FC, Key, MouseEventHandler, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import colors from '../../styles/colors'
import Button from '../Button'
import fonts from '../../styles/fonts'
import breakpoints from '../../styles/breakpoints'
import ButtonTypes from '../../shapes/ButtonTypes'
import { motion } from 'framer-motion'
import margins from '../../styles/margins'
import IconDown from '../svg/IconDown'

const Container = styled(motion.details)`
  --lateral-padding: 1em;

  display: flex;
  padding-left: var(--lateral-padding);
  padding-right: var(--lateral-padding);
  border-radius: .5rem;
  border: 1px solid ${ colors.primary };
  overflow: hidden;

  p {
    margin: 0;
  }
`

const Summary = styled.summary`
  --vertical-padding: .75em;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--vertical-padding);
  padding-bottom: var(--vertical-padding);

  p {
    overflow: hidden;
    white-space: nowrap;
  }
`

const Content = styled.div`
  --horizontal-margin: ${ margins.mobile.vertical };
  --vertical-margin: ${ margins.mobile.vertical };
  --vertical-padding: .75em;

  display: flex;
  flex-wrap: wrap;
  padding-top: var(--vertical-padding);
  padding-bottom: var(--vertical-padding);
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

const DetailArrow = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg {
    width: 1.4rem;
  }
`

export interface CustomerProps {
  key: Key
  index: Key
  name: string
  phoneNumber: string
  removable: boolean
  handleCustomerClick: (index: Key) => void
  openedElement: Key
}

const EditableCustomer: FC<CustomerProps> = (
  {
    name,
    phoneNumber,
    removable,
    handleCustomerClick,
    openedElement,
    index,
  },
) => {

  const [height, setHeight] = React.useState<string>('unset')

  const containerRef = useRef<HTMLDetailsElement | null>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()

    if (openedElement === index) {
      handleCustomerClick('')
    } else {
      handleCustomerClick(index)
    }

    if (!containerRef.current!.open) {
      containerRef.current!.open = true
    }
  }

  useEffect(() => {
    setHeight(`${ containerRef.current!.offsetHeight }px`)
  }, [])

  return (
    <Container
      transition={ { ease: 'easeOut', duration: .3 } }
      animate={ (openedElement === index) ? { height: 'auto' } : { height: `${ height }` } }
      onClick={ handleClick! }
      ref={ containerRef }
    >
      <Summary>
        <p>{ name } ({ phoneNumber })</p>
        <DetailArrow
          animate={ (openedElement === index) ? { rotate: 180 } : null }
          transition={ { ease: 'easeOut', duration: .3 } }
        >
          <IconDown />
        </DetailArrow>
      </Summary>
      <Content>
        <Button customType={ ButtonTypes.Secondary }>Editar</Button>
        <Button customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar</Button>
        {
          removable &&
          <p css={ fonts.formMessage }>No es posible eliminar este cliente porque tiene pedidos registrados a su
            nombre.</p>
        }
      </Content>
    </Container>
  )
}

export default EditableCustomer