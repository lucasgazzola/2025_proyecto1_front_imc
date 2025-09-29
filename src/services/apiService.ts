import axios from 'axios'
import { API_URL } from '../api'

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || { message: 'Error de autenticación' }
  }
}

export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || { message: 'Error de registro' }
  }
}

export const fetchHistorial = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || { message: 'Error al obtener historial' }
  }
}

export const fetchEstadisticasSummary = async (
  token: string,
  estrategia: 'media' | 'mediana' = 'media'
) => {
  try {
    const response = await axios.get(
      `${API_URL}/estadisticas/summary?estrategia=${estrategia}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data
  } catch (error: any) {
    throw error.response?.data || { message: 'Error al obtener estadísticas' }
  }
}

export const calcularImc = async (
  token: string,
  altura: number,
  peso: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/imc/calcular`,
      { altura, peso },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data
  } catch (error: any) {
    throw error.response?.data || { message: 'Error al calcular IMC' }
  }
}
