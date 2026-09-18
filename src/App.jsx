import { useState } from 'react'
import TarjetaProducto from './TarjetaProducto'
import Carrito from './Carrito'
import Filtros from './Filtros'
import BannerPromocional from './BannerPromocional'

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Remera Algodón Básica', precio: 12000, categoria: 'Indumentaria' },
  { id: 2, nombre: 'Pantalón Jean Clásico', precio: 28000, categoria: 'Indumentaria' },
  { id: 3, nombre: 'Zapatillas Urbanas', precio: 45000, categoria: 'Calzado' },
  { id: 4, nombre: 'Set de Platos x6 Vidrio', precio: 18500, categoria: 'Bazar' },
  { id: 5, nombre: 'Pava Eléctrica Acero Inox', precio: 32000, categoria: 'Bazar' },
  { id: 6, nombre: 'Hilo de Coser Poliéster x10', precio: 4500, categoria: 'Mercería' },
  { id: 7, nombre: 'Caja de Botones Surtidos', precio: 6200, categoria: 'Mercería' },
  { id: 8, nombre: 'Auto a Control Remoto', precio: 24000, categoria: 'Juguetería' },
  { id: 9, nombre: 'Juego de Mesa Familiar', precio: 19000, categoria: 'Juguetería' },
  { id: 10, nombre: 'Auriculares Bluetooth', precio: 22000, categoria: 'Tecnología' },
]

const LISTA_CATEGORIAS = [
  { nombre: 'Indumentaria', icono: '👕' },
  { nombre: 'Calzado', icono: '👟' },
  { nombre: 'Bazar', icono: '🍽️' },
  { nombre: 'Mercería', icono: '🧵' },
  { nombre: 'Juguetería', icono: '🧸' },
  { nombre: 'Tecnología', icono: '🎧' },
  { nombre: 'Papelería y Librería', icono: '📚' },
  { nombre: 'Cotillón', icono: '🎉' },
  { nombre: 'Bebés y Niños', icono: '👶' },
  { nombre: 'Lencería', icono: '🩲' },
  { nombre: 'Marroquinería', icono: '👜' },
  { nombre: 'Regalería', icono: '🎁' },
  { nombre: 'Telas', icono: '✂️' },
]

