import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://mercado-once-backend-1.onrender.com/api';

export default function App() {
  const [tipoCuenta, setTipoCuenta] = useState('comprador');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('menor');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  
  // Estados para menús desplegables de UI personalizados
  const [mostrarIdentificate, setMostrarIdentificate] = useState(false);
  const [mostrarMenuMas, setMostrarMenuMas] = useState(false);

  const [comercioActivo, setComercioActivo] = useState(() => {
    const guardado = localStorage.getItem('comercioMercadoOnce');
    return guardado ? JSON.parse(guardado) : null;
  });
  
  // Estados para la sección de Mensajería
  const [emisorId, setEmisorId] = useState('1');
  const [receptorId, setReceptorId] = useState('2');
  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState('');

  // Categorías comerciales de Once
  const categoriasOnce = [
    'Todos', 
    'Indumentaria', 
    'Marroquinería', 
    'Tecnología', 
    'Hogar y Bazar', 
    'Calzado',
    'Juguetería',
    'Bijouterie y accesorios',
    'articulos regionales',
    'lenceria',
    'libreria y articulos escolares'
  ];

  // Productos de ejemplo para simular la grilla del catálogo
  const productosEjemplo = [
    { id: 101, nombre: 'Remera Lisa Algodón 100%', precio: 8500, categoria: 'Indumentaria', comercio: 'Textil Once', direccion: 'Av. Pueyrredón 450', imagen: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80', descripcion: 'Remera de algodón peinado, varios colores y talles del S al XXL.' },
    { id: 102, nombre: 'Remera Lisa Premium Oversize', precio: 11000, categoria: 'Indumentaria', comercio: 'Moda Uriburu', direccion: 'Uriburu 320', imagen: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&q=80', descripcion: 'Corte oversize urbano, excelente calidad de confección.' },
    { id: 103, nombre: 'Mochila Urbana Reforzada', precio: 22500, categoria: 'Marroquinería', comercio: 'Bolsos Once', direccion: 'Paso 210', imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80', descripcion: 'Impermeable, con compartimento para notebook de 15.6 pulgadas.' },
    { id: 104, nombre: 'Auriculares Bluetooth Inalámbricos', precio: 14200, categoria: 'Tecnología', comercio: 'Gadgets Castelli', direccion: 'Castelli 180', imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', descripcion: 'Sonido HD, batería de 8hs continuas con estuche de carga.' },
    { id: 105, nombre: 'Juego de Sabanas 2 Plazas 1400 Hilos', precio: 19800, categoria: 'Hogar y Bazar', comercio: 'Blanqueria Larrea', direccion: 'Larrea 540', imagen: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=300&q=80', descripcion: 'Microfibra de alta densidad, suave al tacto y no junta pelotillas.' },
    { id: 106, nombre: 'Zapatillas Deportivas Urbanas', precio: 32000, categoria: 'Calzado', comercio: 'Calzados Jujuy', direccion: 'Av. Jujuy 120', imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', descripcion: 'Suela de goma antideslizante, súper livianas y cómodas.' },
    { id: 107, nombre: 'Juego de Mesa Clásico', precio: 15500, categoria: 'Juguetería', comercio: 'Juguetes Pasteur', direccion: 'Pasteur 410', imagen: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300&q=80', descripcion: 'Ideal para la familia, incluye tablero de madera y fichas.' }
  ];

  // Funciones de Carrito y Favoritos
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    alert(`¡${producto.nombre} agregado al carrito!`);
  };

  const eliminarDelCarrito = (indexParaEliminar) => {
    const nuevoCarrito = carrito.filter((_, index) => index !== indexParaEliminar);
    setCarrito(nuevoCarrito);
  };

  const toggleFavorito = (producto, e) => {
    e.stopPropagation();
    if (favoritos.some(f => f.id === producto.id)) {
      setFavoritos(favoritos.filter(f => f.id !== producto.id));
    } else {
      setFavoritos([...favoritos, producto]);
    }
  };

  // Filtrado y ordenamiento dinámico de productos
  const productosFiltrados = productosEjemplo
    .filter((prod) => {
      const coincideCategoria = categoriaSeleccionada === 'Todos' || prod.categoria === categoriaSeleccionada;
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                               prod.comercio.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      return ordenPrecio === 'menor' ? a.precio - b.precio : b.precio - a.precio;
    });

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        setTextoMensaje('');
        cargarMensajes();
      } else {
        alert(Error al enviar mensaje: ${resultado.error || 'Desconocido'});
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
      const respuesta = await fetch(${API_BASE_URL}/comerciantes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const resultado = await respuesta.json();
      if (respuesta.ok) {
        alert('¡Registro de comerciante guardado con éxito!');
        localStorage.setItem('comercioMercadoOnce', JSON.stringify(datos));
        setComercioActivo(datos);
        e.target.reset();
        setTipoCuenta('cargar_producto'); 
      } else {
        alert(Error del servidor: ${resultado.message || JSON.stringify(resultado)});
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert(Error de conexión: ${error.message});
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
      const respuesta = await fetch(${API_BASE_URL}/clientes, {
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
      setTipoCuenta('comprador');
    } catch (error) {
      console.error('Error de red:', error);
      alert(Error de conexión: ${error.message});
    }
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const datos = {
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      precio: parseFloat(formData.get('precio')),
      categoria: formData.get('categoria'),
      imagen: formData.get('imagen')
    };

    try {
      const respuesta = await fetch(${API_BASE_URL}/productos, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      
      const resultado = await respuesta.json();
      
      if (respuesta.ok) {
        alert('¡Producto guardado con éxito!');
        e.target.reset();
        setTipoCuenta('comprador');
      } else {
        alert(Error del servidor: ${resultado.error || 'No se pudo guardar'});
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ backgroundColor: '#070D18', color: '#F3F4F6', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: '90px' }}>
      
      {/* HEADER PRINCIPAL ENMARCADO CON LOGO Y ESLOGAN */}
      <header style={{ padding: '16px', backgroundColor: '#070D18', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px', 
          border: '2px solid #C58547', 
          padding: '12px 20px', 
          borderRadius: '16px', 
          backgroundColor: '#0B1320', 
          width: '100%', 
          maxWidth: '450px', 
          boxShadow: '0 4px 15px rgba(197, 133, 71, 0.15)',
          boxSizing: 'border-box' 
        }}>
          {/* Logo oficial circular */}
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', border: '1px solid #C58547', flexShrink: 0, overflow: 'hidden' }}>
            <img src="/logo.png" alt="Mercado Once Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h1 translate="no" style={{ margin: 0, fontSize: '20px', color: '#E8B882', fontWeight: '800', letterSpacing: '0.5px' }}>
              Mercado Once
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>
              Todo lo que buscas en un solo lugar
            </p>
          </div>
        </div>
      </header>

      <main style={{ padding: '16px', maxWidth: '650px', margin: '0 auto' }}>
        
        {/* BARRA DE BÚSQUEDA Y BOTÓN IDENTIFÍCATE */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#0B1320',
                color: 'white',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Botón Identifícate Estilo Amazon con Desplegable */}
          <div style={{ position: 'relative', textAlign: 'right' }}>
            <button
              onClick={() => setMostrarIdentificate(!mostrarIdentificate)}
              style={{
                background: 'none',
                border: 'none',
                color: '#E8B882',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Identifícate ▾
            </button>

            {mostrarIdentificate && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '30px',
                backgroundColor: '#0B1320',
                border: '1px solid #334155',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 10,
                width: '180px',
                textAlign: 'left',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => { setTipoCuenta('registro_cliente'); setMostrarIdentificate(false); }}
                  style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', color: '#F3F4F6', fontSize: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #1E293B' }}
                >
                  👤 Soy Cliente
                </button>
                <button
                  onClick={() => { setTipoCuenta('comerciante'); setMostrarIdentificate(false); }}
                  style={{ width: '100%', padding: '10px 14px', background: 'none', border: 'none', color: '#F3F4F6', fontSize: '12px', textAlign: 'left', cursor: 'pointer' }}
                >
                  🏪 Soy Comerciante
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Barra de Categorías Comerciales de Once */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '8px', fontWeight: '600' }}>RUBROS Y CATEGORÍAS:</p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {categoriasOnce.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategoriaSeleccionada(cat); if(tipoCuenta !== 'comprador') setTipoCuenta('comprador'); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: categoriaSeleccionada === cat && tipoCuenta === 'comprador' ? '1px solid #C58547' : '1px solid #1E293B',
                  backgroundColor: categoriaSeleccionada === cat && tipoCuenta === 'comprador' ? '#1C2A44' : '#0B1320',
                  color: categoriaSeleccionada === cat && tipoCuenta === 'comprador' ? '#E8B882' : '#94A3B8',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontWeight: categoriaSeleccionada === cat && tipoCuenta === 'comprador' ? 'bold' : 'normal'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* VISTA 1: Catálogo con Carruseles Dinámicos */}
        {tipoCuenta === 'comprador' && !productoSeleccionado && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CARRUSEL 1: Novedades para el Hogar */}
            <div style={{ border: '1px solid #1E293B', borderRadius: '14px', padding: '14px', backgroundColor: '#0B1320' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#E8B882', fontWeight: 'bold' }}>Novedades para el Hogar</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#94A3B8' }}>Buscar esa hogar</p>
              
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {productosEjemplo.filter(p => p.categoria === 'Hogar y Bazar' || p.categoria === 'Tecnología').map((prod) => (
                  <div key={prod.id} onClick={() => setProductoSeleccionado(prod)} style={{ minWidth: '130px', maxWidth: '130px', backgroundColor: '#162032', borderRadius: '10px', padding: '8px', cursor: 'pointer', flexShrink: 0, border: '1px solid #1E293B' }}>
                    <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                    <h5 style={{ margin: '6px 0 2px 0', fontSize: '11px', color: '#F3F4F6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.nombre}</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#E8B882', fontWeight: 'bold' }}>${prod.precio.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CARRUSEL 2: Tus Favoritos de Siempre */}
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#E8B882', fontWeight: 'bold' }}>Tus Favoritos de Siempre</h3>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {productosEjemplo.map((prod) => (
                  <div key={prod.id} onClick={() => setProductoSeleccionado(prod)} style={{ minWidth: '130px', maxWidth: '130px', backgroundColor: '#0B1320', borderRadius: '10px', padding: '10px', cursor: 'pointer', flexShrink: 0, border: '1px solid #C58547' }}>
                    <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                    <h5 style={{ margin: '8px 0 2px 0', fontSize: '11px', color: '#F3F4F6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.nombre}</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#E8B882', fontWeight: 'bold' }}>${prod.precio.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CARRUSEL 3: Categorías Populares */}
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#E8B882', fontWeight: 'bold' }}>Categorías Populares</h3>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['Electrónica', 'Moda', 'Categorías', 'Producciones', 'Otras'].map((cat, idx) => (
                  <div key={idx} style={{ minWidth: '85px', height: '75px', backgroundColor: '#0B1320', border: '1px solid #1E293B', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                    <span style={{ fontSize: '18px', color: '#E8B882' }}>📱</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* DETALLE DE PRODUCTO */}
        {productoSeleccionado && (
          <div style={{ backgroundColor: '#0B1320', padding: '16px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <button
              onClick={() => setProductoSeleccionado(null)}
              style={{ background: 'none', border: 'none', color: '#E8B882', fontSize: '12px', cursor: 'pointer', marginBottom: '12px' }}
            >
              ← Volver al catálogo
            </button>
            <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
            <h2 style={{ fontSize: '18px', color: '#F3F4F6', margin: '12px 0 6px 0' }}>{productoSeleccionado.nombre}</h2>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#E8B882', margin: '0 0 12px 0' }}>${productoSeleccionado.precio.toLocaleString()}</p>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>{productoSeleccionado.descripcion}</p>
            <div style={{ backgroundColor: '#162032', padding: '10px', borderRadius: '8px', margin: '14px 0', fontSize: '12px' }}>
              <p style={{ margin: '0 0 4px 0', color: '#E8B882', fontWeight: 'bold' }}>Comercio: {productoSeleccionado.comercio}</p>
              <p style={{ margin: 0, color: '#94A3B8' }}>Dirección: {productoSeleccionado.direccion}</p>
            </div>
            <button
              onClick={() => agregarAlCarrito(productoSeleccionado)}
              style={{ width: '100%', backgroundColor: '#C58547', color: '#070D18', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
            >
              Agregar al Carrito 🛒
            </button>
          </div>
        )}

        {/* VISTA: REGISTRO CLIENTE */}
        {tipoCuenta === 'registro_cliente' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Registro de Cliente</h3>
            <form onSubmit={handleSubmitCliente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input name="nombre" placeholder="Nombre completo" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <input name="email" type="email" placeholder="Correo electrónico" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <input name="password" type="password" placeholder="Contraseña" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#C58547', color: '#070D18', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Registrarse</button>
            </form>
          </div>
        )}

        {/* VISTA: REGISTRO LOCAL / COMERCIANTE */}
        {tipoCuenta === 'comerciante' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Registro de Local en Once</h3>
            <form onSubmit={handleSubmitComerciante} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input name="nombre" placeholder="Nombre del local" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <input name="direccion" placeholder="Dirección en Once (ej: Av. Pueyrredón 35)" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <input name="whatsapp" placeholder="WhatsApp de contacto" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <input name="cuit" placeholder="CUIT" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#C58547', color: '#070D18', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Local</button>
            </form>
          </div>
        )}

        {/* VISTA: CARGAR PRODUCTO (Para Comerciantes) */}
        {tipoCuenta === 'cargar_producto' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Publicar Nuevo Producto</h3>
            <form onSubmit={handleSubmitProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input name="nombre" placeholder="Nombre del producto" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <textarea name="descripcion" placeholder="Descripción detallada" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white', resize: 'vertical' }} />
              <input name="precio" type="number" step="any" placeholder="Precio ($)" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <select name="categoria" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }}>
                {categoriasOnce.filter(c => c !== 'Todos').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input name="imagen" placeholder="URL de la imagen del producto" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#070D18', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#C58547', color: '#070D18', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Publicación</button>
            </form>
          </div>
        )}

        {/* VISTA: CARRITO */}
        {tipoCuenta === 'carrito' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Tu Carrito de Compras</h3>
            {carrito.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>El carrito está vacío.</p>
            ) : (
              <div>
                {carrito.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>{item.nombre}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#E8B882' }}>${item.precio.toLocaleString()}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(index)} style={{ background: '#334155', color: '#F3F4F6', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA: FAVORITOS */}
        {tipoCuenta === 'favoritos' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Tus Productos Favoritos</h3>
            {favoritos.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>No tienes favoritos guardados todavía.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                {favoritos.map((prod) => (
                  <div key={prod.id} onClick={() => { setProductoSeleccionado(prod); setTipoCuenta('comprador'); }} style={{ backgroundColor: '#070D18', borderRadius: '8px', padding: '8px', cursor: 'pointer', border: '1px solid #1E293B' }}>
                    <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                    <p style={{ fontSize: '12px', margin: '6px 0 4px 0', fontWeight: 'bold' }}>{prod.nombre}</p>
                    <p style={{ fontSize: '13px', color: '#E8B882', margin: 0 }}>${prod.precio.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA: CHAT DIRECTO */}
        {tipoCuenta === 'mensajes' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ color: '#E8B882', marginTop: 0 }}>Chat con Comercios</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input value={emisorId} onChange={(e) => setEmisorId(e.target.value)} placeholder="Mi ID" style={{ flex: 1, padding: '8px', background: '#070D18', border: '1px solid #334155', color: 'white', borderRadius: '6px', fontSize: '12px' }} />
              <input value={receptorId} onChange={(e) => setReceptorId(e.target.value)} placeholder="ID Comercio" style={{ flex: 1, padding: '8px', background: '#070D18', border: '1px solid #334155', color: 'white', borderRadius: '6px', fontSize: '12px' }} />
            </div>
            <div style={{ height: '200px', background: '#070D18', border: '1px solid #1E293B', borderRadius: '8px', padding: '10px', overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {mensajes.length === 0 ? (
                <p style={{ color: '#94A3B8', fontSize: '12px', textAlign: 'center', margin: 'auto' }}>No hay mensajes aún.</p>
              ) : (
                mensajes.map((m, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', borderRadius: '6px', background: m.emisorId === Number(emisorId) ? '#1C2A44' : '#1E293B', alignSelf: m.emisorId === Number(emisorId) ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <p style={{ margin: 0, fontSize: '12px' }}>{m.texto}</p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleEnviarMensaje} style={{ display: 'flex', gap: '6px' }}>
              <input value={textoMensaje} onChange={(e) => setTextoMensaje(e.target.value)} placeholder="Escribe un mensaje..." style={{ flex: 1, padding: '10px', background: '#070D18', border: '1px solid #334155', color: 'white', borderRadius: '6px', fontSize: '12px' }} />
              <button type="submit" style={{ background: '#C58547', color: '#070D18', border: 'none', padding: '0 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
            </form>
          </div>
        )}

      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (ESTILO APP NATIVA MÓVIL) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0B1320',
        borderTop: '1px solid #1E293B',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        zIndex: 1000,
        maxWidth: '650px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => { setTipoCuenta('comprador'); setProductoSeleccionado(null); }}
          style={{ background: 'none', border: 'none', color: tipoCuenta === 'comprador' ? '#E8B882' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>🏠</span>
          Home
        </button>

        <button
          onClick={() => { setTipoCuenta('comprador'); setProductoSeleccionado(null); }}
          style={{ background: 'none', border: 'none', color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>📂</span>
          Categorías
        </button>

        <button
          onClick={() => setTipoCuenta('carrito')}
          style={{ background: 'none', border: 'none', color: tipoCuenta === 'carrito' ? '#E8B882' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>🛒</span>
          Carta ({carrito.length})
        </button>

        <button
          onClick={() => setMostrarMenuMas(!mostrarMenuMas)}
          style={{ background: 'none', border: 'none', color: mostrarMenuMas ? '#E8B882' : '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '11px', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>☰</span>
          Más
        </button>
      </nav>

      {/* MENÚ DESPLEGABLE DE LA OPCIÓN "MÁS" */}
      {mostrarMenuMas && (
        <div style={{
          position: 'fixed',
          bottom: '70px',
          right: '16px',
          backgroundColor: '#0B1320',
          border: '1px solid #334155',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 1001,
          width: '220px',
          overflow: 'hidden'
        }}>
          {comercioActivo && (
            <>
              <button
                onClick={() => { setTipoCuenta('cargar_producto'); setMostrarMenuMas(false); }}
                style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #1E293B', color: '#F3F4F6', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
              >
                📦 Cargar Producto
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('comercioMercadoOnce');
                  setComercioActivo(null);
                  setTipoCuenta('comprador');
                  setMostrarMenuMas(false);
                  alert('Has cerrado sesión correctamente.');
                }}
                style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #1E293B', color: '#EF4444', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
              >
                🚪 Cerrar Sesión Local
              </button>
            </>
          )}
          <button
            onClick={() => { setTipoCuenta('mensajes'); setMostrarMenuMas(false); }}
            style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #1E293B', color: '#F3F4F6', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
          >
            💬 Chat Directo
          </button>
          <button
            onClick={() => { setTipoCuenta('favoritos'); setMostrarMenuMas(false); }}
            style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: '1px solid #1E293B', color: '#F3F4F6', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
          >
            ❤️ Mis Favoritos ({favoritos.length})
          </button>
          <button
            onClick={() => { setTipoCuenta('comerciante'); setMostrarMenuMas(false); }}
            style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#F3F4F6', fontSize: '13px', textAlign: 'left', cursor: 'pointer' }}
          >
            🏪 Registrar mi Local
          </button>
        </div>
      )}

    </div>
  );
}