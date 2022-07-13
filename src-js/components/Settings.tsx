import React from 'react'
import PasswordChange from './PasswordChange'
import Input from './Input'
import Button from './Button'
import Label from './Label'

const Settings = () => {
  return (
    <section>
      <h2>Ajustes</h2>
      <form>
        <Label>IVA aplicado:</Label>
        <Input />
        <Button customType={ 'secondary' } >Aplicar IVA</Button>
        <p>Nota: un cambio en el IVA aplicado a los productos se verá reflejado en todos los pedidos, incluidos los
          antiguos.</p>
      </form>
      <PasswordChange />
    </section>
  )
}

export default Settings