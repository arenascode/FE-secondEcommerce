import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import Swal from "sweetalert2";

export type Category = string | null;
export type CartId = string;
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
  subTotalProducts: (cartList: ProductCart[]) => number;
  subTotal: number;
  deleteProductInCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setCartQty: React.Dispatch<React.SetStateAction<number>>;
  emptyCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  confirmPurchase: () => void;
  getCartById: (cid: string) => void;
  setSubTotal: React.Dispatch<React.SetStateAction<number>>;
  setCartIdStorage: React.Dispatch<React.SetStateAction<string>>;
  outOfStock: boolean
};

const CartContext = createContext<CartContextType>({
  setCategory: () => {},
  category: null,
  addToCart: () => {},
  cartId: "",
  cartIdStorage: "",
  cartQuantity: () => 0,
  setCartList: () => {},
  cartList: [],
  cartQty: 0,
  subTotalProducts: () => 0,
  subTotal: 0,
  deleteProductInCart: () => {},
  setCartQty: () => {},
  emptyCart: () => {},
  confirmPurchase: () => {},
  getCartById: () => {},
  setSubTotal: () => { },
  setCartIdStorage: () => { },
  outOfStock: false
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
  const [cartId, setCartId] = useState<CartId>("");
  const [cartQty, setCartQty] = useState<number>(0);
  const [cartList, setCartList] = useLocalStorage<ProductCart[]>(
    "productsInCart",
    []
  );
  const [subTotal, setSubTotal] = useLocalStorage("subtotal", 0);

  const [cartIdStorage, setCartIdStorage] = useLocalStorage("cid", cartId);

  const [outOfStock, setOutOfStock] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL

  //* To add to cart *//
  const addToCart = (pid: string | undefined, qty: number): void => {

    const cartData = {
      pid: pid,
      quantity: qty,
    };
    let actualStockProduct = 0;
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    if (cartIdStorage !== "") {
      
      axios
        .get(`${apiUrl}/api/carts/${cartIdStorage}`)
        .then((res) => {
          const productInCart = res.data.cartById.products.find(
            (p: ProductCart) => p._id._id === cartData.pid
          );

          if (productInCart) {
            actualStockProduct = productInCart._id.stock;
  
            if (actualStockProduct <= productInCart.quantity) {
              Toast.fire({
                icon: "warning",
                title: `The cart has all the stock available of this product`,
              });
              setOutOfStock(true);
              return;
            }
          }
          setOutOfStock(false);

          axios
            .post(`${apiUrl}/api/carts`, cartData, {
              withCredentials: true,
            })
            .then(function (res) {
              if (res.status === 200) {
                Toast.fire({
                  icon: "success",
                  title: `Añadiste ${cartData.quantity} ${
                    cartData.quantity > 1 ? "unidades" : "unidad"
                  } a tu carrito`,
                });
                
                setCartId(res.data._id);
                setCartIdStorage(res.data._id);
                setCartList(res.data.products);
                cartQuantity();
                subTotalProducts(res.data.products);
                const cart = res.data.products;
                setSubTotal(
                  cart.reduce(
                    (sub: number, p: ProductCart) =>
                      (sub += p.quantity * p._id.price),
                    0
                  )
                );
              }
            })
            .catch((err) => {
              
              if (err.response.status === 400) {
                Toast.fire({
                  icon: "error",
                  title: `${err.response.data.errorMsg}`,
                  showConfirmButton: true
                });
              }

              if (err.response.statusText === "Unauthorized") {
                Toast.fire({
                  icon: "error",
                  title: `Login To Add Products`,
                  showConfirmButton: true,
                });

                setTimeout(() => {
                  window.location.href = "/login";
                }, 2000);
              }
            });
        });
    } else {
      axios
        .post(`${apiUrl}/api/carts`, cartData, {
          withCredentials: true,
        })
        .then(function (res) {
          if (res.status === 200) {
            Toast.fire({
              icon: "success",
              title: `Añadiste ${cartData.quantity} ${
                cartData.quantity > 1 ? "unidades" : "unidad"
              } a tu carrito`,
            });

            setCartId(res.data._id);
            setCartIdStorage(res.data._id);
            setCartList(res.data.products);
            cartQuantity();
            subTotalProducts(res.data.products);
            const cart = res.data.products;
            setSubTotal(
              cart.reduce(
                (sub: number, p: ProductCart) =>
                  (sub += p.quantity * p._id.price),
                0
              )
            );
          } else {
            if (res.status == 401) {
              Toast.fire({
                icon: "error",
                title: `Login To Add Products`,
                showConfirmButton: true,
              });

              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);
            }
          }
        })
        .catch((err) => {
          
          if (err.response.status === 401) {
            Toast.fire({
              icon: "error",
              title: `${err.response.data.errorMsg}`,
              showConfirmButton: true,
            });
          }

          if (err.response.statusText == "Unauthorized") {
            Toast.fire({
              icon: "error",
              title: `Login To Add Products`,
              showConfirmButton: true,
            });

            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          }
        });
    }
  };

  //* calculate Cart Qty */
  const cartQuantity = () => {
    const cartQty = cartList.reduce((qty, p) => qty + p.quantity, 0);
    return cartQty;
  };

  //* subtotal Products */
  const subTotalProducts = (cartList: ProductCart[]): number => {

    const subTotalCart = cartList.reduce(
      (sub, p) => (sub += p._id.price * p.quantity),
      0
    );

    setSubTotal(subTotalCart);
    return subTotalCart;
  };

  //* Delete Product in cart
  const deleteProductInCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const pid = e.currentTarget.dataset.pid;
    axios
      .delete(
        `${apiUrl}/api/carts/${cartIdStorage}/products/${pid}`
      )
      .then((res) => {
        setCartList(res.data.products);
        subTotalProducts(res.data.products);
      });
  };

  //*Empty Cart */
  const emptyCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cid = e.currentTarget.dataset.cid;
    axios.delete(`${apiUrl}/api/carts/${cid}`).then((res) => {
      setCartList(res.data.products);
      setSubTotal(0);
    });
  };

  //* Confirm Purchase
  const confirmPurchase = async () => {
    await axios
      .get(`${apiUrl}/api/carts/${cartIdStorage}/purchase`)
      .then((res) => {
        if (res.status === 200)
        setCartList([]);
        setSubTotal(0);
      });
  };

  //* Get Cart By Id
  const getCartById = async (cid: string): Promise<
    ProductCart[] | { message: string }
  > => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/carts/${cid}`, {
          withCredentials: true
        }
      );

      if (
        response.data &&
        response.data.cartById &&
        response.data.cartById.products
      ) {
        
        const newProducts = response.data.cartById.products;

        const updatedCart = [...newProducts];

        return updatedCart;
      } else {
        return { message: "Invalid response format" };
      }
    } catch (error) {
      console.error("Error fetching cart:", error);

      return { message: (error as Error).message || "An error occurred" };
    }
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
    emptyCart: emptyCart,
    confirmPurchase: confirmPurchase,
    getCartById: getCartById,
    setSubTotal: setSubTotal,
    setCartIdStorage: setCartIdStorage,
    outOfStock: outOfStock
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
