import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { getUsers, getRoles, createUser, updateUser } from "../../services/usuarios.service";

export function UsuarioComponent() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersResponse, rolesResponse] = await Promise.all([
        getUsers(),
        getRoles(),
      ]);
      setUsers(usersResponse.data.data);
      setRoles(rolesResponse.data.data);
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
    fetchUsers();
  }, []);

  const openModal = (
    user = { id: null, name: "", email: "", password: "", role: "" }
  ) => {
    // Asignar el primer rol si existe, o vacío
    setModalData({
      ...user,
      role: user.roles && user.roles.length > 0 ? user.roles[0] : "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: modalData.name,
        email: modalData.email,
        roles: modalData.role ? [modalData.role] : [], // Enviar como array de un elemento
        ...(modalData.password && { password: modalData.password }),
      };

      if (modalData.id) {
        await updateUser(modalData.id, data);
        Swal.fire("Actualizado", "El usuario ha sido actualizado.", "success");
      } else {
        await createUser(data);
        Swal.fire("Creado", "El usuario ha sido creado.", "success");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Hubo un problema al guardar.",
        "error"
      );
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
            <th>Email</th>
            <th>Rol</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles[0] || "Ninguno"}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => openModal(user)}
                >
                  <FaEdit />
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
                    {modalData.id ? "Editar Usuario" : "Crear Usuario"}
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
                    <label htmlFor="name" className="form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Nombre del usuario"
                      value={modalData.name}
                      onChange={(e) =>
                        setModalData({ ...modalData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Correo electrónico"
                      value={modalData.email}
                      onChange={(e) =>
                        setModalData({ ...modalData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña {modalData.id && "(opcional)"}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Contraseña"
                      value={modalData.password}
                      onChange={(e) =>
                        setModalData({ ...modalData, password: e.target.value })
                      }
                      required={!modalData.id}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rol
                    </label>
                    <select
                      className="form-select"
                      id="role"
                      value={modalData.role}
                      onChange={(e) =>
                        setModalData({ ...modalData, role: e.target.value })
                      }
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
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
