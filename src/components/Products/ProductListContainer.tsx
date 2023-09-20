import { useEffect, useRef, useState } from "react";
import PaginateProductsList from "./PaginateProductsList";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  code: string;
  stock: number;
  status: boolean;
  category: string;
  thumbnails: (string | undefined)[];
};
const ProductListContainer = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const CLIENT_URL = useRef(null);

  useEffect(function getProducts() {
    fetch("http://localhost:8080/api/products?page=1/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProducts(data.products.docs);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }, []);

  const renderProducts = products.map((p) => {
    return (
      <div key={p.id} className="card w-96 glass flex m-auto mt-10">
        <figure>
          <img
            src={`http://${CLIENT_URL.current}${p.thumbnails[0]}`}
            alt={p.title}
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{p.title}</h2>
          <p>Model: {p.description}</p>
          <p>Price: ${p.price} USD</p>
          <p>Stock: {p.stock}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-success text-lg">View Details!</button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="PagianteOptions mt-4">
        <PaginateProductsList setProducts={setProducts} />
      </div>
      <div className="mt-22 pb-6 flex flex-col gap-1">
        {renderProducts}
        <div className="PaginateOptions mt-4">
          <PaginateProductsList setProducts={setProducts} />
        </div>
      </div>
    </div>
  );
};
export default ProductListContainer;
