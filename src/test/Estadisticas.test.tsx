import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Estadisticas from '../pages/Estadisticas'

const mockSummary = {
  promedioImc: 23.5,
  variacionPeso: 5,
  conteoCategorias: [
    { categoria: 'Normal', count: 2 },
    { categoria: 'Sobrepeso', count: 1 },
  ],
}
const mockHistorial = [
  {
    id: 1,
    fecha: '2025-09-28T00:00:00Z',
    peso: 70,
    altura: 175,
    imc: 22.9,
    resultado: 'Normal',
  },
  {
    id: 2,
    fecha: '2025-09-29T00:00:00Z',
    peso: 75,
    altura: 175,
    imc: 24.5,
    resultado: 'Sobrepeso',
  },
]

vi.mock('../services/apiService', () => ({
  fetchEstadisticasSummary: vi.fn(),
  fetchHistorial: vi.fn(),
}))

vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mock-line-chart" />,
  Bar: () => <div data-testid="mock-bar-chart" />,
}))

import * as apiService from '../services/apiService'
const fetchEstadisticasSummary = vi.mocked(apiService.fetchEstadisticasSummary)
const fetchHistorial = vi.mocked(apiService.fetchHistorial)

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.setItem('token', 'test-token')
})

describe('Estadisticas page', () => {
  it('muestra el estado de carga', async () => {
    fetchEstadisticasSummary.mockImplementation(() => new Promise(() => {}))
    fetchHistorial.mockImplementation(() => new Promise(() => {}))
    render(<Estadisticas />)
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument()
  })

  it('muestra error si no hay token', async () => {
    window.localStorage.removeItem('token')
    render(<Estadisticas />)
    await waitFor(() => {
      expect(screen.getByText(/No autenticado/i)).toBeInTheDocument()
    })
  })

  it('muestra error si los servicios fallan', async () => {
    fetchEstadisticasSummary.mockRejectedValueOnce({
      message: 'Error de stats',
    })
    fetchHistorial.mockResolvedValueOnce([])
    render(<Estadisticas />)
    await waitFor(() => {
      expect(screen.getByText(/Error de stats/i)).toBeInTheDocument()
    })
  })

  it('muestra mensaje si historial está vacío', async () => {
    fetchEstadisticasSummary.mockResolvedValueOnce(mockSummary)
    fetchHistorial.mockResolvedValueOnce([])
    render(<Estadisticas />)
    await waitFor(() => {
      expect(
        screen.getByText(/Todavía no tienes cálculos/i)
      ).toBeInTheDocument()
    })
  })

  it('renderiza datos y resumen correctamente', async () => {
    fetchEstadisticasSummary.mockResolvedValueOnce(mockSummary)
    fetchHistorial.mockResolvedValueOnce(mockHistorial)
    render(<Estadisticas />)
    await waitFor(() => {
      expect(screen.getByText(/Promedio IMC/i)).toBeInTheDocument()
      expect(screen.getByText('23.5')).toBeInTheDocument()
      expect(screen.getByText(/Variación de peso/i)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Conteo por Categoría/i, level: 3 })
      ).toBeInTheDocument()
      expect(screen.getByText(/Normal/i)).toBeInTheDocument()
      expect(screen.getByText(/Sobrepeso/i)).toBeInTheDocument()
      expect(screen.getByText(/Evolución de IMC/i)).toBeInTheDocument()
      expect(screen.getByText(/Evolución de Peso/i)).toBeInTheDocument()
      expect(screen.getByText(/Conteo por Categoría/i)).toBeInTheDocument()
    })
  })

  it('cambia la estrategia y vuelve a cargar', async () => {
    fetchEstadisticasSummary.mockResolvedValue(mockSummary)
    fetchHistorial.mockResolvedValue(mockHistorial)
    render(<Estadisticas />)
    await waitFor(() => {
      expect(
        screen.getByLabelText(/Estrategia de cálculo/i)
      ).toBeInTheDocument()
    })
    fireEvent.change(screen.getByLabelText(/Estrategia de cálculo/i), {
      target: { value: 'mediana' },
    })
    await waitFor(() => {
      expect(fetchEstadisticasSummary).toHaveBeenCalledWith(
        'test-token',
        'mediana'
      )
    })
  })
})
