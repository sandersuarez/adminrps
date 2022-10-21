import React, { ChangeEventHandler, FC } from 'react'
import IconSearch from './svg/IconSearch'
import styled from '@emotion/styled'
import Input from './forms/Input'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.div`
  --icon-dimensions: 1.25em;

  display: flex;
  align-items: center;
  background: ${ colors.background };
  border-radius: 999rem;
  border: 1px solid ${ colors.primary };
  max-width: 56.4rem;

  svg {
    flex-shrink: 0;
    width: var(--icon-dimensions);
    height: var(--icon-dimensions);
    margin-left: 1.25em;
  }

  input {
    flex-basis: 0;
    flex-grow: 1;
    background: transparent;
    border: none;
    min-width: 0;
  }

  ${ breakpoints.tablet } {
    margin-top: 2rem;
  }
`

interface IProps {
  searchString: string
  setSearchString: (searchString: string) => void
}

/**
 * Component that contains an input that accepts text to search elements.
 */
const SearchBar: FC<IProps> = ({ searchString, setSearchString }) => {

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchString(e.currentTarget.value.trim())
  }

  return (
    <Container>
      <IconSearch />
      <Input type={ 'text' } maxLength={ 300 } value={ searchString } onChange={ handleChange } />
    </Container>
  )
}
export default SearchBar