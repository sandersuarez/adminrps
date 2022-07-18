import React from 'react'
import Customer from './Customer'

const CustomersSection = () => {
  return (
    <section>
      <Customer name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable={ true } removable={ false } />
    </section>
  )
}

export default CustomersSection