import { httpClient } from "../utils";

// Obtener todas las coordinaciones
const getCoordinaciones = async () => await httpClient.get("/coordinaciones");

// Crear nueva
const createCoordinacion = async (data) => await httpClient.post("/coordinaciones", data);

// Actualizar
const updateCoordinacion = async (id, data) => await httpClient.put(`/coordinaciones/${id}`, data);

// Eliminar
const deleteCoordinacion = async (id) => await httpClient.delete(`/coordinaciones/${id}`);

export {
  getCoordinaciones,
  createCoordinacion,
  updateCoordinacion,
  deleteCoordinacion
};
