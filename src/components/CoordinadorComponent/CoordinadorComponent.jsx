import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getCoordinadores,
  getCoordinaciones,
  getUsers,
  createCoordinador,
  updateCoordinador,
  deleteCoordinador,
} from "../../services/coordinadores.service";

export function CoordinadorComponent() {
  const [coordinadores, setCoordinadores] = useState([]);
  const [coordinaciones, setCoordinaciones] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_coordinador: "",
    apellido_coordinador: "",
    correo_coordinador: "",
    telefono_coordinador: "",
    coordinacion_id: "",
    user_id: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coordinadoresResponse, coordinacionesResponse, usersResponse] =
        await Promise.all([
          getCoordinadores(),
          getCoordinaciones(),
          getUsers(),
        ]);
      setCoordinadores(coordinadoresResponse.data.data);
      setCoordinaciones(coordinacionesResponse.data);
      setUsers(usersResponse.data.data);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudieron obtener los datos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sincronización de correos: Actualiza correo_coordinador cuando cambia user_id
  useEffect(() => {
    if (modalData.user_id) {
      const selectedUser = users.find(
        (user) => user.id === parseInt(modalData.user_id)
      );
      if (selectedUser && !modalData.id) {
        setModalData((prev) => ({
          ...prev,
          correo_coordinador: selectedUser.email,
        }));
      }
    } else {
      setModalData((prev) => ({
        ...prev,
        correo_coordinador: "",
      }));
    }
  }, [modalData.user_id, users, modalData.id]);

  const openModal = (
    coordinador = {
      id: null,
      nombre_coordinador: "",
      apellido_coordinador: "",
      correo_coordinador: "",
      telefono_coordinador: "",
      coordinacion_id: "",
      user_id: "",
    }
  ) => {
    setModalData(coordinador);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre_coordinador: modalData.nombre_coordinador,
        apellido_coordinador: modalData.apellido_coordinador,
        correo_coordinador: modalData.correo_coordinador,
        telefono_coordinador: modalData.telefono_coordinador,
        coordinacion_id: modalData.coordinacion_id,
        user_id: modalData.user_id,
      };

      if (modalData.id) {
        await updateCoordinador(modalData.id, data);
        Swal.fire(
          "Actualizado",
          "El coordinador ha sido actualizado.",
          "success"
        );
      } else {
        await createCoordinador(data);
        Swal.fire("Creado", "El coordinador ha sido creado.", "success");
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
        await deleteCoordinador(id);
        Swal.fire("Eliminado", "El coordinador ha sido eliminado.", "success");
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
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Coordinación</th>
            <th>Usuario</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {coordinadores.map((coordinador, index) => (
            <tr key={coordinador.id}>
              <td>{index + 1}</td>
              <td>{coordinador.nombre_coordinador}</td>
              <td>{coordinador.apellido_coordinador}</td>
              <td>{coordinador.correo_coordinador}</td>
              <td>{coordinador.telefono_coordinador}</td>
              <td>
                {coordinador.coordinacion?.nombre_coordinacion || "Ninguna"}
              </td>
              <td>{coordinador.usuario?.name || "Ninguno"}</td>
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => openModal(coordinador)}
                >
                  <FaEdit />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(coordinador.id)}
                >
                  <FaTrash />
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
                    {modalData.id ? "Editar Coordinador" : "Crear Coordinador"}
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
                    <label htmlFor="nombre_coordinador" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_coordinador"
                      placeholder="Nombre del coordinador"
                      value={modalData.nombre_coordinador}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          nombre_coordinador: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="apellido_coordinador"
                      className="form-label"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido_coordinador"
                      placeholder="Apellido del coordinador"
                      value={modalData.apellido_coordinador}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          apellido_coordinador: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo_coordinador" className="form-label">
                      Correo
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo_coordinador"
                      placeholder="Correo electrónico"
                      value={modalData.correo_coordinador}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          correo_coordinador: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="telefono_coordinador"
                      className="form-label"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono_coordinador"
                      placeholder="Teléfono"
                      value={modalData.telefono_coordinador}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          telefono_coordinador: e.target.value,
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
                  </div>
                  <div className="mb-3">
                    <label htmlFor="user_id" className="form-label">
                      Usuario
                    </label>
                    <select
                      className="form-select"
                      id="user_id"
                      value={modalData.user_id}
                      onChange={(e) =>
                        setModalData({ ...modalData, user_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccione un usuario</option>
                      {users
                        .filter((user) => user.roles.includes("Admin"))
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                    </select>
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
