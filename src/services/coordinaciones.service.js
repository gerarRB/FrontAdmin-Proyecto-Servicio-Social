
import { httpClient } from "../utils";

const getCoordinaciones = async (params) => await httpClient("coordinaciones", params, "get");

export { getCoordinaciones };