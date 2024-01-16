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
  setCartIdStorage: React.Dispatch<React.SetStateAction<string>>
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
  setCartIdStorage: () => {}
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
  console.log(outOfStock);

  //* To add to cart *//
  const addToCart = (pid: string | undefined, qty: number): void => {
    console.log(pid, qty);

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
    console.log(typeof cartIdStorage);
    if (cartIdStorage !== "") {
      
      axios
        .get(`http://127.0.0.1:8080/api/carts/${cartIdStorage}`)
        .then((res) => {
          console.log(res);
          const productInCart = res.data.cartById.products.find(
            (p: ProductCart) => p._id._id === cartData.pid
          );
          console.log(productInCart);

          if (productInCart) {
            actualStockProduct = productInCart._id.stock;
            console.log(actualStockProduct);
            if (actualStockProduct <= productInCart.quantity) {
              Toast.fire({
                icon: "warning",
                title: `The cart has all the stock available of this product`,
              });
              setOutOfStock(true);
              console.log(outOfStock);
              return;
            }
          }
          setOutOfStock(false);

          axios
            .post("http://127.0.0.1:8080/api/carts", cartData, {
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
                console.log(res.data);
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
              console.log(err);
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
      console.error('Failed, does not exist CID in storage');
      axios
        .post("http://127.0.0.1:8080/api/carts", cartData, {
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
            console.log(res.data);
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
          console.log(err);
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
    // setCartQty(cartQty);
    return cartQty;
  };

  //* subtotal Products */
  const subTotalProducts = (cartList: ProductCart[]): number => {
    console.log(cartList);

    const subTotalCart = cartList.reduce(
      (sub, p) => (sub += p._id.price * p.quantity),
      0
    );
    console.log(subTotalCart);

    setSubTotal(subTotalCart);
    return subTotalCart;
  };

  //* Delete Product in cart
  const deleteProductInCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    console.log(e.currentTarget.dataset.pid);
    const pid = e.currentTarget.dataset.pid;
    axios
      .delete(
        `http://127.0.0.1:8080/api/carts/${cartIdStorage}/products/${pid}`
      )
      .then((res) => {
        console.log(res.data);
        setCartList(res.data.products);
        subTotalProducts(res.data.products);
      });
  };

  //*Empty Cart */
  const emptyCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.cid);
    const cid = e.currentTarget.dataset.cid;
    axios.delete(`http://127.0.0.1:8080/api/carts/${cid}`).then((res) => {
      console.log(res);
      setCartList(res.data.products);
      setSubTotal(0);
    });
  };

  //* Confirm Purchase
  const confirmPurchase = () => {
    axios
      .get(`http://127.0.0.1:8080/api/carts/${cartIdStorage}/purchase`)
      .then((res) => {
        console.log(res);
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
        if (res.status === 200)
          Toast.fire({
            icon: "success",
            title: `Thank you for your purchase. Please check your email`,
          });
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
        `http://127.0.0.1:8080/api/carts/${cid}`, {
          withCredentials: true
        }
      );
      console.log(response);

      if (
        response.data &&
        response.data.cartById &&
        response.data.cartById.products
      ) {
        // Assuming the response has a 'products' property
        const newProducts = response.data.cartById.products;
        console.log(newProducts);

        // Merge the existing cart with the new products
        const updatedCart = [...newProducts];

        // You might want to update the state or do something else with the updatedCart here
        return updatedCart;
      } else {
        return { message: "Invalid response format" };
      }
    } catch (error) {
      console.error("Error fetching cart:", error);

      // Return an error object
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
    setCartIdStorage: setCartIdStorage
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
