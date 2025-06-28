import axiosInstance from "../utils/api/axiosInstance";

export const getReturnRequestsService = () => axiosInstance.get('/returns/get');

export const ITEMS_PER_PAGE = 8;

export const getUserReturnRequestsService = (userId, page = 1, limit = ITEMS_PER_PAGE, searchTerm = '', statusFilter = 'all') => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    if (searchTerm && searchTerm.trim()) params.append('search', searchTerm.trim());
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

    return axiosInstance.get(`/returns/user/${userId}?${params.toString()}`);
};

export const getReturnDetailsService = (returnId) => axiosInstance.get(`/returns/${returnId}`);

export const addReturnRequestService = (data) => axiosInstance.post('/returns/create', data);

export const editReturnRequestStatusService = (requestId, updatedData) => axiosInstance.put('/returns/manage', { requestId, ...updatedData });
