import React, { useEffect, useState } from 'react';
import { getCoordinaciones } from '../../services';

export function CoordinacionComponent() {
  const [coordinaciones, setCoordinaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ShowCoordinaciones = async () => {
      try {
        const response = await getCoordinaciones();
        setCoordinaciones(response.data); 
      } catch (error) {
        console.error('Error al obtener coordinaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    ShowCoordinaciones();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className='d-grip gap-2'> 
          <button className='btn btn-success btn-lg mt-2 mb-2 text-white'>Create</button>
      </div>
      <table className='table table-striped table-bordered'>
        <thead className='bg-primary text-white'>
          <tr>
            <th>N°</th>
            <th>Nombre Coordinacion</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>  
        </thead>
        <tbody>
          {coordinaciones.map((coordinacion, index) => (
            <tr key={coordinacion.id}>
              <td>{index + 1}</td>
              <td>{coordinacion.nombre_coordinacion}</td>
              <td>
                <button className='btn btn-info'>Edit</button>
              </td>
              <td>
                <button className='btn btn-danger'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
