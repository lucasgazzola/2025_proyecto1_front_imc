import { useState, useEffect } from 'react'
import ImcForm from './ImcForm'
import { Auth } from './Auth'
import axios from 'axios'
import { API_URL } from './api'

// TODO: Mejorar manejo de token. Si lo modifico, debería mandarme al login.
// TODO: Crear contexto para autenticacion
// TODO: Agregarle rutas con react-router
// TODO: Refactor de componentes grandes en componentes más chicos
// TODO: Crear directorio pages para los componentes de página
// TODO: Impĺementación de roles
interface HistorialItem {
  id: string
  fecha: string
  peso: number
  altura: number
  imc: number
  resultado: string
}

function App() {
  const [token, setToken] = useState<string | null>(null)
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [showHistorial, setShowHistorial] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('jwt')
    if (saved) setToken(saved)
  }, [])

  const handleAuth = (jwt: string) => {
    setToken(jwt)
    localStorage.setItem('jwt', jwt)
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('jwt')
    setHistorial([])
  }

  const fetchHistorial = async () => {
    try {
      const res = await axios.get(`${API_URL}/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setHistorial(res.data.reverse()) // Mostrar el más reciente primero
      setShowHistorial(true)
    } catch {
      setHistorial([])
      setShowHistorial(false)
    }
  }

  // Filtrar historial por fechas
  const historialFiltrado = historial.filter(item => {
    if (!fechaInicio && !fechaFin) return true
    const fechaItem = new Date(item.fecha).getTime()
    const inicio = fechaInicio ? new Date(fechaInicio).getTime() : -Infinity
    const fin = fechaFin ? new Date(fechaFin).getTime() : Infinity
    return fechaItem >= inicio && fechaItem <= fin
  })

  return (
    <div>
      {!token ? (
        <Auth onAuth={handleAuth} />
      ) : (
        <>
          <button
            style={{ float: 'right', margin: '1rem' }}
            onClick={handleLogout}>
            Cerrar sesión
          </button>
          <ImcForm token={token} />
          <button style={{ margin: '1rem' }} onClick={fetchHistorial}>
            Ver historial
          </button>
          {showHistorial && (
            <div className="container" style={{ marginTop: '2rem' }}>
              <h2>Historial de cálculos</h2>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                }}>
                <div>
                  <label
                    htmlFor="fecha-inicio"
                    style={{ color: '#fff', fontWeight: 500 }}>
                    Desde:
                  </label>
                  <input
                    id="fecha-inicio"
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.3rem',
                      borderRadius: '6px',
                      border: '1px solid #444',
                      background: '#191919',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="fecha-fin"
                    style={{ color: '#fff', fontWeight: 500 }}>
                    Hasta:
                  </label>
                  <input
                    id="fecha-fin"
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.3rem',
                      borderRadius: '6px',
                      border: '1px solid #444',
                      background: '#191919',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>
              {historialFiltrado.length === 0 ? (
                <p>No hay cálculos en el rango seleccionado.</p>
              ) : (
                <table
                  style={{
                    width: '100%',
                    background: '#222',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Peso</th>
                      <th>Altura</th>
                      <th>IMC</th>
                      <th>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialFiltrado.map(item => (
                      <tr key={item.id}>
                        <td>{new Date(item.fecha).toLocaleString()}</td>
                        <td>{item.peso}</td>
                        <td>{item.altura}</td>
                        <td>{item.imc.toFixed(2)}</td>
                        <td>{item.resultado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
