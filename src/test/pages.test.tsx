import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Estadisticas from '../pages/Estadisticas'

describe('Páginas principales', () => {
  it('Home muestra el título principal', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText(/Calculadora de IMC/i)).toBeInTheDocument()
  })

  it('Login muestra el formulario de login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText(/test@gmail.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('Register muestra el formulario de registro', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText(/test@gmail.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('Estadisticas muestra el título de estadísticas', () => {
    render(
      <MemoryRouter>
        <Estadisticas />
      </MemoryRouter>
    )
    expect(screen.getByText(/Estadísticas/i)).toBeInTheDocument()
  })
})
