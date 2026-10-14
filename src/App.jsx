import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://mercado-once-backend-1.onrender.com/api';

export default function App() {
  const [tipoCuenta, setTipoCuenta] = useState('comprador');
  
  // Estados para la sección de Mensajería
  const [emisorId, setEmisorId] = useState('1');
  const [receptorId, setReceptorId] = useState('2');
  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState('');

  // Función para obtener los mensajes entre dos usuarios (GET)
  const cargarMensajes = async () => {
    if (!emisorId || !receptorId) return;
    try {
      const respuesta = await fetch(`${API_BASE_URL}/mensajes/${emisorId}/${receptorId}`);
      const resultado = await respuesta.json();
      if (resultado.ok) {
        setMensajes(resultado.conversacion || []);
      } else {
        setMensajes([]);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  };

  useEffect(() => {
    if (tipoCuenta === 'mensajes') {
      cargarMensajes();
    }
  }, [tipoCuenta, emisorId, receptorId]);

  // Función para enviar un mensaje nuevo (POST)
  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!textoMensaje.trim()) return;

    const datos = {
      emisorId: Number(emisorId),
      receptorId: Number(receptorId),
      texto: textoMensaje
    };

    try {
      const respuesta = await fetch(`${API_BASE_URL}/mensajes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        setTextoMensaje('');
        cargarMensajes(); // Recargamos la conversación
      } else {
        alert('Error al enviar mensaje: ' + (resultado.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión al enviar mensaje');
    }
  };

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
      const respuesta = await fetch(`${API_BASE_URL}/comerciantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error de red:', error);
      alert('Error de conexión: ' + error.message);
    }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = { 
      nombre: formData.get('nombre'),
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const respuesta = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        alert(Error del servidor (${respuesta.status}): ${errorTexto});
        return;
      }

      alert('¡Registro de cliente guardado con éxito!');
      e.target.reset();
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión: ' + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '15px', backgroundColor: '#1e1e1e', borderBottom: '1px solid #333', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#4caf50' }}>Mercado Once</h1>
      </header>

      <main style={{ padding: '15px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Pestañas de navegación */}
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #333' }}>
          <button
            type="button"
            onClick={() => setTipoCuenta('comprador')}
            style={{
              flex: 1, padding: '10px', background: 'none', border: 'none',
              borderBottom: tipoCuenta === 'comprador' ? '3px solid #4caf50' : 'none',
              color: tipoCuenta === 'comprador' ? '#4caf50' : '#888',
              fontWeight: 'bold', fontSize: '13px', cursor: 'pointer'
            }}
          >
            Cliente
          </button>
          <button
            type="button"
            onClick={() => setTipoCuenta('comerciante')}
            style={{
              flex: 1, padding: '10px', background: 'none', border: 'none',
              borderBottom: tipoCuenta === 'comerciante' ? '3px solid #4caf50' : 'none',
              color: tipoCuenta === 'comerciante' ? '#4caf50' : '#888',
              fontWeight: 'bold', fontSize: '13px', cursor: 'pointer'
            }}
          >
            Comerciante
          </button>
          <button
            type="button"
            onClick={() => setTipoCuenta('mensajes')}
            style={{
              flex: 1, padding: '10px', background: 'none', border: 'none',
              borderBottom: tipoCuenta === 'mensajes' ? '3px solid #4caf50' : 'none',
              color: tipoCuenta === 'mensajes' ? '#4caf50' : '#888',
              fontWeight: 'bold', fontSize: '13px', cursor: 'pointer'
            }}
          >
            Chat / Mensajes
          </button>
        </div>

        {/* Vistas según la pestaña seleccionada */}
        {tipoCuenta === 'comprador' && (
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#2196f3' }}>Registro de Cliente</h3>
            <form onSubmit={handleSubmitCliente} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" name="nombre" placeholder="Nombre completo" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="email" name="email" placeholder="Correo electrónico" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="password" name="password" placeholder="Contraseña" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#2196f3', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Crear cuenta
              </button>
            </form>
          </div>
        )}

        {tipoCuenta === 'comerciante' && (
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#4caf50' }}>Registro de Local</h3>
            <form onSubmit={handleSubmitComerciante} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" name="nombre" placeholder="Nombre de la Tienda" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="text" name="direccion" placeholder="Dirección en Once" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="text" name="whatsapp" placeholder="WhatsApp" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <input type="text" name="cuit" placeholder="CUIT" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#4caf50', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                Registrar comercio
              </button>
            </form>
          </div>
        )}

        {tipoCuenta === 'mensajes' && (
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, color: '#ff9800' }}>Prueba de Mensajería (Chat)</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#aaa' }}>ID Emisor:</label>
                <input 
                  type="number" 
                  value={emisorId} 
                  onChange={(e) => setEmisorId(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: '#aaa' }}>ID Receptor:</label>
                <input 
                  type="number" 
                  value={receptorId} 
                  onChange={(e) => setReceptorId(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
                />
              </div>
              <button 
                type="button"
                onClick={cargarMensajes} 
                style={{ alignSelf: 'flex-end', padding: '9px 12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Actualizar
              </button>
            </div>

            {/* Caja de visualización de mensajes */}
            <div style={{ backgroundColor: '#121212', height: '200px', borderRadius: '4px', padding: '10px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #333' }}>
              {mensajes.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', fontSize: '13px', marginTop: '70px' }}>No hay mensajes en esta conversación.</p>
              ) : (
                mensajes.map((m, idx) => (
                  <div key={idx} style={{ marginBottom: '8px', padding: '6px 10px', borderRadius: '4px', backgroundColor: m.emisorId === Number(emisorId) ? '#1e3a1e' : '#2a2a2a' }}>
                    <span style={{ fontSize: '10px', color: '#aaa', display: 'block' }}>De ID {m.emisorId} para ID {m.receptorId}:</span>
                    <span style={{ fontSize: '13px' }}>{m.texto}</span>
                  </div>
                ))
              )}
            </div>

            {/* Formulario para enviar mensaje (POST) */}
            <form onSubmit={handleEnviarMensaje} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={textoMensaje} 
                onChange={(e) => setTextoMensaje(e.target.value)} 
                placeholder="Escribí tu mensaje de prueba..." 
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' }} 
              />
              <button 
                type="submit"