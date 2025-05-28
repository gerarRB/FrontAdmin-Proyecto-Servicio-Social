import { httpClient } from "../utils";
 
const getDirecciones = async () => await httpClient.get("/direcciones");
const createDireccion = async (data) => await httpClient.post("/direcciones", data);
const updateDireccion = async (id, data) => await httpClient.put(`/direcciones/${id}`, data);
const deleteDireccion = async (id) => await httpClient.delete(`/direcciones/${id}`);
const getDepartamentos = async () => await httpClient.get("/departamentos");
const getMunicipios = async () => await httpClient.get("/municipios");
const getDistritos = async () => await httpClient.get("/distritos");
 
export {
  getDirecciones,
  createDireccion,
  updateDireccion,
  deleteDireccion,
  getDepartamentos,
  getMunicipios,
  getDistritos,
};
 