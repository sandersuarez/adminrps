import React from 'react'
import styled from '@emotion/styled'
import fonts from '../styles/fonts'
import margins from '../styles/margins'

const Container = styled.section`
  ${ fonts.body }
  h2 {
    ${ fonts.title }
    margin-top: 0;
    margin-bottom: ${ margins.mobile.mediumVertical };
  }
`

const ErrorPage = () => {
  return (
    <Container>
      <h2>{ '¡Ups!' }</h2>
      <p>{ 'Esta página no existe.' }</p>
    </Container>
  )
}

export default ErrorPage