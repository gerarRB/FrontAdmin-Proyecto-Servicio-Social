import { httpClient } from "../utils";

// Obtener todos los usuarios
const getUsers = async () => await httpClient.get("/users");

// Obtener un usuario por ID
const getUserById = async (id) => await httpClient.get(`/users/${id}`);

// Obtener todos los roles
const getRoles = async () => await httpClient.get("/users/role");

// Crear un nuevo usuario
const createUser = async (data) => await httpClient.post("/users/create-user", data);

// Actualizar un usuario
const updateUser = async (id, data) => await httpClient.put(`/users/update-user/${id}`, data);

export {
  getUsers,
  getUserById,
  getRoles,
  createUser,
  updateUser
};