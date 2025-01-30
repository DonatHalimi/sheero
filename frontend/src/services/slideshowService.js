import axiosInstance from "../utils/axiosInstance";

export const getSlideShowService = () => axiosInstance.get('/slideshow/get');

export const addSlideshowService = (data) => axiosInstance.post('/slideshow/create', data);

export const editSlideshowService = (slideshowId, data) => axiosInstance.put(`/slideshow/update/${slideshowId}`, data);