export default function TarjetaProducto({ producto, alAgregar }) {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
        transition: 'transform 0.2s ease',
      }}
    >
      <div>
        <div 
          style={{
            height: '100px',
            backgroundColor: '#2b2b2b',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '35px',
            marginBottom: '10px'
          }}
        >
          📦
        </div>
        <h4 style={{ color: '#ffffff', margin: '0 0 6px 0', fontSize: '14px', lineHeight: '1.2' }}>
          {producto.nombre}
        </h4>
        <span style={{ fontSize: '11px', color: '#2196f3', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          {producto.categoria}
        </span>
        <p style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '16px', margin: '0 0 10px 0' }}>
          ${producto.precio.toLocaleString('es-AR')}
        </p>
      </div>

      <button
        onClick={() => alAgregar(producto)}
        style={{
          backgroundColor: '#2196f3',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '8px',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        + Agregar
      </button>
    </div>
  )
}