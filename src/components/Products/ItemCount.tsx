import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import { useSessions } from "../context/SessionsContext";
import Swal from "sweetalert2";
useLocation;

interface ItemCountProps {
  productId: string;
  productStock: number;
}

const ItemCount: React.FC<ItemCountProps> = ({ productId, productStock }) => {
  const [count, setCount] = useState(1);

  const { addToCart } = useCart();
  const { setPathToRedirect, pathToRedirect, isUserLogged } = useSessions();
  const location = useLocation();

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
  const productQuantity = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const action = event.currentTarget.textContent;

    if (action === "+") {
      if (count < productStock) {
        console.log(count);
        setCount(count + 1);
      } else {
        Toast.fire({
          icon: "warning",
          title: `no more stock available`,
        });
      }
    } else if (action === "-") {
      if (count > 1) {
        setCount(count - 1);
      }
    }
  };
  const addToCartHandler = () => {
    setPathToRedirect(location.pathname);

    if (isUserLogged) {
      addToCart(productId, count);
    } else {
      Toast.fire({
        title: "Please Login",
        icon: "error",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  return (
    <div className=" flex gap-2 justify-start items-center border-2 border-spacing-2 rounded-lg border-zinc-400 mt-2 p-2 pb-3">
      <div className="counterBtns flex gap-2 justify-start items-center border-2 border-spacing-2 rounded-full border-grey-800 mt-2 sm:text-2xl">
        <button
          onClick={productQuantity}
          className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl"
        >
          -
        </button>
        <div>{count}</div>
        <button
          onClick={productQuantity}
          className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl"
        >
          +
        </button>
      </div>
      <button
        onClick={addToCartHandler}
        className="btn btn-sm rounded-xl mt-2 active:bg-success active:text-whit active:border-success sm:text-lg"
      >
        Add To Cart
      </button>
    </div>
  );
};
export default ItemCount;
