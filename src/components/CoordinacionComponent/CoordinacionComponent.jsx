import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  getCoordinaciones,
  createCoordinacion,
  updateCoordinacion,
  deleteCoordinacion,
} from "../../services";

export function CoordinacionComponent() {
  const [coordinaciones, setCoordinaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_coordinacion: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchCoordinaciones = async () => {
    setLoading(true);
    try {
      const response = await getCoordinaciones();
      setCoordinaciones(response.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron obtener las coordinaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinaciones();
  }, []);

  const openModal = (coordinacion = { id: null, nombre_coordinacion: "" }) => {
    setModalData(coordinacion);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalData.id) {
        await updateCoordinacion(modalData.id, {
          nombre_coordinacion: modalData.nombre_coordinacion,
        });
        Swal.fire(
          "Actualizado",
          "La coordinación ha sido actualizada.",
          "success"
        );
      } else {
        await createCoordinacion({
          nombre_coordinacion: modalData.nombre_coordinacion,
        });
        Swal.fire("Creado", "La coordinación ha sido creada.", "success");
      }
      setShowModal(false);
      fetchCoordinaciones();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al guardar.", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCoordinacion(id);
          Swal.fire(
            "Eliminado",
            "La coordinación ha sido eliminada.",
            "success"
          );
          fetchCoordinaciones();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar.", "error");
        }
      }
    });
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="d-grip gap-2">
        <button
          className="btn btn-success btn-lg mt-2 mb-2 text-white"
          onClick={() => openModal()}
        >
        Crear
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="bg-primary text-white">
          <tr>
            <th>#</th>
            <th>Nombre Coordinación</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {coordinaciones.map((c, index) => (
            <tr key={c.id}>
              <td>{index + 1}</td>
              <td>{c.nombre_coordinacion}</td>
              <td>
                <button className="btn btn-info" onClick={() => openModal(c)}>
                  <FaEdit/>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(c.id)}
                >
                  <FaTrash/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
 
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            onClick={(e) => {
              // Cierra al hacer clic fuera del modal
              if (e.target.classList.contains("modal")) {
                setShowModal(false);
              }
            }}
            onKeyDown={(e) => {
              // Cierra con ESC
              if (e.key === "Escape") {
                setShowModal(false);
              }
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog">
              <form
                className="modal-content"
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.stopPropagation()} // Previene cierre por ESC dentro del formulario
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalData.id
                      ? "Editar Coordinación"
                      : "Crear Coordinación"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la coordinación"
                    value={modalData.nombre_coordinacion}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        nombre_coordinacion: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
