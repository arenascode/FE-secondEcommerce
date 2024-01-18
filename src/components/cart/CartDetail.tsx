import axios from "axios";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import ProductInCart from "./ProductCart";
import { Link } from "react-router-dom";
import { useSessions } from "../context/SessionsContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CartDetail = () => {
  const {
    cartIdStorage,
    setCartList,
    cartList,
    cartQuantity,
    subTotalProducts,
    subTotal,
    emptyCart,
  } = useCart();
  // console.log(cartIdStorage);
  console.log(cartList);
  const { isUserLogged } = useSessions()
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showCart, setShowCart] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const CLIENT_URL = useRef<string>("");

  useEffect(() => {
    isUserLogged ? (axios
      .get(`http://127.0.0.1:8080/api/carts/${cartIdStorage}`)
      .then((res) => {
        console.log(res.data);
        setCartList(res.data.cartById.products);
        setShowForm(false)
        CLIENT_URL.current = res.data.CLIENT_URL;
      })) : (setCartList([]))
    
  }, [isUserLogged]);

    const handlePaymentIntent = async () => {
      await axios.post(`http://127.0.0.1:8080/api/payments/payment-intents`, { subTotal }, {
        withCredentials: true
      }).then(res => {
        console.log(res)
        if (res.status == 201) {
           setClientSecret(res.data.payload.client_secret);
          setShowCart(false)
          setShowForm(true)
        }
      }).catch(err => console.log(err)
      )
    }

  
  const EmptyCart = () => {
    return (
      <div className="bg-stone-800 h-screen glass hover:bg-stone-800 pt-28 p-6 align-middle justify-center">
        <div className="card sm:w-max sm:ml-[10rem] bg-base-100 shadow-xl lg:mt-28 md:ml-[16rem] lg:ml-[24rem] xl:mr-64">
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
      {showCart &&
        (cartList.length === 0 || cartIdStorage === undefined ? (
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
                    <th scope="col" className="pl-7 py-3 md:pl-12 lg:pl-10">
                      Quantity
                    </th>
                    <th scope="col" className="pr-5 py-3 lg:pl-0 lg:pr-10">
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
                    <td className="pl-10 py-3 text-base rounded-bl-xl lg:text-xl">
                      Total Of Products
                    </td>
                    <td className="pl-12 py-3 lg:text-xl md:pl-20">
                      {cartQuantity()}
                    </td>
                    <td colSpan={1}></td>
                    <td className="pl-1 py-3 lg:text-xl">
                      ${subTotalProducts(cartList)}
                    </td>
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
                  <span className="text-gray-600 lg:text-xl">Subtotal:</span>
                  <span className="font-semibold text-gray-900 lg:text-2xl">
                    ${subTotal}
                  </span>
                </div>
                {/* //* Shipping */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 lg:text-xl">Shipping:</span>
                  <span className="font-semibold text-green-500 lg:text-xl">
                    Free
                  </span>
                </div>
                <hr className="my-2 border-t border-gray-300" />
                {/* //* Total */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold lg:text-xl">Total:</span>
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
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-red lg:text-xl lg:ml-4"
              >
                Empty Cart
              </button>
              <button
                onClick={handlePaymentIntent}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-green lg:text-xl lg:mr-4 lg:my-5"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        ))}
      {showForm && (
        <Elements stripe={stripePromise} options={{clientSecret: clientSecret ? clientSecret : ''}}>
          <PaymentForm setShowForm={setShowForm} setShowCart={setShowCart} />
        </Elements>
      )}
    </>
  );
};
export default CartDetail;
