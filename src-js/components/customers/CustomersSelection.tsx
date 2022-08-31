import React, { FC } from 'react'
import styled from '@emotion/styled'
import SearchBar from '../SearchBar'
import Alert from '../Alert'
import Pagination from '../Pagination'
import CustomersContainer from './CustomersContainer'
import margins from '../../styles/margins'
import Button from '../buttons/Button'
import ButtonTypes from '../../shapes/ButtonTypes'
import Options from '../Options'
import Customer from './Customer'

const Container = styled.article`
  display: flex;
  flex-direction: column;
  row-gap: ${ margins.mobile.mediumVertical };
  padding: ${ margins.mobile.lateral };
`

interface IProps {
  handleCloseSidePanel: () => void
}

const Customers: FC<IProps> = ({ handleCloseSidePanel }) => {
  return (
    <Container>
      <SearchBar />
      <Options>
        <Button customType={ ButtonTypes.Primary }>{ 'Seleccionar' }</Button>
        <Button customType={ ButtonTypes.Secondary } onClick={ handleCloseSidePanel }>{ 'Cancelar' }</Button>
      </Options>
      <Alert message={ 'error' } type={ 'error' } />
      <CustomersContainer
        customerList=
          { [
            <Customer key={ 0 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 1 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 2 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 3 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 4 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 5 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 6 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 7 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 8 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 9 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 10 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 11 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 12 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 13 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
            <Customer key={ 14 } name={ 'Luisa Santos' } phoneNumber={ '640000000' }
                      handleCloseSidePanel={ handleCloseSidePanel } />,
          ] }
      />
      <Pagination />
    </Container>
  )
}

export default Customers