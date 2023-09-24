import { useEffect, useRef, useState } from "react";
import PaginateProductsList from "./PaginateProductsList";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

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
  hasNextPage: boolean;
  hasPrevPage: boolean
};
const ProductListContainer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageOptions, setPageOptions] = useState<PageOptions>();
  const CLIENT_URL = useRef(null);

  useEffect(function getProducts() {
    fetch("http://localhost:8080/api/products/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProducts(data.products.docs);
        const pageOptions: PageOptions = {
          prevPage: data.products.prevPage,
          nextPage: data.products.nextPage,
          hasNextPage: data.products.hasNextPage,
          hasPrevPage: data.products.hasPrevPage
        };
        console.log(pageOptions);
        
        setPageOptions(pageOptions);
    
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }, []);

  //** Filter Products Component */
  const FilterProducts = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const miRef = useRef<HTMLDivElement | null>(null);

    //**Cerrar menú desplegable */
    useEffect(() => {
      // Función para manejar el clic fuera del componente
      const handleClickExterno = (e: MouseEvent) => {
        if (miRef.current && !miRef.current.contains(e.target as Node)) {
          // El clic se realizó fuera del componente, puedes realizar alguna acción aquí
          setIsOpen(false)
          console.log("Clic fuera del componente");
          // Aquí puedes ocultar el componente, actualizar el estado, etc.
        }
      };

      // Agregar un controlador de eventos al elemento document.body
      document.body.addEventListener("click", handleClickExterno);

      // Limpieza: eliminar el controlador de eventos cuando el componente se desmonte
      return () => {
        document.body.removeEventListener("click", handleClickExterno);
      };
    }, []);
    
    const filterProducts = (event: React.MouseEvent<HTMLLIElement>): void => {
      console.log(event.currentTarget.textContent);
      let category: string | null = event.currentTarget.textContent

      if (category === 'Todas') {
        category = ''
      }
      
      fetch(`http://localhost:8080/api/products?category=${category}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setProducts(data.products.docs);
          const pageOptions: PageOptions = {
            prevPage: data.products.prevPage,
            nextPage: data.products.nextPage,
            hasNextPage: data.products.hasNextPage,
            hasPrevPage: data.products.hasPrevPage,
          };
          
          setPageOptions(pageOptions);
          CLIENT_URL.current = data.CLIENT_URL;
        })
        .catch((err) => console.log(err));
    };

    return (
      <div
        ref={miRef}
        className="relative flex flex-col items-center roundend-lg width-max"
      >
        <button
          onClick={() => setIsOpen((prev: boolean) => !prev)}
          className="bg-blue-400 p-2 w-full flex items-center justify-between font-bold text-sm rounded-lg tracking-wider border-2 border-transparent text-black active:border-white duration-300 active:text-white"
        >
          Selecciona la categoría
          {!isOpen ? (
            <AiOutlineCaretDown className="h-8" />
          ) : (
            <AiOutlineCaretUp className="h-8" />
          )}
        </button>
        {isOpen && (
          <div className="bg-blue-400 absolute top-14 flex flex-col items-start rounded-lg p-2 w-full z-10 text-black text-sm">
            <ul className="flex flex-col w-full justify-between p-2 ">
              <li
                onClick={filterProducts}
                className="hover:bg-blue-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4 p-2 tracking-widest"
              >
                Todas
              </li>
              <li
                onClick={filterProducts}
                className="hover:bg-blue-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4 p-2 tracking-widest"
              >
                Superbike
              </li>
              <li
                onClick={filterProducts}
                className="hover:bg-blue-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4 p-2 tracking-widest"
              >
                Naked
              </li>
              <li
                onClick={filterProducts}
                className="hover:bg-blue-300 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4 p-2 tracking-widest"
              >
                Adventure
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  // ** Loading Products component */
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
  //** Render Products */
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
      <div className="mt-7 pb-6 flex flex-col gap-1">
        <div className="filterProductsContainer flex justify-end pr-4 pt-4 mb-8">
          {products.length !== 0 && <FilterProducts />}
        </div>
        <div className="productsContainer">
          {products.length == 0 ? <LoadingProducts /> : renderProducts}
        </div>
        <div className="PaginateOptions mt-4">
          {(pageOptions?.hasPrevPage || pageOptions?.hasNextPage) && (
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
