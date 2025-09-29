import { useState, useEffect } from 'react'
import { fetchHistorial } from '@/services/apiService'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Historial() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [historial, setHistorial] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const data = await fetchHistorial(token)
        setHistorial(data.reverse())
      } catch {
        setError('Error al obtener el historial')
      }
    }
    fetch()
  }, [])

  const historialFiltrado = historial.filter(item => {
    const fecha = new Date(item.fecha)
    const inicio = fechaInicio ? new Date(fechaInicio) : null
    const fin = fechaFin ? new Date(fechaFin) : null
    if (inicio && fecha < inicio) return false
    if (fin && fecha > fin) return false
    return true
  })

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 p-10 bg-white rounded-xl shadow-lg flex flex-col items-center">
      <h2
        className="text-3xl font-bold mb-8 text-center text-sky-700"
        style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
        Historial de cálculos
      </h2>
      <div className="flex gap-6 mb-8 flex-wrap w-full justify-center">
        <div className="flex flex-col">
          <label
            htmlFor="fecha-inicio"
            className="text-sky-700 font-medium mb-1">
            Desde:
          </label>
          <Input
            id="fecha-inicio"
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="bg-sky-100 text-sky-900 border-sky-200 px-2 py-1 rounded-md"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fecha-fin" className="text-sky-700 font-medium mb-1">
            Hasta:
          </label>
          <Input
            id="fecha-fin"
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="bg-sky-100 text-sky-900 border-sky-200 px-2 py-1 rounded-md"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          />
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {historialFiltrado.length === 0 ? (
        <p className="text-sky-400">
          No hay cálculos en el rango seleccionado.
        </p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-sky-900 bg-sky-100 rounded-md">
            <thead>
              <tr className="bg-sky-200 text-sky-700">
                <th className="px-2 py-2">Fecha</th>
                <th className="px-2 py-2">Peso</th>
                <th className="px-2 py-2">Altura</th>
                <th className="px-2 py-2">IMC</th>
                <th className="px-2 py-2">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-sky-200">
                  <td className="px-2 py-2">
                    {new Date(item.fecha).toLocaleString()}
                  </td>
                  <td className="px-2 py-2">{item.peso}</td>
                  <td className="px-2 py-2">{item.altura}</td>
                  <td className="px-2 py-2">{item.imc.toFixed(2)}</td>
                  <td className="px-2 py-2">{item.resultado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
