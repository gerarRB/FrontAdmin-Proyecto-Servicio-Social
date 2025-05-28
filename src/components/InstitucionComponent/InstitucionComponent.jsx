import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getInstituciones,
  createInstitucion,
  updateInstitucion,
  deleteInstitucion,
  createDireccion,
  updateDireccion,
  getDepartamentos,
  getMunicipios,
  getDistritos,
} from "../../services/instituciones.service";

export function InstitucionComponent() {
  const [instituciones, setInstituciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    nombre_institucion: "",
    telefono_institucion: "",
    correo_institucion: "",
    tipo_institucion: "",
    direccion: {
      id: null,
      nombre_calle: "",
      numero_calle: "",
      distrito_id: "",
      municipio_id: "",
      departamento_id: "",
    },
  });
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        institucionesResponse,
        departamentosResponse,
        municipiosResponse,
        distritosResponse,
      ] = await Promise.all([
        getInstituciones(),
        getDepartamentos(),
        getMunicipios(),
        getDistritos(),
      ]);
      setInstituciones(institucionesResponse.data);
      setDepartamentos(departamentosResponse.data);
      setMunicipios(municipiosResponse.data);
      setDistritos(distritosResponse.data);
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

  const openModal = (
    institucion = {
      id: null,
      nombre_institucion: "",
      telefono_institucion: "",
      correo_institucion: "",
      tipo_institucion: "",
      direccion: {
        id: null,
        nombre_calle: "",
        numero_calle: "",
        distrito_id: "",
        municipio_id: "",
        departamento_id: "",
      },
    }
  ) => {
    // Preseleccionar municipio_id y departamento_id basados en el distrito
    if (institucion.direccion?.distrito_id) {
      const distrito = distritos.find(
        (d) => d.id === institucion.direccion.distrito_id
      );
      if (distrito) {
        const municipio = municipios.find(
          (m) => m.id === distrito.municipio_id
        );
        institucion.direccion.municipio_id = municipio?.id || "";
        institucion.direccion.departamento_id =
          municipio?.departamento_id || "";
      }
    }
    setModalData(institucion);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const direccionData = {
        nombre_calle: modalData.direccion.nombre_calle,
        numero_calle: modalData.direccion.numero_calle,
        distrito_id: modalData.direccion.distrito_id,
      };

      let direccionId = modalData.direccion.id;
      if (modalData.id && modalData.direccion.id) {
        // Actualizar dirección existente
        await updateDireccion(modalData.direccion.id, direccionData);
      } else {
        // Crear nueva dirección
        const direccionResponse = await createDireccion(direccionData);
        direccionId = direccionResponse.data.direccion.id;
      }

      const institucionData = {
        nombre_institucion: modalData.nombre_institucion,
        telefono_institucion: modalData.telefono_institucion,
        correo_institucion: modalData.correo_institucion,
        tipo_institucion: modalData.tipo_institucion,
        direccion_id: direccionId,
      };

      if (modalData.id) {
        await updateInstitucion(modalData.id, institucionData);
        Swal.fire(
          "Actualizado",
          "La institución ha sido actualizada.",
          "success"
        );
      } else {
        await createInstitucion(institucionData);
        Swal.fire("Creado", "La institución ha sido creada.", "success");
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
        await deleteInstitucion(id);
        Swal.fire("Eliminado", "La institución ha sido eliminada.", "success");
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

  // Filtrar municipios por departamento seleccionado
  const filteredMunicipios = modalData.direccion.departamento_id
    ? municipios.filter(
      (m) =>
        m.departamento_id === parseInt(modalData.direccion.departamento_id)
    )
    : [];

  // Filtrar distritos por municipio seleccionado
  const filteredDistritos = modalData.direccion.municipio_id
    ? distritos.filter(
      (d) => d.municipio_id === parseInt(modalData.direccion.municipio_id)
    )
    : [];

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
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Dirección</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {instituciones.map((institucion, index) => (
            <tr key={institucion.id}>
              <td>{index + 1}</td>
              <td>{institucion.nombre_institucion}</td>
              <td>{institucion.telefono_institucion}</td>
              <td>{institucion.correo_institucion}</td>
              <td>{institucion.tipo_institucion}</td>
              <td>
                {institucion.direccion
                  ? `${institucion.direccion.nombre_calle} ${institucion.direccion.numero_calle
                  }, ${institucion.direccion.distrito?.nombre_distrito || "N/A"
                  }, ${institucion.direccion.distrito?.municipio
                    ?.nombre_municipio || "N/A"
                  }, ${institucion.direccion.distrito?.municipio?.departamento
                    ?.nombre_departamento || "N/A"
                  }`
                  : "Sin dirección"}
              </td>
              <td>
                <button
                  className="btn btn-info me-2"
                  onClick={() => openModal(institucion)}
                >
                  <FaEdit />
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(institucion.id)}
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
            <div className="modal-dialog modal-lg">
              <form
                className="modal-content"
                onSubmit={handleSubmit}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {modalData.id ? "Editar Institución" : "Crear Institución"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Detalles de la Institución</h6>
                  <div className="mb-3">
                    <label htmlFor="nombre_institucion" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_institucion"
                      placeholder="Nombre de la institución"
                      value={modalData.nombre_institucion}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          nombre_institucion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="telefono_institucion"
                      className="form-label"
                    >
                      Teléfono
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono_institucion"
                      placeholder="Teléfono de la institución"
                      value={modalData.telefono_institucion}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          telefono_institucion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo_institucion" className="form-label">
                      Correo
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo_institucion"
                      placeholder="Correo electrónico"
                      value={modalData.correo_institucion}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          correo_institucion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipo_institucion" className="form-label">
                      Tipo de Institución
                    </label>
                    <select
                      className="form-select"
                      id="tipo_institucion"
                      value={modalData.tipo_institucion}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          tipo_institucion: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      <option value="Pública">Pública</option>
                      <option value="Privada">Privada</option>
                      <option value="ONG">ONG</option>
                    </select>
                  </div>

                  <h6>Dirección</h6>
                  <div className="mb-3">
                    <label htmlFor="departamento_id" className="form-label">
                      Departamento
                    </label>
                    <select
                      className="form-select"
                      id="departamento_id"
                      value={modalData.direccion.departamento_id}
                      onChange={(e) => {
                        setModalData({
                          ...modalData,
                          direccion: {
                            ...modalData.direccion,
                            departamento_id: e.target.value,
                            municipio_id: "",
                            distrito_id: "",
                          },
                        });
                      }}
                      required
                    >
                      <option value="">Seleccione un departamento</option>
                      {departamentos.map((departamento) => (
                        <option key={departamento.id} value={departamento.id}>
                          {departamento.nombre_departamento}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="municipio_id" className="form-label">
                      Municipio
                    </label>
                    <select
                      className="form-select"
                      id="municipio_id"
                      value={modalData.direccion.municipio_id}
                      onChange={(e) => {
                        setModalData({
                          ...modalData,
                          direccion: {
                            ...modalData.direccion,
                            municipio_id: e.target.value,
                            distrito_id: "",
                          },
                        });
                      }}
                      required
                      disabled={!modalData.direccion.departamento_id}
                    >
                      <option value="">Seleccione un municipio</option>
                      {filteredMunicipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre_municipio}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="distrito_id" className="form-label">
                      Distrito
                    </label>
                    <select
                      className="form-select"
                      id="distrito_id"
                      value={modalData.direccion.distrito_id}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          direccion: {
                            ...modalData.direccion,
                            distrito_id: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={!modalData.direccion.municipio_id}
                    >
                      <option value="">Seleccione un distrito</option>
                      {filteredDistritos.map((distrito) => (
                        <option key={distrito.id} value={distrito.id}>
                          {distrito.nombre_distrito}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="nombre_calle" className="form-label">
                      Nombre de la Calle
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_calle"
                      placeholder="Nombre de la calle"
                      value={modalData.direccion.nombre_calle}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          direccion: {
                            ...modalData.direccion,
                            nombre_calle: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="numero_calle" className="form-label">
                      Número de la Calle
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="numero_calle"
                      placeholder="Número de la calle"
                      value={modalData.direccion.numero_calle}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          direccion: {
                            ...modalData.direccion,
                            numero_calle: e.target.value,
                          },
                        })
                      }
                    //required
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