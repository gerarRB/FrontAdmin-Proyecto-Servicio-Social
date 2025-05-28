import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import Select from "react-select";
import {
  getProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getCoordinadores,
  getInstituciones,
  getEstudiantesBySearch,
} from "../../services/proyectos.service";

export function ProyectoComponent() {
  const [proyectos, setProyectos] = useState([]);
  const [coordinadores, setCoordinadores] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_proyecto: "",
    descripcion: "",
    estado: "En proceso",
    coordinador_id: "",
    institucion_id: "",
    estudiante_id: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [showModal, setShowModal] = useState(false);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Crear la fecha asumiendo que es una fecha pura (sin hora)
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day); // Meses en JS son 0-based
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [proyectosResponse, coordinadoresResponse, institucionesResponse] =
        await Promise.all([
          getProyectos(),
          getCoordinadores(),
          getInstituciones(),
        ]);

      const proyectosData = Array.isArray(proyectosResponse.data)
        ? proyectosResponse.data
        : [];
      const coordinadoresData = Array.isArray(coordinadoresResponse.data.data)
        ? coordinadoresResponse.data.data
        : Array.isArray(coordinadoresResponse.data)
        ? coordinadoresResponse.data
        : [];
      const institucionesData = Array.isArray(institucionesResponse.data)
        ? institucionesResponse.data
        : [];
      setProyectos(proyectosData);
      setCoordinadores(coordinadoresData);
      setInstituciones(institucionesData);
    } catch (error) {
      console.error("Error en fetchData:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudieron obtener los datos",
        "error"
      );
      setProyectos([]);
      setCoordinadores([]);
      setInstituciones([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async (query) => {
    if (query.length < 2) {
      setEstudiantes([]);
      return;
    }
    try {
      const response = await getEstudiantesBySearch(query);
      const estudiantesData = Array.isArray(response.data) ? response.data : [];
      setEstudiantes(estudiantesData);
    } catch (error) {
      console.error("Error en fetchEstudiantes:", error);
      setEstudiantes([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEstudiantes(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const openModal = (
    proyecto = {
      id: null,
      nombre_proyecto: "",
      descripcion: "",
      estado: "En proceso",
      coordinador_id: "",
      institucion_id: "",
      estudiante_id: "",
      fecha_inicio: "",
      fecha_fin: "",
    }
  ) => {
    setModalData(proyecto);
    setSearchQuery(
      proyecto.estudiante
        ? `${proyecto.estudiante.nombre_estudiante} ${proyecto.estudiante.apellido_estudiante}`
        : ""
    );
    setEstudiantes(
      proyecto.estudiante
        ? [
            {
              id: proyecto.estudiante_id,
              nombre_estudiante: proyecto.estudiante.nombre_estudiante,
              apellido_estudiante: proyecto.estudiante.apellido_estudiante,
            },
          ]
        : []
    );
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de estudiante seleccionado
    if (!modalData.estudiante_id) {
      Swal.fire("Error", "Por favor selecciona un estudiante.", "error");
      return;
    }

    // Validación de fechas
    if (modalData.fecha_inicio && modalData.fecha_fin) {
      const fechaInicio = new Date(modalData.fecha_inicio);
      const fechaFin = new Date(modalData.fecha_fin);
      if (fechaFin < fechaInicio) {
        Swal.fire(
          "Error",
          "La fecha de fin debe ser igual o posterior a la fecha de inicio.",
          "error"
        );
        return;
      }
    }

    // Validación de estudiante único
    const estudianteAsignado = proyectos.find(
      (proyecto) =>
        String(proyecto.estudiante_id) === String(modalData.estudiante_id) &&
        proyecto.id !== modalData.id // Excluir el proyecto actual en modo edición
    );
    if (estudianteAsignado) {
      Swal.fire(
        "Error",
        `Este estudiante ya está asignado al proyecto "${estudianteAsignado.nombre_proyecto}".`,
        "error"
      );
      return;
    }

    try {
      const data = {
        nombre_proyecto: modalData.nombre_proyecto,
        descripcion: modalData.descripcion,
        estado: modalData.estado,
        coordinador_id: modalData.coordinador_id,
        institucion_id: modalData.institucion_id,
        estudiante_id: modalData.estudiante_id,
        fecha_inicio: modalData.fecha_inicio,
        fecha_fin: modalData.fecha_fin,
      };

      if (modalData.id) {
        await updateProyecto(modalData.id, data);
        Swal.fire("Actualizado", "El proyecto ha sido actualizado.", "success");
      } else {
        await createProyecto(data);
        Swal.fire("Creado", "El proyecto ha sido creado.", "success");
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          error.response?.data?.errors?.estudiante_id?.[0] ||
          "Hubo un problema al guardar.",
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
        await deleteProyecto(id);
        Swal.fire("Eliminado", "El proyecto ha sido eliminado.", "success");
        fetchData();
      } catch (error) {
        console.error("Error en handleDelete:", error);
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
            <th>Proyecto</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Estudiante</th>
            <th>Coordinador</th>
            <th>Institución</th>
            <th>Fecha/Inicio</th>
            <th>Fecha/Fin</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.length > 0 ? (
            proyectos.map((proyecto, index) => (
              <tr key={proyecto.id}>
                <td>{index + 1}</td>
                <td>{proyecto.nombre_proyecto}</td>
                <td style={{ maxWidth: "200px", whiteSpace: "normal" }}>
                  {proyecto.descripcion.length > 50
                    ? proyecto.descripcion.substring(0, 50) + "..."
                    : proyecto.descripcion}
                </td>
                <td>{proyecto.estado}</td>
                <td>
                  {proyecto.estudiante
                    ? `${proyecto.estudiante.nombre_estudiante} ${proyecto.estudiante.apellido_estudiante}`
                    : "N/A"}
                </td>
                <td>{proyecto.coordinador?.nombre_coordinador || "N/A"}</td>
                <td>{proyecto.institucion?.nombre_institucion || "N/A"}</td>
                <td>{formatDate(proyecto.fecha_inicio)}</td>
                <td>{formatDate(proyecto.fecha_fin)}</td>
                <td>
                  <button
                    className="btn btn-info me-2"
                    onClick={() => openModal(proyecto)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(proyecto.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No hay proyectos disponibles
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
                    {modalData.id ? "Editar Proyecto" : "Crear Proyecto"}
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
                    <label htmlFor="nombre_proyecto" className="form-label">
                      Nombre del Proyecto
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_proyecto"
                      placeholder="Nombre del proyecto"
                      value={modalData.nombre_proyecto}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          nombre_proyecto: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      placeholder="Descripción del proyecto"
                      value={modalData.descripcion}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          descripcion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="estado"
                      value={modalData.estado}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          estado: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="En proceso">En proceso</option>
                      <option value="Finalizado">Finalizado</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estudiante_id" className="form-label">
                      Estudiante
                    </label>
                    <Select
                      options={estudiantes.map((est) => ({
                        value: est.id,
                        label: `${est.nombre_estudiante} ${est.apellido_estudiante}`,
                      }))}
                      value={
                        modalData.estudiante_id
                          ? estudiantes
                              .filter(
                                (est) =>
                                  est.id.toString() === modalData.estudiante_id
                              )
                              .map((est) => ({
                                value: est.id,
                                label: `${est.nombre_estudiante} ${est.apellido_estudiante}`,
                              }))[0]
                          : null
                      }
                      onInputChange={(input) => setSearchQuery(input)}
                      onChange={(selected) => {
                        const newEstudianteId = selected
                          ? selected.value.toString()
                          : "";
                        setModalData({
                          ...modalData,
                          estudiante_id: newEstudianteId,
                        });
                        setSearchQuery(selected ? selected.label : "");
                        setEstudiantes(
                          selected
                            ? [
                                {
                                  id: selected.value,
                                  nombre_estudiante:
                                    selected.label.split(" ")[0],
                                  apellido_estudiante:
                                    selected.label
                                      .split(" ")
                                      .slice(1)
                                      .join(" ") || "",
                                },
                              ]
                            : []
                        );
                      }}
                      placeholder="Buscar estudiante..."
                      isClearable
                      isSearchable
                    />
                    {estudiantes.length === 0 &&
                      searchQuery.length >= 2 &&
                      !modalData.estudiante_id && (
                        <div className="form-text text-danger">
                          No se encontraron estudiantes.
                        </div>
                      )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="coordinador_id" className="form-label">
                      Coordinador
                    </label>
                    <select
                      className="form-select"
                      id="coordinador_id"
                      value={modalData.coordinador_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          coordinador_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione un coordinador</option>
                      {coordinadores.map((coordinador) => (
                        <option key={coordinador.id} value={coordinador.id}>
                          {coordinador.nombre_coordinador}{" "}
                          {coordinador.apellido_coordinador}
                        </option>
                      ))}
                    </select>
                    {coordinadores.length === 0 && (
                      <div className="form-text text-danger">
                        No hay coordinadores disponibles. Crea un coordinador en
                        la vista de Coordinadores.
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="institucion_id" className="form-label">
                      Institución
                    </label>
                    <select
                      className="form-select"
                      id="institucion_id"
                      value={modalData.institucion_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          institucion_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione una institución</option>
                      {instituciones.map((institucion) => (
                        <option key={institucion.id} value={institucion.id}>
                          {institucion.nombre_institucion}
                        </option>
                      ))}
                    </select>
                    {instituciones.length === 0 && (
                      <div className="form-text text-danger">
                        No hay instituciones disponibles. Crea una institución
                        en la vista de Instituciones.
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha_inicio" className="form-label">
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_inicio"
                      value={modalData.fecha_inicio}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          fecha_inicio: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fecha_fin" className="form-label">
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_fin"
                      value={modalData.fecha_fin}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          fecha_fin: e.target.value,
                        })
                      }
                      required
                    />
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
