import React, { FC, FormEventHandler } from 'react'

interface IProps {
  login: () => void
}

const Login: FC<IProps> = ({ login }) => {

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    login()
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" maxLength={60} required/>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" maxLength={8} required/>
          <button type="submit">Iniciar Sesión</button>
        </div>
      </form>
    </div>
  )
}

export default Login