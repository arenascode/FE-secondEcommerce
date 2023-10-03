import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";

export type Category = string | null;
export type CartId = string

type CartContextType = {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  addToCart: (pid: string, qty: number) => void;
  cartId: string,
  cartIdStorage: string
};

const CartContext = createContext<CartContextType>({
  setCategory: () => {},
  category: null,
  addToCart: () => { },
  cartId: '',
  cartIdStorage: ''
});

export const useCart = () => {
  return useContext(CartContext);
};
type CartContextProviderProps = {
  children: ReactNode;
};
const CartContextProvider = ({ children }: CartContextProviderProps) => {
  //* To manage filter by Category
  const [category, setCategory] = useState<Category>("");
  const [cartId, setCartId] = useState<CartId>('')
  const [cartIdStorage, setCartIdStorage] = useLocalStorage('cid', cartId)

  //* To add to cart
  const addToCart = (pid: string | undefined, qty: number): void => {
    console.log(pid, qty);

    const cartData = {
      pid: pid,
      quantity: qty,
    };

    axios
      .post("http://127.0.0.1:8080/api/carts", cartData, {
        withCredentials: true,
        
      })
      .then(function (res) {
        console.log(res.data._id);
        setCartId(res.data._id)
        setCartIdStorage(res.data._id)
        
      })
      .catch((err) => console.log(err));
  };

  const contextValue: CartContextType = {
    category: category,
    setCategory: setCategory,
    addToCart: addToCart,
    cartId: cartId,
    cartIdStorage: cartIdStorage
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
