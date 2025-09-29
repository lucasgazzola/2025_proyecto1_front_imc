import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../contexts/AuthContext'

import { vi } from 'vitest'

type ProviderProps = {
  value: any
}

const customRender = (
  ui: React.ReactElement,
  { providerProps, ...renderOptions }: { providerProps: ProviderProps }
) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  )
}

describe('MainLayout', () => {
  it('renderiza los links y el botón de logout', () => {
    const setToken = vi.fn()
    const providerProps = {
      value: { setToken },
    }
    customRender(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
      { providerProps }
    )
    expect(screen.getByText(/Calculadora IMC/i)).toBeInTheDocument()
    expect(screen.getByText(/Estadísticas/i)).toBeInTheDocument()
    expect(screen.getByText(/Cerrar sesión/i)).toBeInTheDocument()
  })

  it('llama a setToken y borra el token al hacer logout', () => {
    const setToken = vi.fn()
    const providerProps = {
      value: { setToken },
    }
    window.localStorage.setItem('token', 'test-token')
    customRender(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
      { providerProps }
    )
    fireEvent.click(screen.getByText(/Cerrar sesión/i))
    expect(setToken).toHaveBeenCalledWith(null)
    expect(window.localStorage.getItem('token')).toBeNull()
  })
})
