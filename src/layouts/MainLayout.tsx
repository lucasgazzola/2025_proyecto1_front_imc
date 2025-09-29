import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MainLayout = () => {
  const { setToken } = useAuth()

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <div className="min-h-screen bg-sky-900 flex flex-col items-center">
      <Card className="w-full max-w-3xl mx-auto mt-8 mb-8 p-8 bg-white rounded-xl shadow-lg flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="px-4 py-2 rounded-md text-lg font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 hover:text-sky-900 transition"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Calculadora IMC
          </Link>
          <Link
            to="/estadisticas"
            className="px-4 py-2 rounded-md text-lg font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 hover:text-sky-900 transition"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
            Estadísticas
          </Link>
        </div>
        <Button
          className="ml-auto px-4 py-2 rounded-md bg-sky-700 text-white text-lg font-semibold hover:bg-sky-800 transition"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Card>
      <main className="w-full mx-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
