import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9090";
    const USER_ID = "u1";

    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItems");
            if (!savedCart) return {};

            const parsedCart = JSON.parse(savedCart);

            // Ensure stored value is a plain object
            if (parsedCart && typeof parsedCart === "object" && !Array.isArray(parsedCart)) {
                return parsedCart;
            }
            return {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;

            const updatedCart = { ...prev, [itemId]: prev[itemId] - 1 };

            // Remove key when quantity is 0 to keep cart object clean
            if (updatedCart[itemId] <= 0) {
                delete updatedCart[itemId];
            }

            return updatedCart;
        });
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }  
        }
        return totalAmount;
    }

    const clearCart = () => {
        setCartItems({});
    }

    const contextValue = {
        BACKEND_URL,
        USER_ID,
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        clearCart
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;