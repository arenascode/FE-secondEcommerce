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
export type PageOptions = {
  nextPage: number | null;
  prevPage: number | null;
};
const ProductListContainer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageOptions, setPageOptions] = useState<PageOptions>();
  const CLIENT_URL = useRef(null);

  useEffect(function getProducts() {
    fetch("http://localhost:8080/api/products?page=1/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProducts(data.products.docs);
        const pageOptions: PageOptions = {
          prevPage: data.products.prevPage,
          nextPage: data.products.nextPage,
        };

        setPageOptions(pageOptions);
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
  //** Filter Products Component */
  const FilterProducts = () => {

    return (
      <>
        <select className="select flex justify-end w-max select-sm">
          <option disabled selected>
            Selecciona La Caterogia
          </option>
          <option>Superbike</option>
          <option>Naked</option>
          <option>Adventure</option>
        </select>
      </>
    );
  }
  // **Loading Products component
  const LoadingProducts = () => {
    return (
      <div className="h-screen flex justify-center pt-24 gap-2">
        <h1>Loading Products</h1>
        <div>
          <span className="loading loading-spinner loading-xs"></span>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  };

  return (
    <div>

      <div className="mt-18 pb-6 flex flex-col gap-1">
        <div className="filterProductsContainer flex justify-end pr-4 pt-4">
          {products.length !== 0 && <FilterProducts/>
        }
        </div>
        <div className="productsContainer">
        {products.length == 0 ? <LoadingProducts /> : renderProducts}
        </div>
        <div className="PaginateOptions mt-4">
          {pageOptions && (
            <PaginateProductsList
              PageOptions={pageOptions}
              setProducts={setProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductListContainer;
