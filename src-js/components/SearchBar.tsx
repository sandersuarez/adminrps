import React from 'react'
import IconSearch from './svg/IconSearch'
import styled from '@emotion/styled'
import Input from './Input'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'
import margins from '../styles/margins'

const Container = styled.article`
  --iconDimensions: 1.8rem;

  display: flex;
  align-items: center;
  background: ${ colors.background };
  border-radius: 999rem;
  border: 1px solid ${ colors.primary };
  margin-top: 1rem;
  padding-right: 1rem;
  max-width: 56.4rem;

  svg {
    width: var(--iconDimensions);
    height: var(--iconDimensions);
    margin-left: ${ margins.mobile.littleGap };
  }

  input {
    flex-basis: 0;
    flex-grow: 1;
    background: transparent;
    border: none;
  }

  ${ breakpoints.tablet } {
    margin-top: 2rem;
    border-radius: 2.3rem;
    padding-right: 1.5rem;

    svg {
      margin-left: 1.5rem;
    }
  }
`

/**
 * Component that contains an input that accepts text to search elements.
 */
const SearchBar = () => {
  return (
    <Container>
      <IconSearch />
      <Input type={ 'text' } maxLength={ 300 } />
    </Container>
  )
}
export default SearchBar