import React from 'react'
import IconSearch from './svg/IconSearch'

const SearchBar = () => {
  return (
    <article>
      <IconSearch />
      <input type='text' maxLength={ 300 } />
    </article>
  )
}
export default SearchBar