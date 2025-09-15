import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from './api'

interface AuthProps {
  onAuth: (token: string) => void
}

export function Auth({ onAuth }: AuthProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      setError('Email inválido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    try {
      // TODO: Separar páginas de login y registro
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const response = await axios.post(API_URL + endpoint, { email, password })
      onAuth(response.data.access_token)
    } catch (err: any) {
      if (err.response?.status === 409) setError('El email ya está registrado.')
      else if (err.response?.status === 401) setError('Credenciales inválidas.')
      else setError('Error de autenticación.')
    }
  }

  return (
    <div className="container">
      <h2>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Entrar' : 'Registrarse'}</button>
      </form>
      <button
        style={{ marginTop: '1rem' }}
        onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? '¿No tienes cuenta? Regístrate'
          : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}
