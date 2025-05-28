import { httpClient } from "../utils";
 
const getCarreras = async () => await httpClient.get("/carreras");
const getCarreraById = async (id) => await httpClient.get(`/carreras/${id}`);
const createCarrera = async (data) => await httpClient.post("/carreras", data);
const updateCarrera = async (id, data) => await httpClient.put(`/carreras/${id}`, data);
const deleteCarrera = async (id) => await httpClient.delete(`/carreras/${id}`);
const getCoordinaciones = async () => await httpClient.get("/coordinaciones");
 
export {
  getCarreras,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera,
  getCoordinaciones,
};