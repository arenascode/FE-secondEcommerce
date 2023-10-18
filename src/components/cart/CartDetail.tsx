import axios from "axios";
import { useCart } from "../context/CartContext";
import { useEffect, useRef } from "react";
import ProductInCart from "./ProductCart";
import { Link } from "react-router-dom";
import { useSessions } from "../context/SessionsContext";

const CartDetail = () => {
  const {
    cartIdStorage,
    setCartList,
    cartList,
    cartQuantity,
    subTotalProducts,
    subTotal,
    emptyCart,
    confirmPurchase
  } = useCart();
  // console.log(cartIdStorage);
  console.log(cartList);
   const {  isUserLogged  } = useSessions()
  const CLIENT_URL = useRef<string>("");

  useEffect(() => {
    isUserLogged ? (axios
      .get(`http://127.0.0.1:8080/api/carts/${cartIdStorage}`)
      .then((res) => {
        console.log(res.data);
        setCartList(res.data.cartById.products);
        CLIENT_URL.current = res.data.CLIENT_URL;
      })) : (setCartList([]))
    
  }, [isUserLogged]);

  const EmptyCart = () => {
    return (
      <div className="bg-stone-800 h-screen glass hover:bg-stone-800 pt-28">
        <div className="card w-96 bg-base-100 shadow-xl lg:mt-28 lg:ml-96 m-auto">
          <figure className="px-10 pt-10">
            {/* <img
            src=""
            className="rounded-xl"
          /> */}
          </figure>
          <div className="card-body items-center text-center">
            <h1 className="card-title">Your Cart is Empty!</h1>
            <p className="text-lg">
              We invite you to get to know all of our Motorcycles!
            </p>
            <div className="card-actions">
              <Link to={"/products"}>
                <button className="btn btn-success btn-sm mt-3 text-lg tracking-widest">Go</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {cartList.length === 0  || cartIdStorage === undefined ? (
        <EmptyCart />
      ) : (
        <div className=" cardDetailsContainer pt-24 bg-color-white">
          <div className="tableContainer relative overflow-x-auto">
            <table className="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr className="tracking-wider text-lg text-zinc-800 font-extrabold">
                  <th scope="col" className="pl-10 py-3 rounded-tl-xl w-1/5">
                    Product name
                  </th>
                  <th scope="col" className="pl-7 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="pr-5 py-3">
                    Price
                  </th>
                  <th scope="col" className="py-3">
                    Total
                  </th>
                  <th scope="col" className="py-3 rounded-tr-xl">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((product) => (
                  <ProductInCart
                    product={product}
                    CLIENT_URL={CLIENT_URL.current}
                    key={product._id._id}
                  />
                ))}
                {/* ... (otras filas) */}
              </tbody>
              <tfoot className="bg-slate-400 text-lg">
                <tr className="font-semibold text-gray-900 dark:text-white bg-zinc-300 w-full rounded-b-lg">
                  <td className="pl-10 py-3 text-base rounded-bl-xl">
                    Total Of Products
                  </td>
                  <td className="pl-12 py-3">{cartQuantity()}</td>
                  <td colSpan={1}></td>
                  <td className="pl-1 py-3 ">${subTotalProducts()}</td>
                  <td colSpan={1} className="rounded-br-xl"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="purchaseDetails">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {/*  Subtotal */}
              <div className="flex justify-between items-center mb-2 text-lg">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">${subTotal}</span>
              </div>
              {/* Discount Code */}
              {/* <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Discount Code:</span>
            <span className="font-semibold text-green-500">
              - $500 (SAVE10)
            </span>
          </div> */}
              {/* //* Shipping */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>
              <hr className="my-2 border-t border-gray-300" />
              {/* //* Total */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-xl font-bold text-blue-500">
                  ${subTotal}
                </span>
              </div>
            </div>
          </div>
          <div className="ContainerBtns flex justify-between items-center p-3">
            <button
              data-cid={cartIdStorage}
              onClick={emptyCart}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-red"
            >
              Empty Cart
            </button>
            <button onClick={confirmPurchase} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-green">
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default CartDetail;
