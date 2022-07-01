import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled'
import colors from '../styles/colors'
import IconUpDown from './svg/IconUpDown'
import breakpoints from '../styles/breakpoints'
import { css } from '@emotion/react'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-basis: 28rem;
  margin: 2rem 0 0 0;

  p {
    margin: 0 0 1.5rem 0;
    font-weight: bold;
  }

  ${ breakpoints.tablet } {
    flex-basis: 46rem;
  }
`

const Controls = styled.div`
  display: flex;
  flex-basis: 28rem;
  align-self: center;
  justify-content: stretch;
  height: 3.5rem;

  button {
    flex-shrink: 0;
    padding: 0 .9rem;
  }

  ${ breakpoints.tablet } {
    height: 4.5rem;
    flex-basis: 46rem;

    button {
      padding: 0 2rem;
    }
  }
`

const PageNumber = styled.div`
  display: flex;
  flex-grow: 1;
  background: ${ colors.section };

  // reset input
  input {
    width: 100%;
    appearance: none;
    font: inherit;
    border: none;
    background: transparent;
    text-align: center;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }
  }
`

const buttonStyles = {
  base: css`
    // reset styles
    cursor: pointer;
    border: none;
    font: inherit;
    opacity: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    background: ${ colors.section };
    border-radius: 0;
    padding: 0;
    height: unset;
  `,

  firstPage: css`
    width: 5rem;
    margin: 0 1rem 0 0;
    border-radius: 2.3rem 0 0 2.3rem;

    svg {
      transform: rotate(270deg);

      &:nth-of-type(1) {
        margin: 0 -.3rem 0 .3rem;
      }

      &:nth-of-type(2) {
        margin: 0 .3rem 0 -.3rem;
      }
    }

    ${ breakpoints.tablet } {
      margin: 0 1.5rem 0 0;
      width: 8.2rem;

      svg {
        height: .88rem;
      }
    }
  `,

  previousPage: css`
    width: 3.5rem;
    margin: 0 1rem 0 0;

    svg {
      transform: rotate(270deg);
      margin-right: .2rem;
    }

    ${ breakpoints.tablet } {
      margin: 0 1.5rem 0 0;
      width: 5.8rem;
    }
  `,

  nextPage: css`
    width: 3.5rem;
    margin: 0 0 0 1rem;

    svg {
      transform: rotate(90deg);
      margin-left: .2rem;
    }

    ${ breakpoints.tablet } {
      margin: 0 0 0 1.5rem;
      width: 5.8rem;
    }
  `,

  lastPage: css`
    width: 5rem;
    margin: 0 0 0 1rem;
    border-radius: 0 2.3rem 2.3rem 0;

    svg {
      transform: rotate(90deg);

      &:nth-of-type(1) {
        margin: 0 -.3rem 0 .3rem;
      }
    ;

      &:nth-of-type(2) {
        margin: 0 .3rem 0 -.3rem;
      }
    }

    ${ breakpoints.tablet } {
      margin: 0 0 0 1.5rem;
      width: 8.2rem;

      svg {
        height: .88rem;
      }
    }
  `,
}

const PaginationButton: FC<{ className?: string, children?: ReactNode }> = ({ className, children }) => (
  <button className={ className } css={ buttonStyles.base } children={ children } />
)

const Pagination = () => {
  return (
    <Wrapper>
      <Container>
        <p>X páginas de resultados</p>
        <Controls>
          <PaginationButton css={ buttonStyles.firstPage }>
            <IconUpDown />
            <IconUpDown />
          </PaginationButton>
          <PaginationButton css={ buttonStyles.previousPage }>
            <IconUpDown />
          </PaginationButton>
          <PageNumber>
            <input type={ 'number' } min={ 1 } defaultValue={ 1 } />
          </PageNumber>
          <PaginationButton css={ buttonStyles.nextPage }>
            <IconUpDown />
          </PaginationButton>
          <PaginationButton css={ buttonStyles.lastPage }>
            <IconUpDown />
            <IconUpDown />
          </PaginationButton>
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default Pagination