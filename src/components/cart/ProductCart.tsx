import { useCart } from "../context/CartContext";

type ProductCartProps = {
  product: {
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
  CLIENT_URL: string;
};

const ProductInCart: React.FC<ProductCartProps> = ({ product, CLIENT_URL }) => {
  const { deleteProductInCart } = useCart();

  return (
    <tr className="bg-white dark:bg-gray-800 items-center rounded-sm border border-s-2">
      <td className="pl-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex flex-col items-center gap-2 md:w-[200px] md:pl-0">
        <div className="rounded-md shadow-lg">
          <div className="imgContainer h-[120px] w-[120px] lg:w-[200px] lg:h-[200px] md:max-w-[200px] xl:h-[280px]">
            <img
              src={`http://${CLIENT_URL}${product._id.thumbnails}`}
              alt="productPhoto"
              className="w-max object-cover h-max rounded-md shadow-lg md:h-[150px] md:max-w-[180px]"
            />
          </div>
          <div className="descriptionProduct items-center flex flex-col lg:text-lg md:mt-12">
            <p>{product._id.title}</p>
            <p>{product._id.description}</p>
          </div>
        </div>
      </td>
      <td className="qty pl-12 py-4 text-lg md:pl-20 md:text-xl lg:text-2xl">
        {product.quantity}
      </td>
      <td className="price py-4 text-lg lg:text-xl">${product._id.price}</td>
      <td className="total py-4 text-lg lg:text-xl">
        {product.quantity * product._id.price}
      </td>
      <td className="deleteProduct pl-3 py-4">
        <button onClick={deleteProductInCart} data-pid={product._id._id}>
          <img
            src="../src/assets/icons/borrar.png"
            alt="deleteIcon"
            width={"24px"}
          />
        </button>
      </td>
    </tr>
  );
};
export default ProductInCart;
