import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { useCart } from "../context/CartContext";
import "../../scss/PaymentForm.scss";
import { StripeElements } from "@stripe/stripe-js";
import { Home, Payment, ShopOutlined, ShoppingCart, TwoWheelerOutlined } from "@mui/icons-material";

interface ChildComponentProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentForm: React.FC<ChildComponentProps> = ({
  setShowForm,
  setShowCart,
}) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: true,
    // timer: 2000,
    // timerProgressBar: true,
  });

  const { confirmPurchase, subTotal } = useCart();

  const stripe = useStripe();
  const elements = useElements();

  const runConfirmInOrder = async () => {
    await confirmPurchase();
    await setShowForm(false);
    await setShowCart(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //@ts-ignore
    const { error } = await stripe.confirmPayment({
      elements: elements as StripeElements,
      redirect: "if_required",
    });

    if (!error) {
      Toast.fire({
        icon: "success",
        title: `Thank you for your purchase. Please check your email`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
       runConfirmInOrder()
      
    } else {
      console.log(error);
      Toast.fire({
        title: "Error while processing the payment",
        text: `${error.message}`,
        icon: "error",
      });
    }
  };

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }


  return (
    <div className="pt-20 checkoutFormContainer p-2 min-h-screen lg:px-44">
      <div role="presentation" onClick={handleClick} className="pl-2 sm:backdrop-blur-lg md:w-max p-2">
        <Breadcrumbs aria-label="breadcrumb" style={{ color: "white" }}>
          <Link to="/" className="hover:underline flex gap-1">
            <Home fontSize="small" /> Home
          </Link>
          <Link className="hover:underline flex gap-1" to={"/products"}>
            <TwoWheelerOutlined sx={{ mr: 0.5 }} fontSize="medium" />
            Motorbikes
          </Link>
          <Link
            className="hover:underline flex gap-1"
            to={""}
            onClick={() => {
              setShowCart(true);
              setShowForm(false);
            }}
          >
            <ShoppingCart sx={{ mr: 0.5 }} fontSize="small" />
            Cart
          </Link>
          <Link to={""} className="hover:underline flex gap-1">
            <Payment sx={{ mr: 0.5 }} fontSize="small" />
            Checkout
          </Link>
        </Breadcrumbs>
      </div>
      <div className="purchaseDetails rounded-lg mt-2">
        <div className=" dark:bg-gray-800 p-3 shadow-md">
          <h2 className="text-xl text-gray-100 font-semibold mb-4 tracking-wide">Order Summary</h2>
          {/*  Subtotal */}
          <div className="flex justify-between items-center mb-2 text-lg">
            <span className="text-gray-100 lg:text-xl">Subtotal:</span>
            <span className="font-semibold text-gray-900 lg:text-2xl">
              ${subTotal}
            </span>
          </div>
          {/* //* Shipping */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-100 lg:text-xl">Shipping:</span>
            <span className="font-semibold text-black lg:text-xl">Free</span>
          </div>
          {/* <hr className="my-2 border-t border-gray-300" /> */}
          {/* //* Total */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xl font-bold lg:text-xl text-[#1cdfa1]">Total:</span>
            <span className="text-xl font-bold text-[#1cdfa1] lg:text-2xl">
              ${subTotal}
            </span>
          </div>
        </div>
      </div>
      <hr className="my-2 border-t border-gray-300" />
      <form action="" className="form-control card p-4" onSubmit={handleSubmit}>
        <PaymentElement />
        <button className="btn btn-sm w-max btn-success m-4 self-center text-white hover:text-black">
          Buy
        </button>
      </form>
    </div>
  );
};
export default PaymentForm;
