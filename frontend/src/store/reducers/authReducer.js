import { AUTH_ERROR, AUTH_LOADING, LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS, SET_USER } from '../types';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true
      };

    case SET_USER:
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case LOGOUT:
    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload || null
      };
    default:
      return state;
  }
}