import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";
import "../../scss/PaymentForm.scss";
import { StripeElements } from "@stripe/stripe-js";

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

  return (
    <div className="pt-20 checkoutFormContainer p-2">
      <div className="purchaseDetails rounded-lg ">
        <div className=" dark:bg-gray-800 p-3 shadow-md">
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
            <span className="font-semibold text-black lg:text-xl">Free</span>
          </div>
          {/* <hr className="my-2 border-t border-gray-300" /> */}
          {/* //* Total */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xl font-bold lg:text-xl">Total:</span>
            <span className="text-xl font-bold text-[#1cdfa1]">
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
