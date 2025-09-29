import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import * as apiService from '../services/apiService'

vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: typeof axios.get & {
    mockResolvedValueOnce: Function
    mockRejectedValueOnce: Function
  }
  post: typeof axios.post & {
    mockResolvedValueOnce: Function
    mockRejectedValueOnce: Function
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('apiService', () => {
  describe('login', () => {
    it('devuelve datos en éxito', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { token: 'abc' } })
      const result = await apiService.login('test@mail.com', '1234')
      expect(result).toEqual({ token: 'abc' })
    })
    it('lanza error en fallo', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Error de autenticación' } },
      })
      await expect(apiService.login('test@mail.com', '1234')).rejects.toEqual({
        message: 'Error de autenticación',
      })
    })
  })

  describe('register', () => {
    it('devuelve datos en éxito', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { token: 'abc' } })
      const result = await apiService.register('test@mail.com', '1234')
      expect(result).toEqual({ token: 'abc' })
    })
    it('lanza error en fallo', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Error de registro' } },
      })
      await expect(
        apiService.register('test@mail.com', '1234')
      ).rejects.toEqual({ message: 'Error de registro' })
    })
  })

  describe('fetchHistorial', () => {
    it('devuelve datos en éxito', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [{ fecha: 'hoy' }] })
      const result = await apiService.fetchHistorial('token')
      expect(result).toEqual([{ fecha: 'hoy' }])
    })
    it('lanza error en fallo', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: 'Error al obtener historial' } },
      })
      await expect(apiService.fetchHistorial('token')).rejects.toEqual({
        message: 'Error al obtener historial',
      })
    })
  })

  describe('fetchEstadisticasSummary', () => {
    it('devuelve datos en éxito', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { media: 22 } })
      const result = await apiService.fetchEstadisticasSummary('token', 'media')
      expect(result).toEqual({ media: 22 })
    })
    it('lanza error en fallo', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: 'Error al obtener estadísticas' } },
      })
      await expect(
        apiService.fetchEstadisticasSummary('token', 'media')
      ).rejects.toEqual({ message: 'Error al obtener estadísticas' })
    })
  })

  describe('calcularImc', () => {
    it('devuelve datos en éxito', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { imc: 25 } })
      const result = await apiService.calcularImc('token', 180, 80)
      expect(result).toEqual({ imc: 25 })
    })
    it('lanza error en fallo', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Error al calcular IMC' } },
      })
      await expect(apiService.calcularImc('token', 180, 80)).rejects.toEqual({
        message: 'Error al calcular IMC',
      })
    })
  })
})
