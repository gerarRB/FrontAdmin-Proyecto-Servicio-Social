import { httpClient } from "../utils";
 
const getInstituciones = async () => await httpClient.get("/instituciones");
const getInstitucionById = async (id) => await httpClient.get(`/instituciones/${id}`);
const createInstitucion = async (data) => await httpClient.post("/instituciones", data);
const updateInstitucion = async (id, data) => await httpClient.put(`/instituciones/${id}`, data);
const deleteInstitucion = async (id) => await httpClient.delete(`/instituciones/${id}`);
 
const getDirecciones = async () => await httpClient.get("/direcciones");
const createDireccion = async (data) => await httpClient.post("/direcciones", data);
const updateDireccion = async (id, data) => await httpClient.put(`/direcciones/${id}`, data);
const deleteDireccion = async (id) => await httpClient.delete(`/direcciones/${id}`);
 
const getDepartamentos = async () => await httpClient.get("/departamentos");
const getMunicipios = async () => await httpClient.get("/municipios");
const getDistritos = async () => await httpClient.get("/distritos");
 
export {
  getInstituciones,
  getInstitucionById,
  createInstitucion,
  updateInstitucion,
  deleteInstitucion,
  getDirecciones,
  createDireccion,
  updateDireccion,
  deleteDireccion,
  getDepartamentos,
  getMunicipios,
  getDistritos,
};