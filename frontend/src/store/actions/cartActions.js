import { getCartService } from "../../services/cartService";
import { GET_CART_COUNT } from "../types";

export const getCartCount = () => async dispatch => {
    try {
        const { data } = await getCartService();
        const count = (data.items || []).reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
        );

        dispatch({ type: GET_CART_COUNT, payload: count });
    } catch (err) {
        console.error('Error fetching cart count', err);
        dispatch({ type: GET_CART_COUNT, payload: 0 });
    }
};