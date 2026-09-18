export default function Filtros({ busqueda, alBuscar, categoria, alCambiarCategoria }) {
  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
      {/* Buscador de texto */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => alBuscar(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          flex: '1',
          minWidth: '200px',
          fontSize: '14px',
          backgroundColor: '#fff',
          color: '#2b2b2b'
        }}
      />

      {/* Selector de categoría */}
      <select
        value={categoria}
        onChange={(e) => alCambiarCategoria(e.target.value)}
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '14px',
          backgroundColor: '#fff',
          color: '#2b2b2b',
          cursor: 'pointer'
        }}
      >
        <option value="Todas" style={{ color: '#2b2b2b' }}>Todas las categorías</option>
        <option value="Indumentaria" style={{ color: '#2b2b2b' }}>Indumentaria</option>
        <option value="Calzado" style={{ color: '#2b2b2b' }}>Calzado</option>
        <option value="Bazar" style={{ color: '#2b2b2b' }}>Bazar</option>
        <option value="Mercería" style={{ color: '#2b2b2b' }}>Mercería</option>
        <option value="Juguetería" style={{ color: '#2b2b2b' }}>Juguetería</option>
        <option value="Tecnología" style={{ color: '#2b2b2b' }}>Tecnología</option>
        <option value="Papelería y Librería" style={{ color: '#2b2b2b' }}>Papelería y Librería</option>
        <option value="Cotillón" style={{ color: '#2b2b2b' }}>Cotillón</option>
        <option value="Bebés y Niños" style={{ color: '#2b2b2b' }}>Bebés y Niños</option>
        <option value="Lencería" style={{ color: '#2b2b2b' }}>Lencería</option>
        <option value="Marroquinería" style={{ color: '#2b2b2b' }}>Marroquinería</option>
        <option value="Regalería" style={{ color: '#2b2b2b' }}>Regalería</option>
        <option value="Telas" style={{ color: '#2b2b2b' }}>Telas</option>
      </select>
    </div>
  )
}