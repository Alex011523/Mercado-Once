import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const MembresiaPlanes = ({ comerciante }) => {
  const [infoPago, setInfoPago] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Datos por defecto del comerciante si se está cargando
  const merchantNumber = comerciante?.merchant_number || 1;
  const esPromo = comerciante?.plan_type === 'promo_trial' || merchantNumber <= 50;
  
  // Cálculo simulado/real de días restantes de prueba (ejemplo: 60 días desde la fecha de registro/lanzamiento)
  const diasRestantesTrial = comerciante?.dias_restantes_trial ?? 60; 

  useEffect(() => {
    // Obtener los montos y datos de CBU desde el backend
    fetch(`${API_BASE_URL}/api/membresia/info-pago`)
          .then((res) => res.json())
          .then((data) => {
            if (data.exito) setInfoPago(data);
            setCargando(false);
          })
          .catch((err) => {
            console.error('Error al cargar datos de pago:', err);
            setCargando(false);
          });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#1a1a1a', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
        Membresía y Planes MO
      </h2>

      {/* TARJETA DE ESTADO ACTUAL DEL SOCIO */}
      <div style={{
        backgroundColor: esPromo ? '#e8f5e9' : '#fff3e0',
        border: `1px solid ${esPromo ? '#81c784' : '#ffb74d'}`,
        borderRadius: '8px',
        padding: '15px 20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: esPromo ? '#2e7d32' : '#e65100' }}>
          Estado: {esPromo ? 'Plan Promocional (60 Días Gratis)' : 'Plan Base Requerido'}
        </h3>
        <p style={{ margin: '4px 0', fontSize: '15px' }}>
          <strong>Número de Socio MO:</strong> #{merchantNumber}
        </p>

        {/* ALERTAS DINÁMICAS */}
        {esPromo && diasRestantesTrial > 5 && (
          <p style={{ margin: '8px 0 0 0', color: '#1b5e20', fontWeight: 'bold' }}>
            🎉 ¡Felicidades! Tenés tu beneficio activo de 60 días gratis por ser uno de los primeros 50 comerciantes.
          </p>
        )}

        {esPromo && diasRestantesTrial <= 5 && diasRestantesTrial > 0 && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff8e1', borderRadius: '5px', borderLeft: '4px solid #ffb300' }}>
            ⚠️ <strong>¡Atención!</strong> Te quedan solo <strong>{diasRestantesTrial} días</strong> de membresía gratis. Para no interrumpir la publicación de tus productos, podés abonar tu próximo período a continuación.
          </div>
        )}

        {(!esPromo || diasRestantesTrial <= 0) && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px', borderLeft: '4px solid #e53935' }}>
            🚫 <strong>Membresía Vencida / Inactiva:</strong> Para poder publicar o mantener visibles tus productos en la plataforma, realizá la activación de tu plan base.
          </div>
        )}
      </div>

      {/* PLANES DISPONIBLES */}
      <h3 style={{ marginTop: '30px' }}>Planes de Membresía Disponibles</h3>
      
      {cargando ? (
        <p>Cargando información de planes...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px' }}>
            {/* PLAN BASE */}
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0d47a1' }}>Plan Base Mensual</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#212121' }}>
                ${infoPago?.planes?.base_mensual?.toLocaleString('es-AR') || '5.000'} <small>/mes</small>
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>Publicación completa en catálogo y perfil de comercio.</p>
            </div>

            {/* PLAN DESTACADO */}
            <div style={{ border: '2px solid #ff9800', borderRadius: '8px', padding: '15px', textAlign: 'center', backgroundColor: '#fffde7' }}>
              <span style={{ backgroundColor: '#ff9800', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>RECOMENDADO</span>
              <h4 style={{ margin: '8px 0 10px 0', color: '#f57c00' }}>Destacado Semanal</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#212121' }}>
                ${infoPago?.planes?.destacado_semanal?.toLocaleString('es-AR') || '3.000'} <small>/semana</small>
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>Aparece en los primeros lugares de búsquedas de Once.</p>
            </div>

            {/* PLAN COMBINADO */}
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#4a148c' }}>Plan Combinado</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#212121' }}>
                ${infoPago?.planes?.combinado_mensual?.toLocaleString('es-AR') || '12.000'} <small>/mes</small>
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>Plan base mensual + 2 semanas de destaque asegurado.</p>
            </div>
          </div>

          {/* DATOS DE TRANSFERENCIA PARA EL PAGO */}
          {infoPago?.datos_transferencia && (
            <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '20px', border: '1px dashed #bdbdbd' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Datos para Transferencia Bancaria</h4>
              <p style={{ margin: '5px 0' }}><strong>Banco / Entidad:</strong> {infoPago.datos_transferencia.banco}</p>
              <p style={{ margin: '5px 0' }}><strong>Titular:</strong> {infoPago.datos_transferencia.titular}</p>
              <p style={{ margin: '5px 0' }}><strong>Alias:</strong> <span style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>{infoPago.datos_transferencia.alias}</span></p>
              <p style={{ margin: '5px 0' }}><strong>CBU/CVU:</strong> <span style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' }}>{infoPago.datos_transferencia.cbu}</span></p>
              <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '15px 0' }} />
              <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>
                📌 <em>{infoPago.datos_transferencia.instructivo}</em>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MembresiaPlanes;