import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Product } from "./ProductListContainer";
import ItemCount from "./itemCount";

const ProductDetail = () => {
  const { id } = useParams();
  console.log(id);
  const CLIENT_URL = useRef(null);
  const [product, setProduct] = useState<Product>();
  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProduct(data.productById);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }, [id]);

  //** ProductCard Component */
  const ProductCard = ({
    productData,
  }: {
    productData: Product | undefined;
  }) => {
    console.log(productData?.thumbnails[0]);

    return (
      <div className="card w-97 bg-stone-600 shadow-xl flow-root text-stone-200">
        <figure className="px-3 pt-1 mt-3 overflow-hidden rounded-t-lg">
          <img
            src={`http://${CLIENT_URL.current}${product?.thumbnails[0]}`}
            alt="Shoes"
            className="rounded-xl h-full w-full"
          />
        </figure>
        <div className="text-sm breadcrumbs ml-5 mt-2 tracking-wider">
          <ul>
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/products'}>Motos</Link>
            </li>
            <li>
              <a>{productData?.category}</a>
            </li>
            <li>
              <a>{productData?.title}</a>
            </li>
          </ul>
        </div>
        <div className="card-body items-center text-center">
          <div className="productTitle flex justify-center">
            <h2 className="card-title tracking-wider">
              {productData?.title} {productData?.description}
            </h2>
          </div>
          <div className="productDetailsTitle w-full flex justify-start pt-2">
            <h3 className="text-lg">Caracteristicas Destacadas</h3>
          </div>
          <div className="productDetailsBody w-full flex justify-start tracking-wider">
            <ul className="flex flex-col gap-2">
              <li className="flex font-bold gap-1">
                Tipo de Moto:{" "}
                <span className="font-extralight">
                  {" "}
                  {productData?.category}
                </span>
              </li>
              <li className="flex font-bold gap-1">
                Stock:{" "}
                <span className="font-extralight"> {productData?.stock}</span>
              </li>
              <li className="flex font-bold gap-1">
                Precio:{" "}
                <span className="font-extralight"> ${productData?.price}</span>
              </li>
            </ul>
          </div>
          <p className="tracking-wider ">Animate a la aventura con la {productData?.title}   {productData?.description}</p>
          <div className="card-actions flex justify-between w-full items-center">
            <div className="itemCountCountainer flex items-center gap-2">
              <ItemCount />
              <button className="btn btn-sm rounded-xl mt-2 active:bg-success active:text-whit active:border-success">Add To Cart</button>
            </div>
            <button className="btn btn-sm btn-success rounded-full tracking-wider mt-1">Buy Now</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-20 flex justify-center px-2">
      <ProductCard productData={product} />
    </div>
  );
};
export default ProductDetail;
