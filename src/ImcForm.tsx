import axios from 'axios'
import React, { useState } from 'react'
import { API } from './api'

interface ImcResult {
  imc: number
  categoria: string
}

function ImcForm() {
  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [resultado, setResultado] = useState<ImcResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const alturaNum = parseFloat(altura)
    const pesoNum = parseFloat(peso)

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum <= 0 || pesoNum <= 0) {
      setError('Por favor, ingresa valores válidos (positivos y numéricos).')
      setResultado(null)
      return
    }

    // Se extrae la URL de la API
    try {
      const response = await axios.post(API.IMC.CALCULAR, {
        altura: alturaNum,
        peso: pesoNum,
      })
      setResultado(response.data)
      setError('')
    } catch (err) {
      setError(
        'Error al calcular el IMC. Verifica si el backend está corriendo.'
      )
      setResultado(null)
    }
  }

  return (
    <div>
      <div>
        <h1>Calculadora de IMC</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Altura (m):</label>
            <input
              type="number"
              value={altura}
              onChange={e => setAltura(e.target.value)}
              step="0.01"
              min="0.1"
            />
          </div>
          <div>
            <label>Peso (kg):</label>
            <input
              type="number"
              value={peso}
              onChange={e => setPeso(e.target.value)}
              min="1"
            />
          </div>
          <button type="submit">Calcular</button>
        </form>

        {resultado && (
          <div>
            <p>IMC: {resultado.imc.toFixed(2)}</p>
            <p>Categoría: {resultado.categoria}</p>
          </div>
        )}

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImcForm
