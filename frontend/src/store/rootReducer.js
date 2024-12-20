import { combineReducers } from '@reduxjs/toolkit';
import addressReducer from './reducers/addressReducer';
import authReducer from './reducers/authReducer';
import categoryReducer from './reducers/categoryReducer';
import dashboardReducer from './reducers/dashboardReducer';
import orderReducer from './reducers/orderReducer';
import productReducer from './reducers/productReducer';
import returnReducer from './reducers/returnReducer';
import reviewReducer from './reducers/reviewReducer';
import slideshowReducer from './reducers/slideshowReducer';
import wishlistReducer from './reducers/wishlistReducer';
import { LOGOUT } from './types';

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = {
            auth: undefined,
            address: undefined,
            orders: undefined,
            returns: undefined,
            wishlist: undefined,
            reviews: undefined,
            dashboard: undefined,
        };
    }

    return combineReducers({
        auth: authReducer,
        address: addressReducer,
        orders: orderReducer,
        returns: returnReducer,
        wishlist: wishlistReducer,
        reviews: reviewReducer,
        products: productReducer,
        categories: categoryReducer,
        slideshow: slideshowReducer,
        dashboard: dashboardReducer,
    })(state, action);
};

export default rootReducer;