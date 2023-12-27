import { useState, useEffect, useRef } from "react";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useSessions } from "../context/SessionsContext";
import axios from "axios";
import { PageOptions, Product, SortProducts } from "../Products/ProductListContainer";
import { Link } from "react-router-dom";
import PaginateProductsList from "../Products/PaginateProductsList";
import AddProductForm from "../Products/AddProduct";

const ManageStore = () => {
  interface Client {
    id: string;
    name: string;
    email: string;
    orders: Order[];
  }

  interface Order {
    id: string;
    date: Date;
    products: Product[];
    totalPrice: number;
    status: string; // e.g., "placed", "shipped", "completed"
  }

  const { setProfileData, profileData } = useSessions();
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [formToAddProduct, setFormToAddProduct] = useState<boolean>(false)

  const [pageOptions, setPageOptions] = useState<PageOptions>();
  // const [category, setCategory] = useState<Category>();
  const [sortProducts, setSortProducts] = useState<SortProducts>("1");
  const [pageNumber, setPageNumber] = useState("1");
  const CLIENT_URL = useRef(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/sessions/current", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setProfileData(res.data.currentUserDTO);
      });
  }, []);

  // State variables
  // const [products, setProducts] = useState<Product[]>([]);
  // const [clients, setClients] = useState<Client[]>([]);
  // const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
  //   undefined
  // );

  // Functions for CRUD operations
  const fetchProducts = async () => {
    // Implement logic to fetch products from API/database
    await axios.get("http://127.0.0.1:8080/api/products").then((res) => {
      console.log(res.data.products);
      setProducts(res.data.products.docs);
      CLIENT_URL.current = res.data.CLIENT_URL;
      setShowProducts(true);
      const pageOptions: PageOptions = {
        prevPage: res.data.products.prevPage,
        nextPage: res.data.products.nextPage,
        hasNextPage: res.data.products.hasNextPage,
        hasPrevPage: res.data.products.hasPrevPage,
      };
      setPageOptions(pageOptions)
      setFormToAddProduct(false)
    });
  };

  const handleFormAddProduct = () => {
    setFormToAddProduct(true)
    setShowProducts(false)
  }
  // const addProduct = async (product: Product) => {
  //   // Implement logic to send create request to API/database
  //   const response = await fetch("/api/products", {
  //     method: "POST",
  //     body: JSON.stringify(product),
  //   });
  //   if (response.ok) {
  //     // Update state with new product
  //     setProducts([...products, product]);
  //   } else {
  //     // Handle error
  //   }
  // };

  // const deleteProduct = async (id: string) => {
  //   // Implement logic to send delete request to API/database
  //   const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
  //   if (response.ok) {
  //     // Update state with removed product
  //     setProducts(products.filter((product) => product.id !== id));
  //   } else {
  //     // Handle error
  //   }
  // };

  // const updateProduct = async (product: Product) => {
  //   // Implement logic to send update request to API/database
  //   const response = await fetch(`/api/products/${product.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(product),
  //   });
  //   if (response.ok) {
  //     // Update state with updated product
  //     setProducts(products.map((p) => (p.id === product.id ? product : p)));
  //   } else {
  //     // Handle error
  //   }
  // };

  // const fetchClients = async () => {
  //   // Implement logic to fetch clients from API/database
  //   const response = await fetch("/api/clients");
  //   const data: Client[] = await response.json();
  //   setClients(data);
  // };

  // useEffect for initial data fetch
  // useEffect(() => {
  //   fetchProducts();
  //   fetchClients();
  // }, []);

  // Handle product selection
  // const handleProductSelect = (product: Product) => {
  //   setSelectedProduct(product);
  // };

  //** Render Products */
  const renderProducts = products.map((p) => {
    return (
      <div
        key={p._id}
        className="card w-96 glass flex m-auto mt-10 sm:w-72 sm:max-h-[450px] xl:w-96 xl:max-h-[500px]"
      >
        <figure>
          <img
            src={`http://${CLIENT_URL.current}${p.thumbnails[0]}`}
            alt={p.title}
            className="object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{p.title}</h2>
          <p>Model: {p.description}</p>
          <p>Price: ${p.price} USD</p>
          <p>Stock: {p.stock}</p>
          <div className="card-actions justify-end">
            <Link to={`/editproduct/${p._id}`}>
              <button data-pid={p._id} className="btn btn-success text-lg">
                Edit Product
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  });
  // Render components
  return (
    <div className="admin-panel pt-20 flex">
      <div className="left flex-2 w-1/5 p-1">
        <div className="admData p-3">
          <span className="text-md lowercase">
            {profileData?.fullName} ({profileData?.role})
          </span>
        </div>
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-200 rounded-none rounded-t-xl"
        >
          <div
            className="collapse-title text-xl font-medium flex gap-2 "
            style={{
              cursor: "pointer",
            }}
          >
            <FolderOpenOutlinedIcon />
            <span>Products</span>
          </div>
          <div className="collapse-content text-lg">
            <li>
              <a
                onClick={fetchProducts}
                style={{
                  cursor: "pointer",
                }}
              >
                View All Products
              </a>
            </li>
            <li>
              <a
                onClick={handleFormAddProduct}
                style={{
                  cursor: "pointer",
                }}
              >
                Add New Product
              </a>
            </li>
          </div>
        </div>
        <div
          tabIndex={0}
          className="collapse collapse-arrow bg-base-200 rounded-none rounded-b-xl"
        >
          <div
            className="collapse-title text-xl font-medium flex gap-2"
            style={{
              cursor: "pointer",
            }}
          >
            <PersonOutlineOutlinedIcon />
            <span>Customers</span>
          </div>
          <div className="collapse-content text-lg">
            <li>
              <a
                style={{
                  cursor: "pointer",
                }}
              >
                See Customers
              </a>
            </li>
            <li>
              <a
                style={{
                  cursor: "pointer",
                }}
              >
                View Orders
              </a>
            </li>
          </div>
        </div>
      </div>
      <div className="right gap-2 flex flex-wrap w-full p-3">
        {showProducts && (
          <div className="gap-2 flex flex-wrap justify-center">
            {renderProducts}
            <div className="PaginateOptions mt-4">
              {(pageOptions?.hasPrevPage || pageOptions?.hasNextPage) && (
                <PaginateProductsList
                  PageOptions={pageOptions}
                  setProducts={setProducts}
                  Sort={sortProducts}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
              )}
            </div>
          </div>
        )}
        {formToAddProduct && <AddProductForm />}
      </div>
    </div>
  );

  // Separate components for product form and client orders can be implemented here
};
export default ManageStore;
