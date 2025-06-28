import axiosInstance from "../utils/api/axiosInstance";

export const getNotificationsService = () => axiosInstance.get('/notifications/get');

export const getArchivedNotificationsService = () => axiosInstance.get('/notifications/get/archived');

export const markNotificationReadService = (id) => axiosInstance.put(`/notifications/read/${id}`);

export const markNotificationUnreadService = (id) => axiosInstance.put(`/notifications/unread/${id}`);

export const markAllNotificationsReadService = (archived = false) => axiosInstance.put(`/notifications/read-all?archived=${archived}`);

export const markAllNotificationsUnreadService = (archived = false) => axiosInstance.put(`/notifications/unread-all?archived=${archived}`);

export const archiveNotificationService = (id) => axiosInstance.put(`/notifications/archive/${id}`);

export const unarchiveNotificationService = (id) => axiosInstance.put(`/notifications/unarchive/${id}`);

export const archiveAllNotificationsService = (archived = false) => axiosInstance.put(`/notifications/archive-all?archived=${archived}`);

export const unarchiveAllNotificationsService = (archived = false) => axiosInstance.put(`/notifications/unarchive-all?archived=${archived}`);