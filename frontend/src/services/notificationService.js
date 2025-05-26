import axiosInstance from "../utils/axiosInstance";

export const getNotificationsService = () => axiosInstance.get('/notifications/get');

export const getArchivedNotificationsService = () => axiosInstance.get('/notifications/get/archived');

export const markNotificationReadService = (id) => axiosInstance.put(`/notifications/read/${id}`);

export const markNotificationUnreadService = (id) => axiosInstance.put(`/notifications/unread/${id}`);

export const markAllNotificationsReadService = () => axiosInstance.put('/notifications/read-all');

export const markAllNotificationsUnreadService = () => axiosInstance.put('/notifications/unread-all');

export const archiveNotificationService = (id) => axiosInstance.put(`/notifications/archive/${id}`);

export const unarchiveNotificationService = (id) => axiosInstance.put(`/notifications/unarchive/${id}`);