export default function App() {
  const [productos] = useState(PRODUCTOS_INICIALES)
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [tipoCuenta, setTipoCuenta] = useState('comprador')

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto])
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const eliminarDelCarrito = (indiceAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indiceAEliminar))
  }

  const seleccionarCategoriaYNavegar = (catNombre) => {
    setCategoria(catNombre)
    setSeccionActiva('inicio')
  }

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoria === 'Todas' || prod.categoria === categoria
    return coincideTexto && coincideCategoria
  })

  return (
    <div style={{
      fontFamily: 'sans-serif',
      padding: '15px',
      maxWidth: '500px',
      margin: '0 auto',
      paddingBottom: '100px', // Un poco más de espacio abajo para dar margen al scroll
      background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      
      {/* Encabezado Móvil */}
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '15px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '26px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Mercado Once</h1>
        <p style={{ margin: '4px 0 0 0', fontStyle: 'italic', color: '#94a3b8', fontSize: '13px' }}>Todo lo que buscás en un solo lugar</p>
      </header>

      <main>
        {seccionActiva === 'inicio' && (
          <>
            {/* Banner Publicitario Dinámico */}
            <BannerPromocional />

            {/* CARRUSEL HORIZONTAL: Productos que pasan hacia los lados */}
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '15px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔥 Destacados de la semana
              </h3>
              <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '10px',
                scrollbarWidth: 'thin'
              }}>
                {productos.slice(0, 5).map((prod) => (
                  <div key={prod.id} style={{
                    minWidth: '130px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid #3b82f6',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '10px', backgroundColor: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>OFERTA</span>
                    <h5 style={{ margin: '8px 0 4px 0', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.nombre}</h5>
                    <p style={{ margin: 0, color: '#4caf50', fontWeight: 'bold', fontSize: '13px' }}>${prod.precio.toLocaleString('es-AR')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buscador y Filtro */}
            <Filtros 
              busqueda={busqueda} 
              alBuscar={setBusqueda} 
              categoria={categoria} 
              alCambiarCategoria={setCategoria} 
            />

            <h3 style={{ color: '#ffffff', fontSize: '16px', marginTop: '20px', marginBottom: '12px' }}>Catálogo de Productos</h3>

            {/* Grilla con separación mejorada */}
            {productosFiltrados.length === 0 ? (
              <p style={{ color: '#bbb', fontStyle: 'italic' }}>No se encontraron productos.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                {productosFiltrados.map((prod) => (
                  <TarjetaProducto 
                    key={prod.id} 
                    producto={prod} 
                    alAgregar={agregarAlCarrito} 
                  />
                ))}
              </div>
            )}
          </>
        )}

        {seccionActiva === 'carrito' && (
          <Carrito items={carrito} alVaciar={vaciarCarrito} alEliminarItem={eliminarDelCarrito} />
        )}

        {seccionActiva === 'favoritos' && (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '40px' }}>
            <h2>❤️ Favoritos</h2>
            <p style={{ color: '#aaa' }}>Acá se van a guardar los productos y locales que marques como favoritos.</p>
          </div>
        )}

        {seccionActiva === 'categorias' && (
          <div style={{ color: '#fff', marginTop: '10px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>📂 Categorías</h2>
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>Elegí una categoría para explorar los productos:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {LISTA_CATEGORIAS.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => seleccionarCategoriaYNavegar(cat.nombre)}
                  style={{
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '15px 10px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{cat.icono}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{cat.nombre}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {seccionActiva === 'cuenta' && (
          <div style={{ color: '#fff', marginTop: '10px' }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #333', marginBottom: '20px' }}>
              <button
                onClick={() => setTipoCuenta('comprador')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: tipoCuenta === 'comprador' ? '3px solid #2196f3' : 'none',
                  color: tipoCuenta === 'comprador' ? '#2196f3' : '#888',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🛒 Soy Comprador
              </button>

              <button
                onClick={() => setTipoCuenta('comerciante')}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: tipoCuenta === 'comerciante' ? '3px solid #4caf50' : 'none',
                  color: tipoCuenta === 'comerciante' ? '#4caf50' : '#888',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🏪 Soy Comerciante
              </button>
            </div>

            {tipoCuenta === 'comprador' && (
              <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <h3 style={{ marginTop: 0, color: '#2196f3' }}>Registro de Cliente</h3>
                <p style={{ fontSize: '13px', color: '#aaa' }}>Creá tu cuenta para comprar online y guardar tus favoritos.</p>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Nombre completo" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <input type="email" placeholder="Correo electrónico" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <input type="password" placeholder="Contraseña" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <button type="button" style={{ backgroundColor: '#2196f3', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    Crear mi cuenta de cliente
                  </button>
                </form>
              </div>
            )}

            {tipoCuenta === 'comerciante' && (
              <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <h3 style={{ marginTop: 0, color: '#4caf50' }}>Registro de Local / Comercio</h3>
                <p style={{ fontSize: '13px', color: '#aaa' }}>Publicá tu catálogo en Mercado Once y vendé directo al público y mayoristas.</p>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Nombre de la Tienda / Marca" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <input type="text" placeholder="Dirección del local en Once (ej: Paso 340)" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <input type="text" placeholder="Número de WhatsApp para pedidos" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <input type="email" placeholder="Correo electrónico de contacto" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2b2b2b', color: '#fff' }} />
                  <button type="button" style={{ backgroundColor: '#4caf50', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    Registrar mi comercio
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Barra de Navegación Inferior Optimizada */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0f172a',
        borderTop: '1px solid #334155',
        display: 'flex',
        justify: 'space-around',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))', // Ajuste para bordes o barras de navegación móviles
        height: '65px',
        boxSizing: 'border-box',
        zIndex: 1000
      }}>
        <button 
          onClick={() => setSeccionActiva('inicio')}
          style={{ 
            flex: 1,
            background: 'none', 
            border: 'none', 
            color: seccionActiva === 'inicio' ? '#3b82f6' : '#64748b', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: '1.2' }}>🏠</span>
          <span style={{ fontSize: '11px', fontWeight: seccionActiva === 'inicio' ? '600' : 'normal' }}>Inicio</span>
        </button>

        <button 
          onClick={() => setSeccionActiva('categorias')}
          style={{ 
            flex: 1,
            background: 'none', 
            border: 'none', 
            color: seccionActiva === 'categorias' ? '#3b82f6' : '#64748b', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: '1.2' }}>📂</span>
          <span style={{ fontSize: '11px', fontWeight: seccionActiva === 'categorias' ? '600' : 'normal' }}>Categorías</span>
        </button>

        <button 
          onClick={() => setSeccionActiva('favoritos')}
          style={{ 
            flex: 1,
            background: 'none', 
            border: 'none', 
            color: seccionActiva === 'favoritos' ? '#3b82f6' : '#64748b', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: '1.2' }}>❤️</span>
          <span style={{ fontSize: '11px', fontWeight: seccionActiva === 'favoritos' ? '600' : 'normal' }}>Favoritos</span>
        </button>

        <button 
          onClick={() => setSeccionActiva('carrito')}
          style={{ 
            flex: 1,
            background: 'none', 
            border: 'none', 
            color: seccionActiva === 'carrito' ? '#3b82f6' : '#64748b', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: '1.2' }}>🛒</span>
          <span style={{ fontSize: '11px', fontWeight: seccionActiva === 'carrito' ? '600' : 'normal' }}>
            Carrito{carrito.length > 0 ? ` (${carrito.length})` : ''}
          </span>
        </button>

        <button 
          onClick={() => setSeccionActiva('cuenta')}
          style={{ 
            flex: 1,
            background: 'none', 
            border: 'none', 
            color: seccionActiva === 'cuenta' ? '#3b82f6' : '#64748b', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: '1.2' }}>👤</span>
          <span style={{ fontSize: '11px', fontWeight: seccionActiva === 'cuenta' ? '600' : 'normal' }}>Mi cuenta</span>
        </button>
      </nav>

    </div>
  )
}