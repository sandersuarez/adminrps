import React, { FC, Key, MouseEventHandler, useEffect, useRef } from 'react'
import Button from '../buttons/Button'
import fonts from '../../styles/fonts'
import ButtonTypes from '../../shapes/ButtonTypes'
import IconDown from '../svg/IconDown'
import DetailsArrow from '../details/DetailsArrow'
import DetailsContent from '../details/DetailsContent'
import DetailsSummary from '../details/DetailsSummary'
import Details from '../details/Details'

export interface EditableCustomerProps {
  key: Key
  index: Key
  name: string
  phoneNumber: string
  removable: boolean
  handleCustomerClick: (index: Key) => void
  handleOpenSidePanel: () => void
  openedElement: Key
}

const EditableCustomer: FC<EditableCustomerProps> = (
  {
    name,
    phoneNumber,
    removable,
    handleCustomerClick,
    handleOpenSidePanel,
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
    <Details
      transition={ { ease: 'easeOut', duration: .3 } }
      animate={ (openedElement === index) ? { height: 'auto' } : { height: `${ height }` } }
      ref={ containerRef }
    >
      <DetailsSummary onClick={ handleClick! }>
        <p>{ name } ({ phoneNumber })</p>
        <DetailsArrow
          animate={ (openedElement === index) ? { rotate: 180 } : {} }
          transition={ { ease: 'easeOut', duration: .3 } }
        >
          <IconDown />
        </DetailsArrow>
      </DetailsSummary>
      <DetailsContent>
        <Button customType={ ButtonTypes.Secondary } onClick={ handleOpenSidePanel }>Editar</Button>
        <Button customType={ ButtonTypes.Danger } disabled={ !removable }>Eliminar</Button>
        {
          !removable &&
          <p css={ fonts.formMessage }>No es posible eliminar este cliente porque tiene pedidos registrados a su
            nombre.</p>
        }
      </DetailsContent>
    </Details>
  )
}

export default EditableCustomer