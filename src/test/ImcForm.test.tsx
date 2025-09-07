import axios from 'axios'

import { describe, it, expect, beforeEach, vi } from 'vitest'

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import ImcForm from '../ImcForm'

vi.mock('axios')

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>
}

describe('ImcForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    render(<ImcForm />)
  })

  it('renderiza correctamente el formulario', () => {
    expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument()
    expect(screen.getByLabelText('Altura (m):')).toBeInTheDocument()
    expect(screen.getByLabelText('Peso (kg):')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /calcular/i })
    ).toBeInTheDocument()
  })

  it('muestra error si los valores son inválidos', async () => {
    await userEvent.type(screen.getByLabelText(/altura/i), '3.01')
    await userEvent.type(screen.getByLabelText(/peso/i), '501')
    await userEvent.click(screen.getByRole('button', { name: /calcular/i }))
    expect(
      await screen.findByText(/ingresa valores válidos/i)
    ).toBeInTheDocument()
    expect(mockedAxios.post).not.toHaveBeenCalled()
  })

  it('muestra el resultado si la API responde correctamente', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { imc: 22.5, categoria: 'Normal' },
    })
    await userEvent.type(screen.getByLabelText('Altura (m):'), '1.70')
    await userEvent.type(screen.getByLabelText('Peso (kg):'), '65')
    await userEvent.click(screen.getByRole('button', { name: /calcular/i }))
    expect(await screen.findByText(/IMC: 22.50/)).toBeInTheDocument()
    expect(screen.getByText(/Categoría: Normal/)).toBeInTheDocument()
  })

  it('muestra error si la API falla', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API error'))
    await userEvent.type(screen.getByLabelText('Altura (m):'), '1.70')
    await userEvent.type(screen.getByLabelText('Peso (kg):'), '65')
    await userEvent.click(screen.getByRole('button', { name: /calcular/i }))
    expect(
      await screen.findByText(/Error al calcular el IMC/i)
    ).toBeInTheDocument()
  })
})
