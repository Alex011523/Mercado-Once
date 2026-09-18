export default function Carrito({ items, alVaciar, alEliminarItem }) {
  const total = items.reduce((acc, prod) => acc + prod.precio, 0)

  return (
    <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#2b2b2b' }}>Tu Carrito</h3>
        {items.length > 0 && (
          <button 
            onClick={alVaciar}
            style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#777', marginTop: '15px' }}>El carrito está vacío.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((prod, index) => (
              <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee', color: '#2b2b2b' }}>
                <div>
                  <span>{prod.nombre}</span>
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>${prod.precio.toLocaleString('es-AR')}</span>
                </div>
                <button
                  onClick={() => alEliminarItem(index)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #e53935',
                    color: '#e53935',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  title="Eliminar este producto"
                >
                  ❌ Quitar
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '2px solid #2b2b2b', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#2b2b2b' }}>
            <span>Total:</span>
            <span style={{ color: '#2e7d32' }}>${total.toLocaleString('es-AR')}</span>
          </div>
        </div>
      )}
    </div>
  )
}