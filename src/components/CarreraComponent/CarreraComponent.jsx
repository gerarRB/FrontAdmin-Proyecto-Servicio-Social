import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getCarreras,
  createCarrera,
  updateCarrera,
  deleteCarrera,
  getCoordinaciones,
} from "../../services/carreras.service";

export function CarreraComponent() {
  const [carreras, setCarreras] = useState([]);
  const [coordinaciones, setCoordinaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_carrera: "",
    coordinacion_id: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [carrerasResponse, coordinacionesResponse] = await Promise.all([
        getCarreras(),
        getCoordinaciones(),
      ]);
      // Asegurar que los datos sean arreglos
      const carrerasData = Array.isArray(carrerasResponse.data)
        ? carrerasResponse.data
        : [];
      const coordinacionesData = Array.isArray(coordinacionesResponse.data)
        ? coordinacionesResponse.data
        : [];
      setCarreras(carrerasData);
      setCoordinaciones(coordinacionesData);
    } catch (error) {
      console.error("Error en fetchData:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudieron obtener los datos",
        "error"
      );
      setCarreras([]);
      setCoordinaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (
    carrera = {
      id: null,
      nombre_carrera: "",
      coordinacion_id: "",
    }
  ) => {
    setModalData(carrera);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre_carrera: modalData.nombre_carrera,
        coordinacion_id: modalData.coordinacion_id,
      };

      if (modalData.id) {
        await updateCarrera(modalData.id, data);
        Swal.fire("Actualizado", "La carrera ha sido actualizada.", "success");
      } else {
        await createCarrera(data);
        Swal.fire("Creado", "La carrera ha sido creada.", "success");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Hubo un problema al guardar.",
        "error"
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteCarrera(id);
        Swal.fire("Eliminado", "La carrera ha sido eliminada.", "success");
        fetchData();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Hubo un problema al eliminar.",
          "error"
        );
      }
    }
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
            <th>Carrera</th>
            <th>Coordinación</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {carreras.length > 0 ? (
            carreras.map((carrera, index) => (
              <tr key={carrera.id}>
                <td>{index + 1}</td>
                <td>{carrera.nombre_carrera}</td>
                <td>
                  {carrera.coordinacion?.nombre_coordinacion ||
                    "Coordinación N/A"}
                </td>
                <td>
                  <button
                    className="btn btn-info me-2"
                    onClick={() => openModal(carrera)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(carrera.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay carreras disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal para Carrera */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            onClick={(e) => {
              if (e.target.classList.contains("modal")) {
                setShowModal(false);
              }
            }}
            onKeyDown={(e) => {
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
                onKeyDown={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalData.id ? "Editar Carrera" : "Crear Carrera"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="nombre_carrera" className="form-label">
                      Nombre de la Carrera
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_carrera"
                      placeholder="Nombre de la carrera"
                      value={modalData.nombre_carrera}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          nombre_carrera: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="coordinacion_id" className="form-label">
                      Coordinación
                    </label>
                    <select
                      className="form-select"
                      id="coordinacion_id"
                      value={modalData.coordinacion_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          coordinacion_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione una coordinación</option>
                      {coordinaciones.map((coordinacion) => (
                        <option key={coordinacion.id} value={coordinacion.id}>
                          {coordinacion.nombre_coordinacion}
                        </option>
                      ))}
                    </select>
                    {coordinaciones.length === 0 && (
                      <div className="form-text text-danger">
                        No hay coordinaciones disponibles. Crea una coordinación
                        primero.
                      </div>
                    )}
                  </div>
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
