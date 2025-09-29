import { calcularImc } from '@/services/apiService'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImcResult {
  imc: number
  categoria: string
}

function ImcForm() {
  const { token } = useAuth()

  const [altura, setAltura] = useState('')
  const [peso, setPeso] = useState('')
  const [resultado, setResultado] = useState<ImcResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const alturaNum = parseFloat(altura)
    const pesoNum = parseFloat(peso)

    if (isNaN(alturaNum) || isNaN(pesoNum) || alturaNum < 0 || pesoNum < 0) {
      setError('Por favor, ingresa valores válidos (positivos y numéricos).')
      setResultado(null)
      return
    }

    // Validación para valores menores a 500 kg y 3 metros de altura
    if (alturaNum > 3 || pesoNum > 500) {
      setError(
        'Por favor, ingresa valores válidos (altura < 3m y peso < 500kg).'
      )
      setResultado(null)
      return
    }

    // Se extrae la URL de la API
    try {
      const data = await calcularImc(token || '', alturaNum, pesoNum)
      setResultado(data)
      setError('')
    } catch (err: any) {
      if (err.message?.includes('Token')) {
        setError('Token inválido o expirado. Inicia sesión nuevamente.')
      } else if (
        err.message?.includes('rango') ||
        err.message?.includes('inválidos')
      ) {
        setError('Datos fuera de rango o inválidos.')
      } else {
        setError(
          'Error al calcular el IMC. Verifica si el backend está corriendo.'
        )
      }
      setResultado(null)
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white w-full flex flex-col items-center">
        <h1
          className="text-2xl font-bold mb-6 text-center text-sky-700"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Calculadora de IMC
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 flex flex-col items-center">
          <Input
            id="altura"
            name="altura"
            type="number"
            value={altura}
            onChange={e => setAltura(e.target.value)}
            step="0.01"
            min="0.1"
            placeholder="Altura (m)"
            className="w-full px-4 py-3 rounded-md bg-sky-100 text-sky-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
          <Input
            id="peso"
            name="peso"
            type="number"
            value={peso}
            onChange={e => setPeso(e.target.value)}
            min="1"
            placeholder="Peso (kg)"
            className="w-full px-4 py-3 rounded-md bg-sky-100 text-sky-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
          <Button
            type="submit"
            className="w-full px-4 py-3 rounded-md bg-sky-700 text-white text-lg font-semibold tracking-wide mt-2 hover:bg-sky-800 transition"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Calcular
          </Button>
        </form>

        {resultado && (
          <div className="mt-2 p-4 rounded-lg bg-sky-100 border border-sky-200 text-center">
            <h2 className="text-lg font-semibold text-sky-700 mb-2">
              Resultado
            </h2>
            <p className="text-xl font-bold text-sky-700">
              IMC: {resultado.imc?.toFixed(2)}
            </p>
            <p className="text-md text-sky-700">
              Categoría:{' '}
              <span className="font-semibold">{resultado.categoria}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 text-center text-sm font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImcForm
