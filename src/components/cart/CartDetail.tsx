import axios from "axios";
import { useCart } from "../context/cartContext";
import { useEffect, useRef, useState } from "react";
import ProductInCart from "./ProductCart";

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


const CartDetail = () => {
  const { cartIdStorage } = useCart();
  const [cartList, setCartList] = useState<ProductCart[]>([]);

  console.log(cartIdStorage);

  const CLIENT_URL = useRef<string>('')

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/api/carts/${cartIdStorage}`)
      .then((res) => {
        console.log(res.data);
        setCartList(res.data.cartById.products);
        CLIENT_URL.current = res.data.CLIENT_URL
      });
  }, [cartIdStorage]);

  return (
    <div className=" cardDetailsContainer pt-24 bg-color-white">
      <div className="relative overflow-x-auto">
        <table className="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr className="tracking-widest text-md text-zinc-800 font-extrabold">
              <th scope="col" className="pl-10 py-3 rounded-tl-xl w-1/5">
                Product name
              </th>
              <th scope="col" className="pl-7 py-3">
                Cantidad
              </th>
              <th scope="col" className="pr-7 py-3">
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
            {/* <tr className="bg-white dark:bg-gray-800">
              <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex flex-col items-center gap-2 w-max">
                <img src="../src/assets/user.png" alt="" />
                <p>Apple MacBook Pro 17"</p>
              </td>
              <td className="qty pl-4 py-4">1</td>
              <td className="price py-4">$2999</td>
              <td className="total py-4">$2999</td>
              <td className="deleteProduct py-4">X</td>
            </tr> */}
            {cartList.map((product) => (
              <ProductInCart
                product={product}
                CLIENT_URL={CLIENT_URL.current}
                key={product._id._id}
              />
            ))}
            {/* ... (otras filas) */}
          </tbody>
          <tfoot className="bg-slate-400">
            <tr className="font-semibold text-gray-900 dark:text-white bg-zinc-300 w-full rounded-b-lg">
              <td className="pl-12 py-3 text-base rounded-bl-xl">Total</td>
              <td className="pl-10 py-3">3</td>
              <td colSpan={1}></td>
              <td className="py-3 ">21,000</td>
              <td colSpan={1} className="rounded-br-xl"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
export default CartDetail;
