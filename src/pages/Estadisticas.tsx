import React, { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)
import { fetchEstadisticasSummary, fetchHistorial } from '@/services/apiService'
import { Card } from '@/components/ui/card'

interface CategoriaCount {
  categoria: string
  count: number
}

interface Summary {
  promedioImc: number | null
  variacionPeso: number | null
  conteoCategorias: CategoriaCount[]
}

interface HistorialItem {
  id: number
  fecha: string
  peso: number
  altura: number
  imc: number
  resultado: string
}

const Estadisticas: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [estrategia, setEstrategia] = useState<'media' | 'mediana'>('media')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('No autenticado.')
          setLoading(false)
          return
        }
        const [summaryData, historialData] = await Promise.all([
          fetchEstadisticasSummary(token, estrategia),
          fetchHistorial(token),
        ])
        setSummary(summaryData)
        setHistorial(historialData)
      } catch (err: any) {
        setError(err.message || 'Error al obtener datos')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [estrategia])

  // Preparar datos para gráficos
  const fechas = historial.map(item =>
    new Date(item.fecha).toLocaleDateString()
  )
  const pesos = historial.map(item => item.peso)
  const imcs = historial.map(item => item.imc)
  const categorias = summary?.conteoCategorias?.map(cat => cat.categoria) || []
  const conteos = summary?.conteoCategorias?.map(cat => cat.count) || []

  const dataPeso = {
    labels: fechas,
    datasets: [
      {
        label: 'Peso',
        data: pesos,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        tension: 0.3,
      },
    ],
  }

  const dataImc = {
    labels: fechas,
    datasets: [
      {
        label: 'IMC',
        data: imcs,
        borderColor: '#388e3c',
        backgroundColor: 'rgba(56, 142, 60, 0.2)',
        tension: 0.3,
      },
    ],
  }

  const dataCategorias = {
    labels: categorias,
    datasets: [
      {
        label: 'Cantidad',
        data: conteos,
        backgroundColor: '#fbc02d',
      },
    ],
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-sky-900">
      <Card className="p-10 bg-white rounded-xl shadow-lg flex flex-col items-center w-full">
        <h2
          className="text-4xl font-bold mb-8 text-center text-sky-700"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Estadísticas
        </h2>
        <div className="flex items-center gap-4 mb-8 justify-center">
          <label
            htmlFor="estrategia"
            className="text-sky-700 font-medium text-lg">
            Estrategia de cálculo:
          </label>
          <select
            id="estrategia"
            value={estrategia}
            onChange={e => setEstrategia(e.target.value as 'media' | 'mediana')}
            className="px-4 py-2 rounded-md border border-sky-400 bg-sky-100 text-sky-900 font-semibold text-base shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            <option value="media">Media</option>
            <option value="mediana">Mediana</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center text-sky-400">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div className="w-full">
            {!historial || historial.length === 0 ? (
              <div className="text-center text-sky-400">
                Todavía no tienes cálculos en tu historial.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <Card className="bg-sky-100 border-sky-200 p-6 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Promedio IMC
                    </h3>
                    <p className="text-2xl font-bold text-sky-700">
                      {summary?.promedioImc ?? '-'}
                    </p>
                  </Card>
                  <Card className="bg-sky-100 border-sky-200 p-6 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Variación de peso
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {summary?.variacionPeso ?? '-'}
                    </p>
                  </Card>
                  <Card className="bg-sky-100 border-sky-200 p-6 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2">
                      Conteo por categoría
                    </h3>
                    <ul className="list-none p-0">
                      {categorias.map((cat: string, idx: number) => (
                        <li
                          key={cat}
                          className="font-semibold text-yellow-600 mb-1">
                          {cat}:{' '}
                          <span className="text-sky-700">{conteos[idx]}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-sky-100 border-sky-200 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-sky-700 mb-2">
                      Evolución de IMC
                    </h4>
                    <div className="min-h-[400px] pb-2">
                      <Line
                        data={dataImc}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                            },
                            title: {
                              display: true,
                              text: 'IMC a lo largo del tiempo',
                              font: {
                                size: 16,
                                family: 'Montserrat, Arial, sans-serif',
                              },
                              color: '#1976d2',
                              padding: { top: 10, bottom: 10 },
                            },
                          },
                          layout: { padding: 20 },
                          scales: {
                            x: {
                              title: {
                                display: true,
                                text: 'Fecha',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                            },
                            y: {
                              title: {
                                display: true,
                                text: 'IMC',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                            },
                          },
                        }}
                        height={340}
                      />
                    </div>
                  </Card>
                  <Card className="bg-sky-100 border-sky-200 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-sky-700 mb-2">
                      Evolución de Peso
                    </h4>
                    <div className="min-h-[400px] pb-2">
                      <Line
                        data={dataPeso}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                            },
                            title: {
                              display: true,
                              text: 'Peso a lo largo del tiempo',
                              font: {
                                size: 16,
                                family: 'Montserrat, Arial, sans-serif',
                              },
                              color: '#1976d2',
                              padding: { top: 10, bottom: 10 },
                            },
                          },
                          layout: { padding: 20 },
                          scales: {
                            x: {
                              title: {
                                display: true,
                                text: 'Fecha',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                            },
                            y: {
                              title: {
                                display: true,
                                text: 'Peso (kg)',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                            },
                          },
                        }}
                        height={340}
                      />
                    </div>
                  </Card>
                  <Card className="bg-sky-100 border-sky-200 p-6 rounded-lg">
                    <h4 className="text-md font-semibold text-sky-700 mb-2">
                      Cantidad por Categoría
                    </h4>
                    <div className="min-h-[400px] pb-2">
                      <Bar
                        data={dataCategorias}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            title: {
                              display: true,
                              text: 'Cantidad por categoría',
                              font: {
                                size: 16,
                                family: 'Montserrat, Arial, sans-serif',
                              },
                              color: '#1976d2',
                              padding: { top: 10, bottom: 10 },
                            },
                          },
                          layout: { padding: 20 },
                          scales: {
                            x: {
                              title: {
                                display: true,
                                text: 'Categoría',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                            },
                            y: {
                              title: {
                                display: true,
                                text: 'Cantidad',
                                font: {
                                  size: 14,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  family: 'Montserrat, Arial, sans-serif',
                                },
                                color: '#1976d2',
                                padding: 6,
                              },
                              grid: { color: '#e3f2fd' },
                              beginAtZero: true,
                            },
                          },
                        }}
                        height={340}
                      />
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Estadisticas
