import React, { useState, useEffect } from 'react';
import MembresiaPlanes from './MembresiaPlanes';
import HomeMercado from './HomeMercado';
const API_BASE_URL = 'https://mercado-once-backend-1.onrender.com/api';

export default function App() {
  const [tipoCuenta, setTipoCuenta] = useState('comprador');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('menor');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [imagenProducto, setImagenProducto] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarQR, setMostrarQR] = useState(false);
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
        alert(`Error al enviar mensaje: ${resultado.error || 'Desconocido'}`);
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
      cuit: formData.get('cuit'),
      categorias: formData.getAll('categorias')
    };

    try {
      const respuesta = await fetch(`${API_BASE_URL}/comerciantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const resultado = await respuesta.json();
      if (respuesta.ok) {
        const numeroSocio = resultado.id || resultado.comercio?.id || 1;
        if (numeroSocio <= 50) {
          alert(`¡Felicidades! Sos el miembro número #${numeroSocio} y tenés tus 60 días de membresía gratis.`);
        } else {
          alert('¡Registro de comerciante guardado con éxito!');
        }
        localStorage.setItem('comerciosMercadoOnce', JSON.stringify(datos));
        setComercioActivo(datos);
        e.target.reset();
        setTipoCuenta('cargar_producto');
      } else {
        alert(`Error del servidor: ${resultado.message || JSON.stringify(resultado)}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert(`Error de conexión: ${error.message}`);
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
        alert(`Error del servidor (${respuesta.status}): ${errorTexto}`);
        return;
      }

      alert('¡Registro de cliente guardado con éxito!');
      e.target.reset();
    } catch (error) {
      console.error('Error de red:', error);
      alert(`Error de conexión: ${error.message}`);
    }
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const formData = new FormData(formElement);
    
    if (imagenProducto && !formData.get('imagen')) {
      formData.append('imagen', imagenProducto);
    }

    try {
      const respuesta = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        body: formData
      });
      
      const resultado = await respuesta.json();
      
      if (respuesta.ok) {
        alert('¡Producto guardado con éxito!');
        formElement.reset();
        setImagenProducto('');
        setTipoCuenta('comprador');
      } else {
        alert(`Error del servidor: ${resultado.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ backgroundColor: '#090F20', color: '#F3F4F6', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
  {/* Cabecera Principal */}
<header className="w-full bg-[#0E1838] border-b border-slate-800 py-3 px-4 flex items-center justify-center">
  <div className="flex items-center gap-3">
    <img 
      src="/Splash-mo.png.jpeg" 
      alt="Mercado Once Logo" 
      style={{ 
        width: '48px', 
        height: '48px', 
        objectFit: 'cover', 
        objectPosition: '12% center', 
        borderRadius: '50%',
        border: '2px solid #D49B6A'
      }} 
    />
    <div className="flex flex-col text-left">
      <h1 className="text-xl font-extrabold text-[#D49B6A] leading-tight tracking-wide">
        MERCADO ONCE
      </h1>
      <p className="text-xs text-slate-300 font-medium">
        Todo lo que buscas en un solo lugar
      </p>
    </div>
  </div>
</header>

      <main style={{ padding: '16px', paddingBottom: '90px', maxWidth: '650px', margin: '0 auto' }}>
        
  {/* Barra de Búsqueda General */}
<div style={{ marginBottom: '16px', position: 'relative' }}>
  <input
    type="text"
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    placeholder="Buscar productos o comercios en Once..."
    style={{
      width: '100%',
      padding: '12px 40px 12px 16px',
      border: '1px solid #334155',
      backgroundColor: '#0B1320',
      color: 'white',
      fontSize: '14px',
      borderRadius: '8px',
      boxSizing: 'border-box'
    }}
  />
  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>
    🔍
  </span>
</div>


        {/* VISTA 1: Catálogo integrado con HomeMercado */}
        {tipoCuenta === 'comprador' && !productoSeleccionado && (
          <div>
            <HomeMercado 
              productos={productosFiltrados} 
              onSelectProducto={(prod) => setProductoSeleccionado(prod)} 
            />
            
            {/* Selector de orden de precio */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '14px', marginBottom: '14px', padding: '0 16px' }}>
              <select
                value={ordenPrecio}
                onChange={(e) => setOrdenPrecio(e.target.value)}
                style={{
                  backgroundColor: '#0B1320',
                  color: '#D49B6A',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 10px',
                 fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="menor">Menor a Mayor</option>
                <option value="mayor">Mayor a Menor</option>
              </select>
            </div>
          </div>
        )}

        {/* VISTA DETALLE DEL PRODUCTO SELECCIONADO */}
        {tipoCuenta === 'comprador' && productoSeleccionado && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <button
              onClick={() => setProductoSeleccionado(null)}
              style={{ backgroundColor: '#1E293B', color: '#D49B6A', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', marginBottom: '14px' }}
            >
              ← Volver al catálogo
            </button>
            <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }} />
            <span style={{ fontSize: '11px', color: '#D49B6A', fontWeight: 'bold', textTransform: 'uppercase' }}>{productoSeleccionado.categoria}</span>
            <h2 style={{ margin: '6px 0', fontSize: '18px', color: '#F3F4F6' }}>{productoSeleccionado.nombre}</h2>
            <p style={{ margin: '0 0 12px 0', fontSize: '22px', fontWeight: 'bold', color: '#D49B6A' }}>${productoSeleccionado.precio.toLocaleString('es-AR')}</p>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', lineHeight: '1.4' }}>{productoSeleccionado.descripcion}</p>
            
            <div style={{ backgroundColor: '#090F20', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B', marginBottom: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: '#F3F4F6' }}>🏪 Vendido por: {productoSeleccionado.comercio}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>📍 Dirección en Once: {productoSeleccionado.direccion}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => agregarAlCarrito(productoSeleccionado)}
                style={{ flex: 1, backgroundColor: '#1E293B', color: '#D49B6A', border: '1px solid #334155', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                🛒 Añadir al Carrito
              </button>
              <button
                onClick={() => {
                  setTipoCuenta('mensajes');
                  setProductoSeleccionado(null);
                }}
                style={{ flex: 1, backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                💬 Contactar Local
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: Registro de Cliente */}
        {tipoCuenta === 'registro_cliente' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#D49B6A' }}>Registro de Cliente</h3>
            <form onSubmit={handleSubmitCliente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" name="nombre" placeholder="Nombre completo" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <input type="email" name="email" placeholder="Correo electrónico" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <input type="password" name="password" placeholder="Contraseña" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Registrarse</button>
            </form>
          </div>
        )}

        {/* VISTA 3: Registro de Comerciante */}
        {tipoCuenta === 'comerciante' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#D49B6A' }}>Registro de Local / Comerciante</h3>
            <form onSubmit={handleSubmitComerciante} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" name="nombre" placeholder="Nombre del Local / Comercio" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <input type="text" name="direccion" placeholder="Dirección en Once (ej: Paso 210)" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <input type="text" name="whatsapp" placeholder="WhatsApp de contacto" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <input type="text" name="cuit" placeholder="CUIT / Identificación Comercial" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Registrar Comercio</button>
            </form>
          </div>
        )}

        {/* VISTA: Iniciar Sesión de Comerciante */}
        {tipoCuenta === 'iniciar_sesion' && !comercioActivo && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#D49B6A' }}>Iniciar Sesión / Comerciante</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cuitIngresado = e.target.cuitLogin.value.trim();
              
              const datoGuardado = JSON.parse(localStorage.getItem('comerciosMercadoOnce'));
              let comercioEncontrado = null;

              if (Array.isArray(datoGuardado)) {
                comercioEncontrado = datoGuardado.find(c => c.cuit === cuitIngresado);
              } else if (datoGuardado && datoGuardado.cuit === cuitIngresado) {
                comercioEncontrado = datoGuardado;
              }

              if (comercioEncontrado) {
                setComercioActivo(comercioEncontrado);
                localStorage.setItem('comercioMercadoOnce', JSON.stringify(comercioEncontrado));
                alert(`¡Bienvenido de nuevo, ${comercioEncontrado.nombre}!`);
                setTipoCuenta('cargar_producto');
              } else {
                alert('No se encontró ningún comercio registrado con ese CUIT. Verifica los datos o regístrate.');
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                name="cuitLogin" 
                placeholder="CUIT / Identificación Comercial" 
                required 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #1E293B', background: '#090F20', color: '#FFF' }}
              />
              <button 
                type="submit" 
                style={{ backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        )}

        {/* VISTA: Estado de Membresía y Planes del Comerciante */}
        {tipoCuenta === 'iniciar_sesion' && comercioActivo && (
          <div style={{ padding: '0', maxWidth: '800px', margin: '0 auto' }}>
            <MembresiaPlanes comerciante={comercioActivo} />
          </div>
        )}

        {/* VISTA: Cargar Producto */}
        {tipoCuenta === 'cargar_producto' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#D49B6A' }}>Cargar Nuevo Producto</h3>
            <form onSubmit={handleSubmitProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" name="nombre" placeholder="Nombre del producto" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#090F20', color: '#FFF' }} />
              <input type="text" name="descripcion" placeholder="Descripción breve" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#090F20', color: '#FFF' }} />
              <input type="number" name="precio" placeholder="Precio en pesos" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#090F20', color: '#FFF' }} />
              <select name="categoria" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#090F20', color: '#FFF' }}>
                <option value="">Selecciona una categoría</option>
                <option value="Indumentaria">Indumentaria</option>
                <option value="Marroquinería">Marroquinería</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Hogar y Bazar">Hogar y Bazar</option>
              </select>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', color: '#94A3B8', fontSize: '12px', marginBottom: '6px' }}>
                  Imagen del producto (Subir archivo)
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const archivo = e.target.files[0];
                    if (archivo) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagenProducto(reader.result);
                      };
                      reader.readAsDataURL(archivo);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    backgroundColor: '#090F20',
                    color: '#FFF',
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }} 
                />
                {imagenProducto && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <img 
                      src={imagenProducto} 
                      alt="Vista previa" 
                      style={{ maxHeight: '100px', borderRadius: '6px', border: '1px solid #334155' }} 
                    />
                  </div>
                )}
              </div>
              <button type="submit" style={{ backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar y Publicar Producto</button>
            </form>
          </div>
        )}

        {/* VISTA 4: Mensajería / Chat Directo */}
        {tipoCuenta === 'mensajes' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#D49B6A' }}>Negociación Directa</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>Coordiná stock y entregas directamente con el comerciante.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', color: '#94A3B8' }}>ID Emisor:</label>
                <input type="text" value={emisorId} onChange={(e) => setEmisorId(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '10px', color: '#94A3B8' }}>ID Receptor:</label>
                <input type="text" value={receptorId} onChange={(e) => setReceptorId(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white', boxSizing: 'border-box' }} />
              </div>
              <button onClick={cargarMensajes} style={{ alignSelf: 'flex-end', backgroundColor: '#1E293B', color: '#D49B6A', border: '1px solid #334155', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Actualizar</button>
            </div>

            <div style={{ minHeight: '200px', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#090F20', padding: '12px', borderRadius: '8px', border: '1px solid #1E293B', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mensajes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', marginTop: '80px' }}>No hay mensajes en esta conversación.</p>
              ) : (
                mensajes.map((msg, index) => (
                  <div key={index} style={{ alignSelf: String(msg.emisor_id) === String(emisorId) ? 'flex-end' : 'flex-start', backgroundColor: String(msg.emisor_id) === String(emisorId) ? '#1C2A44' : '#1E293B', color: String(msg.emisor_id) === String(emisorId) ? '#D49B6A' : '#F3F4F6', padding: '8px 12px', borderRadius: '8px', maxWidth: '80%', fontSize: '13px' }}>
                    <p style={{ margin: 0 }}>{msg.texto}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleEnviarMensaje} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={textoMensaje} onChange={(e) => setTextoMensaje(e.target.value)} placeholder="Escribí tu consulta al comerciante..." style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#090F20', color: 'white' }} />
              <button type="submit" style={{ backgroundColor: '#D49B6A', color: '#090F20', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Enviar</button>
            </form>
          </div>
        )}

        {/* VISTA 5: Carrito */}
        {tipoCuenta === 'carrito' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#D49B6A' }}>Tu Carrito de Compras</h3>
            {carrito.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>El carrito está vacío.</p>
            ) : (
              <div>
                {carrito.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1E293B' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '13px' }}>{item.nombre}</p>
                      <p style={{ margin: 0, color: '#D49B6A', fontSize: '12px' }}>${item.precio.toLocaleString('es-AR')}</p>
                    </div>
                    <button onClick={() => eliminarDelCarrito(index)} style={{ backgroundColor: '#7F1D1D', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA 6: Favoritos */}
        {tipoCuenta === 'favoritos' && (
          <div style={{ backgroundColor: '#0B1320', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#D49B6A' }}>Tus Favoritos</h3>
            {favoritos.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '13px' }}>No agregaste productos a favoritos aún.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {favoritos.map((prod) => (
                  <div key={prod.id} style={{ backgroundColor: '#090F20', padding: '10px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 'bold' }}>{prod.nombre}</p>
                    <p style={{ margin: 0, color: '#D49B6A', fontSize: '12px' }}>${prod.precio.toLocaleString('es-AR')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Barra de Navegación Inferior Estilo App Móvil (Para alternar secciones limpiamente) */}
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
          zIndex: 900
        }}>
          <button 
            onClick={() => { setTipoCuenta('comprador'); setProductoSeleccionado(null); }}
            style={{ background: 'none', border: 'none', color: tipoCuenta === 'comprador' ? '#D49B6A' : '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span>🏠</span>
            <span>Inicio</span>
          </button>
          
          <button 
            onClick={() => { setTipoCuenta('registro_cliente'); setProductoSeleccionado(null); }}
            style={{ background: 'none', border: 'none', color: tipoCuenta === 'registro_cliente' ? '#D49B6A' : '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span>👤</span>
            <span>Cliente</span>
          </button>

          <button 
            onClick={() => { setTipoCuenta('comerciante'); setProductoSeleccionado(null); }}
            style={{ background: 'none', border: 'none', color: tipoCuenta === 'comerciante' ? '#D49B6A' : '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span>🏪</span>
            <span>Local</span>
          </button>

          <button 
            onClick={() => { setTipoCuenta('iniciar_sesion'); setProductoSeleccionado(null); }}
            style={{ background: 'none', border: 'none', color: tipoCuenta === 'iniciar_sesion' ? '#D49B6A' : '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span>🔑</span>
            <span>{comercioActivo ? 'Panel' : 'Acceso'}</span>
          </button>

          <button 
            onClick={() => { setTipoCuenta('mensajes'); setProductoSeleccionado(null); }}
            style={{ background: 'none', border: 'none', color: tipoCuenta === 'mensajes' ? '#D49B6A' : '#94A3B8', fontSize: '11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <span>💬</span>
            <span>Chat</span>
          </button>
        </nav>

        {/* Botón flotante para generar el QR */}
        <button 
          onClick={() => setMostrarQR(true)}
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: '#25D366',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: '8px 16px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 1000,
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          📱 QR
        </button>

        {/* Modal del Código QR */}
        {mostrarQR && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100
          }}>
            <div style={{
              backgroundColor: '#0B1320',
              border: '1px solid #1E293B',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '320px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#D49B6A' }}>¡Escaneá para ingresar!</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '15px' }}>
                Abre la cámara de tu celular para entrar a Mercado Once.
              </p>
              
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mercado-once.vercel.app" 
                alt="Código QR Mercado Once" 
                style={{ border: '3px solid #1E293B', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#fff', padding: '6px' }}
              />
              
              <br />
              
              <button 
                onClick={() => setMostrarQR(false)}
                style={{
                  backgroundColor: '#7F1D1D',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

      </main>
      {/* 3. BARRA INFERIOR DE NAVEGACIÓN */}
<nav className="fixed bottom-0 left-0 right-0 bg-[#0E1838] border-t border-slate-800 py-2 px-3 flex justify-between items-center z-50">
  
  {/* 1. Inicio */}
  <button 
    onClick={() => navigate('/')} 
    className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#D49B6A] transition-colors"
  >
    <HomeIcon className="w-5 h-5 text-[#D49B6A]" />
    <span className="text-[11px] font-medium">Inicio</span>
  </button>

  {/* 2. Categorías (Menú desplegable con las 10 categorías) */}
  <div className="relative">
    <button 
      onClick={() => setShowCategories(!showCategories)} 
      className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#D49B6A] transition-colors"
    >
      <div className="flex items-center gap-0.5">
        <Squares2X2Icon className="w-5 h-5 text-[#D49B6A]" />
        <ChevronUpIcon className={`w-3 h-3 text-[#D49B6A] transition-transform ${showCategories ? 'rotate-180' : ''}`} />
      </div>
      <span className="text-[11px] font-medium">Categorías</span>
    </button>

    {/* Desplegable con scroll y las 10 categorías */}
    {showCategories && (
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 max-h-64 overflow-y-auto bg-[#0E1838] border border-[#D49B6A] rounded-xl shadow-2xl py-2 z-50">
        {[
          "Indumentaria",
          "Marroquinería",
          "Tecnología",
          "Hogar y bazar",
          "Calzado",
          "Juguetería",
          "Bijouterie y accesorios",
          "Artículos regionales",
          "Lencería",
          "Librerías y artículos escolares"
        ].map((cat, index) => (
          <button 
            key={index}
            onClick={() => { selectCategory(cat); setShowCategories(false); }}
            className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-none"
          >
            {cat}
          </button>
        ))}
      </div>
    )}
  </div>

  {/* 3. Fav (Favoritos) */}
  <button 
    onClick={() => navigate('/favoritos')} 
    className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#D49B6A] transition-colors"
  >
    <HeartIcon className="w-5 h-5 text-[#D49B6A]" />
    <span className="text-[11px] font-medium">Fav</span>
  </button>

  {/* 4. Carrito */}
  <button 
    onClick={() => navigate('/carrito')} 
    className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#D49B6A] transition-colors"
  >
    <ShoppingCartIcon className="w-5 h-5 text-[#D49B6A]" />
    <span className="text-[11px] font-medium">Carrito</span>
  </button>

  {/* 5. Cuenta */}
  <button 
    onClick={() => navigate('/login')} 
    className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#D49B6A] transition-colors"
  >
    <UserIcon className="w-5 h-5 text-[#D49B6A]" />
    <span className="text-[11px] font-medium">Cuenta</span>
  </button>

</nav>
    </div>
  );
}