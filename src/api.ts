const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/'

export const API = {
  IMC: {
    CALCULAR: `${API_URL}/imc/calcular`,
  },
}
