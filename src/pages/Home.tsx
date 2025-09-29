import { useState } from 'react'
import ImcForm from '@/components/ImcForm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Historial from '@/components/Historial'

const Home = () => {
  const [showHistorial, setShowHistorial] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center bg-sky-900">
      <Card className="w-full max-w-xl p-10 mb-8 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <ImcForm />
        <Button
          className="w-full px-4 py-3 rounded-md bg-sky-700 text-white text-lg font-semibold tracking-wide mt-2 hover:bg-sky-800 transition"
          style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          onClick={() => setShowHistorial(!showHistorial)}>
          {showHistorial ? 'Ocultar historial' : 'Ver historial'}
        </Button>
      </Card>
      <div className="w-full flex justify-center">
        {showHistorial && <Historial />}
      </div>
    </div>
  )
}

export default Home
