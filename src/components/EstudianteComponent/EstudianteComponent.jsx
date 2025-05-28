import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEnvelope } from "react-icons/fa";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getCarreras,
  getUsers,
  sendEstudianteEmail,
} from "../../services/estudiantes.service";
 
export function EstudianteComponent() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_estudiante: "",
    apellido_estudiante: "",
    carnet: "",
    correo_estudiante: "",
    telefono_estudiante: "",
    carrera_id: "",
    user_id: "",
  });
  const [showModal, setShowModal] = useState(false);
 
  const fetchData = async () => {
    setLoading(true);
    try {
      const [estudiantesResponse, carrerasResponse, usersResponse] =
        await Promise.all([
          getEstudiantes().catch((err) => {
            console.error(
              "Error en getEstudiantes:",
              err.response?.data || err.message
            );
            throw new Error("No se pudieron obtener los estudiantes");
          }),
          getCarreras().catch((err) => {
            console.error(
              "Error en getCarreras:",
              err.response?.data || err.message
            );
            throw new Error("No se pudieron obtener las carreras");
          }),
          getUsers().catch((err) => {
            console.error(
              "Error en getUsers:",
              err.response?.data || err.message
            );
            throw new Error("No se pudieron obtener los usuarios");
          }),
        ]);
 
      const estudiantesData = Array.isArray(estudiantesResponse.data.data.data)
        ? estudiantesResponse.data.data.data
        : [];
      const carrerasData = Array.isArray(carrerasResponse.data)
        ? carrerasResponse.data
        : [];
      const usersData = Array.isArray(usersResponse.data.data)
        ? usersResponse.data.data
        : Array.isArray(usersResponse.data)
        ? usersResponse.data
        : [];
 
      if (estudiantesData.length === 0) {
        Swal.fire("Información", "No se encontraron estudiantes.", "info");
      }
 
      setEstudiantes(estudiantesData);
      setCarreras(carrerasData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error en fetchData:", error.message, error.response?.data);
      Swal.fire(
        "Error",
        error.message || "No se pudieron obtener los datos",
        "error"
      );
      setEstudiantes([]);
      setCarreras([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, []);
 
  useEffect(() => {
    if (modalData.user_id) {
      const selectedUser = users.find(
        (user) => user.id === parseInt(modalData.user_id)
      );
      if (selectedUser) {
        setModalData((prev) => ({
          ...prev,
          correo_estudiante: selectedUser.email,
        }));
      }
    }
  }, [modalData.user_id, users]);
 
  const openModal = (
    estudiante = {
      id: null,
      nombre_estudiante: "",
      apellido_estudiante: "",
      carnet: "",
      correo_estudiante: "",
      telefono_estudiante: "",
      carrera_id: "",
      user_id: "",
    }
  ) => {
    setModalData(estudiante);
    setShowModal(true);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nombre_estudiante: modalData.nombre_estudiante,
        apellido_estudiante: modalData.apellido_estudiante,
        carnet: modalData.carnet,
        correo_estudiante: modalData.correo_estudiante,
        telefono_estudiante: modalData.telefono_estudiante,
        carrera_id: modalData.carrera_id,
        user_id: modalData.user_id,
      };
 
      if (modalData.id) {
        await updateEstudiante(modalData.id, data);
        Swal.fire(
          "Actualizado",
          "El estudiante ha sido actualizado.",
          "success"
        );
      } else {
        await createEstudiante(data);
        Swal.fire("Creado", "El estudiante ha sido creado.", "success");
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
        await deleteEstudiante(id);
        Swal.fire("Eliminado", "El estudiante ha sido eliminado.", "success");
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
 
  const handleSendEmail = async (id) => {
    const result = await Swal.fire({
      title: "¿Enviar correo?",
      text: "Se enviará un correo al estudiante con sus credenciales.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });
 
    if (result.isConfirmed) {
      try {
        await sendEstudianteEmail(id);
        Swal.fire(
          "Enviado",
          "El correo ha sido enviado correctamente.",
          "success"
        );
      } catch (error) {
        if (error.response?.status === 403) {
          Swal.fire(
            "Error",
            "No tienes permiso para enviar correos. Debes ser Super Admin.",
            "error"
          );
        } else if (error.response?.status === 401) {
          Swal.fire(
            "Error",
            "Sesión expirada. Por favor, inicia sesión nuevamente.",
            "error"
          );
        } else {
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "Hubo un problema al enviar el correo.",
            "error"
          );
        }
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
            <th>Carnet</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Carrera</th>
            <th>Usuario</th>
            <th>Editar</th>
            <th>Eliminar</th>
            <th>Enviar Correo</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.length > 0 ? (
            estudiantes.map((estudiante, index) => (
              <tr key={estudiante.id}>
                <td>{index + 1}</td>
                <td>{estudiante.nombre_estudiante}</td>
                <td>{estudiante.apellido_estudiante}</td>
                <td>{estudiante.carnet}</td>
                <td>{estudiante.correo_estudiante}</td>
                <td>{estudiante.telefono_estudiante}</td>
                <td>{estudiante.carrera?.nombre_carrera || "Sin carrera"}</td>
                <td>{estudiante.usuario?.name || "Sin usuario"}</td>
                <td>
                  <button
                    className="btn btn-info me-2"
                    onClick={() => openModal(estudiante)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(estudiante.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSendEmail(estudiante.id)}
                    disabled={!estudiante.correo_estudiante}
                    title={
                      estudiante.correo_estudiante
                        ? "Enviar correo"
                        : "Correo no disponible"
                    }
                  >
                    <FaEnvelope />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No hay estudiantes disponibles
              </td>
            </tr>
          )}
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
                    {modalData.id ? "Editar Estudiante" : "Crear Estudiante"}
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
                    <label htmlFor="nombre_estudiante" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_estudiante"
                      placeholder="Nombre del estudiante"
                      value={modalData.nombre_estudiante}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          nombre_estudiante: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="apellido_estudiante" className="form-label">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido_estudiante"
                      placeholder="Apellido del estudiante"
                      value={modalData.apellido_estudiante}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          apellido_estudiante: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carnet" className="form-label">
                      Carnet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="carnet"
                      placeholder="Carnet del estudiante"
                      value={modalData.carnet}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          carnet: e.target.value,
                        })
                      }
                      required
                    />
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
                        .filter((user) => user.roles.includes("User"))
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                    </select>
                    {users.filter((user) => user.roles.includes("User"))
                      .length === 0 && (
                      <div className="form-text text-danger">
                        No hay usuarios disponibles con rol User. Crea un
                        usuario primero.
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo_estudiante" className="form-label">
                      Correo
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo_estudiante"
                      placeholder="Correo electrónico"
                      value={modalData.correo_estudiante}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          correo_estudiante: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono_estudiante" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono_estudiante"
                      placeholder="Teléfono"
                      value={modalData.telefono_estudiante}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          telefono_estudiante: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="carrera_id" className="form-label">
                      Carrera
                    </label>
                    <select
                      className="form-select"
                      id="carrera_id"
                      value={modalData.carrera_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          carrera_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione una carrera</option>
                      {carreras.map((carrera) => (
                        <option key={carrera.id} value={carrera.id}>
                          {carrera.nombre_carrera}
                        </option>
                      ))}
                    </select>
                    {carreras.length === 0 && (
                      <div className="form-text text-danger">
                        No hay carreras disponibles. Crea una carrera primero.
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
 