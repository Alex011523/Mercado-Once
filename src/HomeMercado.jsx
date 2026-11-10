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

  const productosFiltrados = productos.filter((p) =>
    (p.nombre?.toLowerCase().includes(busqueda.toLowerCase())) ||
    (p.categoria?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div style={{ paddingBottom: '75px', fontFamily: 'system-ui, sans-serif' }}>

      {/* 3. CARRUSEL AUTOMÁTICO */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <div style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#E2E8F1' }}>
          {promos[indiceCarrusel].titulo}
        </div>
        <div style={{ 
          border: '1px solid #D49B6A', 
          borderRadius: '12px', 
          padding: '16px', 
          backgroundColor: '#0E1838',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#DADAE8' }}>
            {promos[indiceCarrusel].desc}
          </p>
        </div>
      </div>

      {/* 4. PANEL DE PRODUCTOS */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#E28B81' }}>Panel de Productos</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((prod, idx) => (
              <div
                key={prod.id || idx}
                onClick={() => onSelectProducto && onSelectProducto(prod)}
                style={{
                  background: '#0E1838',
                  border: '1px solid #D49B6A',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {prod.imagen && (
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    style={{
                      width: '100%',
                      height: '110px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}
                  />
                )}
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#FFFFFF', fontWeight: '600' }}>
                    {prod.nombre}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#A0AEC0' }}>
                    {prod.categoria}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#4ADE80' }}>
                    ${prod.precio}
                  </span>
                  <span style={{ fontSize: '10px', background: '#D49B6A', color: '#0E1838', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                    Ver
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 2', textAlign: 'center', color: '#A0AEC0', padding: '24px', fontSize: '13px' }}>
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}