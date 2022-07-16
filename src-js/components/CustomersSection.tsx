import React from 'react'
import Customer from './Customer'

const CustomersSection = () => {
  return (
    <section>
      <Customer name={ 'Luisa Santos' } phoneNumber={ '640000000' } editable
                noRemoveMessage={ 'hhhhhhhh hhhhhh hhhhhhhhh hhhhhhh hhhhhhh hhhh hhhhhh hhhhhhhhhhh hh hhhhhhhhh hhhhh hhhhhhhhhh' } />
    </section>
  )
}

export default CustomersSection