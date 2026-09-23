import React, { useState } from 'react';

export default function App() {
  const [tipoCuenta, setTipoCuenta] = useState('comprador');

  const handleSubmitComerciante = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const datos = {
      nombre: formData.get('nombre'),
      direccion: formData.get('direccion'),
      whatsapp: formData.get('whatsapp'),
      cuit: formData.get('cuit')
    };

    try {
      const respuesta = await fetch('https://mercado-once-backend.onrender.com/api/comerciantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Registro de comerciante guardado con éxito!');
        e.target.reset();
      } else {
        alert('Error del servidor: ' + (resultado.message || JSON.stringify(resultado)));
      }
    } catch (error) {
      console.error('Error de red o conexión:', error);
      alert('No se pudo conectar con el servidor backend en el puerto 5000.');
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '15px', backgroundColor: '#1e1e1e', borderBottom: '1px solid #333', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#4caf50' }}>Mercado Once</h1>
      </header>

      <main style={{ padding: '15px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #333' }}>
          <button 
            type="button"
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
            Soy Cliente
          </button>
          <button 
            type="button"
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
            Soy Comerciante
          </button>
        </div>

        {tipoCuenta === 'comprador' && (
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#2196f3' }}>Registro de Cliente</h3>
            <p style={{ fontSize: '13px', color: '#aaa' }}>Creá tu cuenta para comprar online y contactar locales.</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Nombre completo" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="email" placeholder="Correo electrónico" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="password" placeholder="Contraseña" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <button type="button" style={{ backgroundColor: '#2196f3', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Crear mi cuenta de cliente
              </button>
            </form>
          </div>
        )}

        {tipoCuenta === 'comerciante' && (
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#4caf50' }}>Registro de Local / Comercio</h3>
            <p style={{ fontSize: '13px', color: '#aaa' }}>Publicá tu catálogo en Mercado Once y recibí consultas.</p>
            
            <form onSubmit={handleSubmitComerciante} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Nombre de la Tienda / Marca" 
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
              />
              <input 
                type="text" 
                name="direccion" 
                placeholder="Dirección del local en Once (ej: Paso 340)" 
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
              />
              <input 
                type="text" 
                name="whatsapp" 
                placeholder="Número de WhatsApp para pedidos" 
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
              />
              <input 
                type="text" 
                name="cuit" 
                placeholder="Número de CUIT" 
                required
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
              />
              <button 
                type="submit" 
                style={{ backgroundColor: '#4caf50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Registrar mi comercio
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}