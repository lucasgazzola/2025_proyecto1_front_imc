export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'

// TODO: Extraer rutas de la API a este archivo
export const API = {
  IMC: {
    CALCULAR: `${API_URL}/imc/calcular`,
  },
}
