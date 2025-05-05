import { httpClient } from "../../utils";

const login = async (params) => await httpClient.post('auth/login',params)
const logoutApi = async () => await httpClient.post('users/logout')
export {
    login,
    logoutApi
}