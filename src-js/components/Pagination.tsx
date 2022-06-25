import React from 'react'
import styled from '@emotion/styled'
import Button from './Button'
import colors from '../styles/colors'
import IconUpDown from './svg/IconUpDown'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
})

const Container = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
  flexBasis: '28rem',
  margin: '1rem 0 0 0',
  p: {
    margin: '0 0 1rem 0',
    fontWeight: 'bold',
  },
})

const Controls = styled.div({
  display: 'flex',
  flexBasis: '28rem',
  alignSelf: 'center',
  height: '3.5rem',
  button: {
    flexShrink: 0,
  },
})

const PageNumber = styled.div({
  display: 'flex',
  flexGrow: 1,
  maxWidth: '10rem',
  background: colors.section,

  // reset input
  input: {
    width: '100%',
    appearance: 'none',
    font: 'inherit',
    border: 'none',
    background: 'transparent',
    textAlign: 'center',
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

const PaginationButton = styled(Button)`
  background: ${ colors.section };
  border-radius: 0;
  padding: 0;
  height: unset;
`

const FirstPageButton = styled(PaginationButton)({
  width: '5rem',
  margin: '0 1rem 0 0',
  svg: {
    transform: 'rotate(270deg)',
  },
})

const PreviousPageButton = styled(PaginationButton)({
  width: '3.5rem',
  margin: '0 1rem 0 0',
  svg: {
    transform: 'rotate(270deg)',
  },
})

const NextPageButton = styled(PaginationButton)({
  width: '3.5rem',
  margin: '0 0 0 1rem',
  svg: {
    transform: 'rotate(90deg)',
  },
})

const LastPageButton = styled(PaginationButton)({
  width: '5rem',
  margin: '0 0 0 1rem',
  svg: {
    transform: 'rotate(90deg)',
  },
})

const Pagination = () => {
  return (
    <Wrapper>
      <Container>
        <p>X páginas de resultados</p>
        <Controls>
          <FirstPageButton customType={ 'paging' }>
            <IconUpDown />
            <IconUpDown />
          </FirstPageButton>
          <PreviousPageButton customType={ 'paging' }>
            <IconUpDown />
          </PreviousPageButton>
          <PageNumber>
            <input type={ 'number' } value={ 1 } />
          </PageNumber>
          <NextPageButton customType={ 'paging' }>
            <IconUpDown />
          </NextPageButton>
          <LastPageButton customType={ 'paging' }>
            <IconUpDown />
            <IconUpDown />
          </LastPageButton>
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default Pagination