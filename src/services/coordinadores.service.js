import { httpClient } from "../utils";
 
// Obtener todos los coordinadores
const getCoordinadores = async () => await httpClient.get("/coordinadores");
 
// Obtener un coordinador por ID
const getCoordinadorById = async (id) => await httpClient.get(`/coordinadores/${id}`);
 
// Obtener todas las coordinaciones
const getCoordinaciones = async () => await httpClient.get("/coordinaciones");
 
// Obtener todos los usuarios
const getUsers = async () => await httpClient.get("/users");
 
// Crear un nuevo coordinador
const createCoordinador = async (data) => await httpClient.post("/coordinadores", data);
 
// Actualizar un coordinador
const updateCoordinador = async (id, data) => await httpClient.put(`/coordinadores/${id}`, data);
 
// Eliminar un coordinador
const deleteCoordinador = async (id) => await httpClient.delete(`/coordinadores/${id}`);
 
// Enviar correo al coordinador
const sendCoordinadorEmail = async (id) => await httpClient.get(`/coordinadores/${id}/send-email`);
 
export {
  getCoordinadores,
  getCoordinadorById,
  getCoordinaciones,
  getUsers,
  createCoordinador,
  updateCoordinador,
  deleteCoordinador,
  sendCoordinadorEmail,
};