import { useState, useEffect } from 'react'

const ANUNCIOS = [
  {
    id: 1,
    texto: '🔥 ¡Liquidación de Temporada! Hasta 30% OFF en Indumentaria',
    local: 'Paso Moda',
    color: '#e53935'
  },
  {
    id: 2,
    texto: '⭐ Local Destacado: Importadora Once - Bazar al mejor precio',
    local: 'Sarmiento 2200',
    color: '#1e88e5'
  },
  {
    id: 3,
    texto: '📢 Anuncia tu negocio acá y llega a miles de compradores diarios',
    local: 'Mercado Once Ads',
    color: '#4caf50'
  }
]

export default function BannerPromocional() {
  const [indiceActual, setIndiceActual] = useState(0)

  // Rotación automática del cintillo cada 4 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % ANUNCIOS.length)
    }, 4000)

    return () => clearInterval(intervalo)
  }, [])

  const anuncio = ANUNCIOS[indiceActual]

  return (
    <div
      style={{
        backgroundColor: anuncio.color,
        color: '#ffffff',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '13px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'background-color 0.5s ease',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}
    >
      <span style={{ flex: 1 }}>{anuncio.texto}</span>
      <span
        style={{
          fontSize: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '2px 6px',
          borderRadius: '4px',
          marginLeft: '8px',
          textTransform: 'uppercase'
        }}
      >
        Patrocinado
      </span>
    </div>
  )
}