import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

// Este test verifica que el componente principal App se renderiza correctamente

describe('main.tsx', () => {
  it('renderiza el componente App sin errores', () => {
    const { container } = render(<App />)
    // Verifica que el contenedor principal existe
    expect(container).toBeDefined()
    // Puedes agregar más checks si App tiene algún texto fijo
  })
})
