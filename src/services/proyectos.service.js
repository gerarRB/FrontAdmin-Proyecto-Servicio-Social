import { httpClient } from "../utils";
 
const getProyectos = async () => await httpClient.get("/proyectos");
const getProyectoById = async (id) => await httpClient.get(`/proyectos/${id}`);
const createProyecto = async (data) => await httpClient.post("/proyectos", data);
const updateProyecto = async (id, data) => await httpClient.put(`/proyectos/${id}`, data);
const deleteProyecto = async (id) => await httpClient.delete(`/proyectos/${id}`);
const getCoordinadores = async () => await httpClient.get("/coordinadores");
const getInstituciones = async () => await httpClient.get("/instituciones");
const getEstudiantesBySearch = async (query) => await httpClient.get(`/proyectos/estudiantes/search?q=${query}`);
 
export {
  getProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  getCoordinadores,
  getInstituciones,
  getEstudiantesBySearch,
};