import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";

export type Category = string | null;
export type CartId = string
export type ProductCart = {
  _id: {
    _id: string;
    title: string;
    description: string;
    price: number;
    code: string;
    stock: number;
    status: boolean;
    category: string;
    thumbnails: (string | undefined)[];
  };
  quantity: number;
};

type CartContextType = {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  addToCart: (pid: string, qty: number) => void;
  cartId: string;
  cartIdStorage: string;
  cartQuantity: () => number;
  setCartList: React.Dispatch<React.SetStateAction<ProductCart[]>>;
  cartList: ProductCart[]
  cartQty: number,
  subTotalProducts: () => number,
  subTotal: number
};

const CartContext = createContext<CartContextType>({
  setCategory: () => {},
  category: null,
  addToCart: () => { },
  cartId: '',
  cartIdStorage: '',
  cartQuantity: () => 0,
  setCartList: () => { }, 
  cartList: [],
  cartQty: 0,
  subTotalProducts: () => 0,
  subTotal: 0
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
  const [cartQty, setCartQty] = useState<number>(0);
  const [cartList, setCartList] = useState<ProductCart[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0)


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


  /* calculate Cart Qty */
  const cartQuantity = () => {
    const cartQty = cartList.reduce((qty, p) => qty + p.quantity, 0);
    setCartQty(cartQty);
    return cartQty
  };

  /* subtotal Products */
  const subTotalProducts = () => {
    const subtotalProd = cartList.reduce((sub, p) => sub + (p._id.price * p.quantity), 0)
    setSubTotal(subtotalProd)
    return subtotalProd
  }

  const contextValue: CartContextType = {
    category: category,
    setCategory: setCategory,
    addToCart: addToCart,
    cartId: cartId,
    cartIdStorage: cartIdStorage,
    cartQuantity: cartQuantity,
    setCartList: setCartList,
    cartList: cartList,
    cartQty: cartQty,
    subTotalProducts: subTotalProducts,
    subTotal: subTotal
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
