import React from 'react'
import IconSearch from './svg/IconSearch'
import styled from '@emotion/styled'
import Input from './Input'
import colors from '../styles/colors'
import breakpoints from '../styles/breakpoints'

const Container = styled.article(
  {
    display: 'flex',
    alignItems: 'center',
    background: colors.background,
    border: '1px solid',
    borderRadius: '1.8rem',
    borderColor: colors.primary,
    margin: '1rem 0 0 0',
    padding: '0 1rem 0 0',
    maxWidth: '51.2rem',
    svg: {
      width: '1.8rem',
      height: '1.8rem',
      margin: '0 0 0 1rem',
    },
    input: {
      flex: '0% 1 1',
      background: 'transparent',
      border: 'none',
    },
    [breakpoints.tablet]: {
      margin: '2rem 0 0 0',
      borderRadius: '2.3rem',
      padding: '0 1.5rem 0 0',
      svg: {
        margin: '0 0 0 1.5rem',
      },
    },
  },
)

const SearchBar = () => {
  return (
    <Container>
      <IconSearch />
      <Input type='text' maxLength={ 300 } customType={ 'invisible' } />
    </Container>
  )
}
export default SearchBar