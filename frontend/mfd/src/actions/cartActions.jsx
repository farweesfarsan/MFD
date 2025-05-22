import axios from "axios";
import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";

export const addCartItem = (id, quantity) => async (dispatch) => {
    try {
        dispatch(addCartItemRequest()); 

        const { data } = await axios.get(`http://localhost:8000/mfd/products/${id}`);

        dispatch(addCartItemSuccess({
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.image,
            stock: data.product.stock,
            quantity
        }));
    } catch (error) {
        console.error("Failed to add cart item:", error);
    }
};
