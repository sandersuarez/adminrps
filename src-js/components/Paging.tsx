import React from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import colors from '../styles/colors'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const Container = styled.div({
  display: 'flex',
  flexFlow: 'column',
  maxWidth: '28rem',
})

const Controls = styled.div({
  display: 'flex',
})

const PageNumber = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: colors.section,
  minWidth: 0,
  input: {
    flex: '10rem 0 1',
    appearance: 'none',
    font: 'inherit',
    border: 0,
    background: 'transparent',
    textAlign: 'center',
    overflow: 'hidden',
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    '&[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button,': {
      appearance: 'none',
      margin: 0,
    },
  },
})

const Paging = () => {
  return (
    <Wrapper>
      <Container>
        <p>X páginas de resultados</p>
        <Controls>
          <Button customType={ 'paging' } />
          <Button customType={ 'paging' } />
          <PageNumber>
            <input type={ 'number' } />
          </PageNumber>
          <Button customType={ 'paging' } />
          <Button customType={ 'paging' } />
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default Paging