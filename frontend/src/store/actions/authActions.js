import { editUserService, loadUserService, loginUserService, logoutUserService, registerUserService } from '../../services/authService';
import { AUTH_ERROR, AUTH_LOADING, LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS, SET_USER } from '../types';

export const selectIsAdmin = (state) => {
    return state.auth?.user?.role === 'admin';
};

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const loadUser = () => async dispatch => {
    dispatch({ type: AUTH_LOADING });

    try {
        const res = await loadUserService();

        dispatch({
            type: SET_USER,
            payload: res.data
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch({ type: AUTH_ERROR });
        }
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        const res = await registerUserService(userData);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });

        return { success: true, data: res.data };
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
            payload: error.response ? error.response.data : 'An error occurred',
        });

        const errorData = error.response?.data || { message: 'An error occurred' };
        return {
            success: false,
            errors: errorData.errors || [{ message: errorData.message || 'Login failed' }]
        };
    }
};

export const loginUser = (email, password) => async dispatch => {
    dispatch({ type: AUTH_LOADING });

    try {
        const res = await loginUserService(email, password);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data.user
        });

        dispatch(loadUser());
        return { success: true, data: res.data };
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
            payload: error.response ? error.response.data : 'An error occurred',
        });

        const errorData = error.response?.data || { message: 'An error occurred' };
        return {
            success: false,
            errors: errorData.errors || [{ message: errorData.message || 'Login failed' }]
        };
    }
};

export const logoutUser = () => async dispatch => {
    try {
        await logoutUserService();
    } catch (error) {
        console.error('Logout error:', error);
    }

    dispatch({ type: LOGOUT });
    window.location.reload();
};

export const updateUserProfile = (userData) => async (dispatch) => {
    dispatch({ type: AUTH_LOADING });

    try {
        const response = await editUserService(userData);

        dispatch({
            type: SET_USER,
            payload: response.data,
        });

        return { success: true };
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
            payload: error.response?.data?.message || 'Profile update failed',
        });
        return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    }
};