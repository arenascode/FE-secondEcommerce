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
  cartList: ProductCart[];
  cartQty: number;
  subTotalProducts: () => number;
  subTotal: number;
  deleteProductInCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setCartQty: React.Dispatch<React.SetStateAction<number>>;
  emptyCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
  subTotal: 0,
  deleteProductInCart: () => { },
  setCartQty: () => { },
  emptyCart: () => {}
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
  const [cartList, setCartList] = useLocalStorage<ProductCart[]>('productsInCart',[]);
  const [subTotal, setSubTotal] = useState<number>(0)


  const [cartIdStorage, setCartIdStorage] = useLocalStorage('cid', cartId)

  //* To add to cart *//
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
        console.log(res.data);
        setCartId(res.data._id)
        setCartIdStorage(res.data._id)
        setCartList(res.data.products)
      })
      .catch((err) => console.log(err));
      cartQuantity()
  };

  //* calculate Cart Qty */
  const cartQuantity = () => {
    const cartQty = cartList.reduce((qty, p) => qty + p.quantity, 0);
    // setCartQty(cartQty);
    return cartQty
  };

  //* subtotal Products */
  const subTotalProducts = () => {
    const subtotalProd = cartList.reduce((sub, p) => sub + (p._id.price * p.quantity), 0)
    setSubTotal(subtotalProd)
    return subtotalProd
  }

  //* Delete Product in cart 
  const deleteProductInCart = (e: React.MouseEvent<HTMLButtonElement>): void => {
    console.log(e.currentTarget.dataset.pid);
    const pid = e.currentTarget.dataset.pid
    axios.delete(`http://127.0.0.1:8080/api/carts/${cartIdStorage}/products/${pid}`)
      .then(res => {
        console.log(res.data);
        setCartList(res.data.products)
    })
  }
  
  //*Empty Cart */
  const emptyCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.cid);
    const cid = e.currentTarget.dataset.cid
    axios.delete(`http://127.0.0.1:8080/api/carts/${cid}`)
      .then(res => {
        console.log(res);
        setCartList(res.data.products)
        
    })
  };

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
    subTotal: subTotal,
    deleteProductInCart: deleteProductInCart,
    setCartQty: setCartQty,
    emptyCart: emptyCart
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
