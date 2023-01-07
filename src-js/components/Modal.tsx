import React, { FC, ReactElement } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import { ButtonProps } from './buttons/Button'
import margins from '../styles/margins'
import Options from './buttons/Options'

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(255, 255, 255, .7);
`

const Container = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 40rem;
  background: ${ colors.section };
  padding-bottom: ${ margins.mobile.mediumVertical };
  box-shadow: 0 10px 15px 3px rgba(0, 0, 0, 0.35);

  ${ Options } {
    margin-top: unset !important;
    margin-left: ${ margins.mobile.lateral };
    margin-right: ${ margins.mobile.lateral };
  }
  
  p {
    margin: 0 ${ margins.tablet.lateral } ${ margins.tablet.mediumVertical } ${ margins.tablet.lateral };
  }
`

const TopBar = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: row-reverse;
  background: ${ colors.primary };
  margin-bottom: ${ margins.mobile.mediumVertical };
`

const CloseButton = styled.button`
  // reset styling
  border: none;
  font: inherit;
  opacity: 1;
  appearance: none;

  background-color: transparent;
  color: ${ colors.background };
  padding: 0 .1em;
  margin: -.05em 0;
  font-size: 1.8em;
`

export interface AlertProps {
  cancel: () => void
  message: string
  leftButton: ReactElement<ButtonProps>
  rightButton: ReactElement<ButtonProps>
}

/**
 * Component that defines a modal that shows to confirm an action.
 */
const Modal: FC<AlertProps> = (
  { cancel, message, leftButton, rightButton },
) => (
  <Wrapper>
    <Container>
      <TopBar>
        <CloseButton onClick={ cancel }>
          <i className={ 'bi bi-x' } />
        </CloseButton>
      </TopBar>
      <p>{ message }</p>
      <Options>
        { leftButton }
        { rightButton }
      </Options>
    </Container>
  </Wrapper>
)

export default Modal
