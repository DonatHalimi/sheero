import axiosInstance from "../utils/axiosInstance";

export const getRolesService = () => axiosInstance.get('/roles/get');

export const addRoleService = (data) => axiosInstance.post('/roles/create', data);

export const editRoleService = (roleId, data) => axiosInstance.put(`/roles/update/${roleId}`, data);