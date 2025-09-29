import React, { useState } from 'react'
import { register } from '@/services/apiService'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Register = () => {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
      const data = await register(email, password)
      const token = data.access_token
      localStorage.setItem('token', token)
      setToken(token)
      navigate('/')
    } catch (err: any) {
      if (err.message?.includes('registrado'))
        setError('El email ya está registrado.')
      else if (err.message?.includes('inválidas'))
        setError('Credenciales inválidas.')
      else setError('Error de autenticación.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-sky-900">
      <Card className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <h2
          className="text-4xl font-bold mb-8 text-center text-sky-700"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Registrarse
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 flex flex-col items-center">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="test@gmail.com"
            className="w-full px-4 py-3 rounded-md !bg-sky-100 text-sky-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 focus:!bg-sky-100"
            spellCheck={false}
            autoComplete="off"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-md bg-sky-100 text-sky-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
          <Button
            type="submit"
            className="w-full px-4 py-3 rounded-md bg-sky-700 text-white text-lg font-semibold tracking-wide mt-2 hover:bg-sky-800 transition"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            REGISTRARSE
          </Button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center text-sm font-medium">
            {error}
          </div>
        )}
        <Link
          className="block text-center text-sm text-sky-700 hover:underline mt-6"
          to="/login"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          ¿Ya tienes cuenta?{' '}
          <span className="font-semibold">Inicia sesión</span>
        </Link>
      </Card>
    </div>
  )
}

export default Register
