import { httpClient } from "../utils";
 
const getEstudiantes = async () => await httpClient.get("/estudiantes");
const getEstudianteById = async (id) => await httpClient.get(`/estudiantes/${id}`);
const createEstudiante = async (data) => await httpClient.post("/estudiantes", data);
const updateEstudiante = async (id, data) => await httpClient.put(`/estudiantes/${id}`, data);
const deleteEstudiante = async (id) => await httpClient.delete(`/estudiantes/${id}`);
const getCarreras = async () => await httpClient.get("/carreras");
const getUsers = async () => await httpClient.get("/users");
const sendEstudianteEmail = async (id) => await httpClient.get(`/estudiantes/${id}/send-email`);
 
export {
  getEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getCarreras,
  getUsers,
  sendEstudianteEmail,
};