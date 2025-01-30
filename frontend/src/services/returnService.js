import axiosInstance from "../utils/axiosInstance";

export const getReturnRequestsService = () => axiosInstance.get('/returns/get');

export const getUserReturnRequestsService = (userId) => axiosInstance.get(`/returns/user/${userId}`);

export const getReturnDetailsService = (returnId) => axiosInstance.get(`/returns/${returnId}`);

export const addReturnRequestService = (data) => axiosInstance.post('/returns/create', data);

export const editReturnRequestStatusService = (requestId, updatedData) => axiosInstance.put('/returns/manage', { requestId, ...updatedData });
