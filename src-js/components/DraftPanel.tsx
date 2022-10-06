import styled from '@emotion/styled'
import margins from '../styles/margins'
import { css } from '@emotion/react'
import React, { FC, useEffect } from 'react'
import TitleWrapper from './TitleWrapper'
import ExitButton from './buttons/ExitButton'
import Options from './buttons/Options'
import Button from './buttons/Button'
import ButtonTypes from '../shapes/ButtonTypes'
import OrderProductsTable from './orders/OrderProductsTable'
import Label from './forms/Label'
import Input from './forms/Input'
import Form from './forms/Form'

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  row-gap: ${ margins.mobile.vertical };
`

const Container = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };

  p {
    margin: 0;
  }
`

interface DraftSectionProps {
  draftID?: number
  handleCloseSidePanel: () => void
  handleOpenSecondSidePanel: () => void
}

const DraftPanel: FC<DraftSectionProps> = (
  {
    draftID,
    handleCloseSidePanel,
    handleOpenSecondSidePanel,
  }) => {
  const [newMode, setNewMode] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (draftID) {
      setNewMode(false)
    } else {
      setNewMode(true)
    }
  }, [])

  return (
    <Container>
      <TitleWrapper>
        {
          newMode !== undefined &&
          <>
            <h2>{ newMode ? 'Nuevo Pedido' : 'Borrador: '}</h2>
            <ExitButton onClick={ handleCloseSidePanel }>
              <i className={ 'bi bi-x' } />
            </ExitButton>
          </>
        }
      </TitleWrapper>
    </Container>
  )
}

export default DraftPanel