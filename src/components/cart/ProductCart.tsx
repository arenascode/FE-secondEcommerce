
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

const ProductInCart: React.FC<ProductCartProps> = ({product, CLIENT_URL}) => {


  return (
    <tr className="bg-white dark:bg-gray-800 items-center rounded-sm border border-s-2">
      <td className="pl-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex flex-col items-center gap-2 w-max">
        <div className="rounded-md shadow-lg">
          <div className="imgContainer h-[120px] w-[120px] items-center">
            <img
              src={`http://${CLIENT_URL}${product._id.thumbnails[0]}`}
              alt="productPhoto"
              className="w-max object-cover h-max rounded-md shadow-lg"
            />
          </div>
          <div className="descriptionProduct items-center flex flex-col">
            <p>{product._id.title}</p>
            <p>{product._id.description}</p>
          </div>
        </div>
      </td>
      <td className="qty pl-10 py-4">{product.quantity}</td>
      <td className="price py-4">${product._id.price}</td>
      <td className="total py-4">{product.quantity * product._id.price}</td>
      <td className="deleteProduct pl-2 py-4"><img src="../src/assets/icons/borrar.png" alt="deleteIcon" width={'24px'} /></td>
    </tr>
  );
}
export default ProductInCart