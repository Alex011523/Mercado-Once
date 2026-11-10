import React, { useState, useEffect } from 'react';

export default function HomeMercado({ productos = [], onSelectProducto }) {
  const [busqueda, setBusqueda] = useState('');
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [seccionActiva, setSeccionActiva] = useState('home');
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const promos = [
    { id: 1, titulo: 'Promociones Semanales', desc: 'Envíos gratis en compras seleccionadas de Once' },
    { id: 2, titulo: 'Novedades Mayoristas', desc: 'Precios directo de fabricante e importador' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndiceCarrusel((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (

          {/* 3. CARRUSEL AUTOMÁTICO */}
          <div style={{ padding: '0 16px 16px 16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#E2B081' }}>Promociones Semanales</h3>
            <div style={{
              border: '1px solid #D49B6A',
              borderRadius: '12px',
              padding: '16px',
              <p style={{ margin: 0, color: '#A0AEC0', fontSize: '12px' }}>{promos[indiceCarrusel].desc}</p>
            </div>
          </div>

          {/* 4. PANEL DE PRODUCTOS */}
          <div style={{ padding: '0 16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#E2B081' }}>Panel de Productos</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((prod, idx) => (
                  <div 
                    key={prod.id || idx}
                    onClick={() => onSelectProducto && onSelectProducto(prod)}
                    style={{
                      backgroundColor: '#0E1B38',
                      border: '1px solid #D49B6A',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ width: '100%', height: '85px', backgroundColor: '#FFFFFF', borderRadius: '6px', marginBottom: '8px', overflow: 'hidden' }}>
                      <img 
                        src={prod.imagen || 'https://via.placeholder.com/100'} 
                        alt={prod.nombre} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#FFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {prod.nombre || 'Producto'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#E2B081' }}>
                      ${prod.precio || '0'} pesos
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ gridColumn: 'span 2', color: '#A0AEC0', textAlign: 'center', fontSize: '13px', padding: '20px 0' }}>
                  No hay productos cargados aún.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* VISTA "CUENTA" */}
      {seccionActiva === 'cuenta' && (
        <div style={{ padding: '16px' }}>
          <h2 style={{ color: '#E2B081', fontSize: '18px', marginTop: 0 }}>Identificación / Perfil</h2>

          {!tipoUsuario ? (
            <div style={{
              backgroundColor: '#0E1B38',
              border: '1px solid #D49B6A',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#A0AEC0', marginBottom: '16px' }}>Selecciona tu tipo de perfil para ingresar:</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setTipoUsuario('cliente')}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#090F20', color: '#FFF', border: '1px solid #D49B6A', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Soy Cliente
                </button>
                <button 
                  onClick={() => setTipoUsuario('comerciante')}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#D49B6A', color: '#090F20', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Soy Comerciante
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#0E1B38',
              border: '1px solid #D49B6A',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#E2B081' }}>
                  Perfil: {tipoUsuario === 'comerciante' ? 'Comerciante' : 'Cliente'}
                </span>
                <button 
                  onClick={() => setTipoUsuario(null)}
                  style={{ background: 'none', border: 'none', color: '#FF3B30', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Cerrar Sesión
                </button>
              </div>

              {tipoUsuario === 'comerciante' && (
                <div style={{ borderTop: '1px solid #1E293B', paddingTop: '12px' }}>
                  <h4 style={{ color: '#FFF', margin: '0 0 8px 0' }}>Panel del Comerciante</h4>
                  <button style={{ width: '100%', padding: '10px', backgroundColor: '#E2B081', color: '#090F20', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px' }}>
                    ➕ Cargar Nuevo Producto
                  </button>
                  <button style={{ width: '100%', padding: '10px', backgroundColor: '#090F20', color: '#FFF', border: '1px solid #D49B6A', borderRadius: '6px', cursor: 'pointer' }}>
                    📦 Mis Productos Publicados
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0E1B38',
        borderTop: '1px solid #D49B6A',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 100
      }}>
        <div onClick={() => setSeccionActiva('home')} style={{ textAlign: 'center', color: seccionActiva === 'home' ? '#E2B081' : '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}>
          <div>🏠</div>
          <span>Home</span>
        </div>
        <div style={{ textAlign: 'center', color: '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}>
          <div>📦</div>
          <span>Categ</span>
        </div>
        <div style={{ textAlign: 'center', color: '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}>
          <div>🛒</div>
          <span>Carrito</span>
        </div>
        <div style={{ textAlign: 'center', color: '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}>
          <div>❤️</div>
          <span>Fav</span>
        </div>
        <div onClick={() => setSeccionActiva('cuenta')} style={{ textAlign: 'center', color: seccionActiva === 'cuenta' ? '#E2B081' : '#A0AEC0', cursor: 'pointer', fontSize: '11px' }}>
          <div>👤</div>
          <span>Cuenta</span>
        </div>
      </div>

    </div>
  );
}