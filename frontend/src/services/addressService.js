import axiosInstance from "../utils/axiosInstance";

export const getAddressesService = () => axiosInstance.get('/addresses/get');

export const getAddressService = (addressId) => axiosInstance.get(`/addresses/get/${addressId}`);

export const getAddressByUserService = (userId) => axiosInstance.get(`/addresses/user/${userId}`);

export const addAddressService = (addressData) => axiosInstance.post('/addresses/create', addressData);

export const editAddressService = (addressId, addressData) => axiosInstance.put(`/addresses/update/${addressId}`, addressData);