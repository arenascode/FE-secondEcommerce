import { useState, useEffect, useRef } from "react";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useSessions } from "../context/SessionsContext";
import axios from "axios";
import { PageOptions, Product, SortProducts } from "../Products/ProductListContainer";
import { Link } from "react-router-dom";
import PaginateProductsList from "../Products/PaginateProductsList";
import AddProductForm from "../Products/AddProduct";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { AddOutlined, BikeScooter, Home, PersonOutlined, Store } from "@mui/icons-material";
import Users from "./Users";
import { AiOutlineUser, AiOutlineUserSwitch } from "react-icons/ai";
// import Link from "@mui/material/Link";

const ManageStore = () => {

  

  

  const { setProfileData, profileData } = useSessions();
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [formToAddProduct, setFormToAddProduct] = useState<boolean>(false)
  const [pageOptions, setPageOptions] = useState<PageOptions>();
  const [sortProducts, setSortProducts] = useState<SortProducts>("1");
  const [pageNumber, setPageNumber] = useState("1");
  const [showCustomers, setShowCustomers] = useState<boolean>(false)
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
      setShowCustomers(false);
    });
  };

  const handleFormAddProduct = () => {
    setFormToAddProduct(true)
    setShowProducts(false)
    setShowCustomers(false);
  }

  //* Fetch Customers 

  const fetchCustomers = async () => {
    setShowCustomers(true)
    setFormToAddProduct(false);
    setShowProducts(false);
  }
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

  // Breadcrumbs
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  // Render components
  return (
    <div className="admin-panel pt-20 flex h-screen">
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
                onClick={fetchCustomers}
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
      <div className="right flex flex-wrap w-full p-3">
        <div className="prevPage w-full p-2 rounded-t-md">
          <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb" className="p-2 ">
              <Link
                color="inherit"
                to="/"
                className="hover:underline flex gap-1"
              >
                <Home fontSize="small" /> Home
              </Link>
              <Link
                color="inherit"
                to={"/profile"}
                className="hover:underline flex gap-1"
              >
                <PersonOutlined /> Profile
              </Link>
              <Link
                color="inherit"
                to={"/manageStore"}
                aria-current="page"
                className="hover:underline flex gap-1"
              >
                <Store /> Manage Store
              </Link>
              {showProducts && (
                <Link
                  color="inherit"
                  className="hover:underline flex gap-1"
                  to={""}
                >
                  <BikeScooter /> Motorcycles
                </Link>
              )}
              {formToAddProduct && (
                <Link
                  color="inherit"
                  className="hover:underline flex gap-1 items-center"
                  to={""}
                >
                  <AddOutlined /> Add New Motorbike
                </Link>
              )}
              {showCustomers && (
                <Link
                  color="inherit"
                  className="hover:underline flex gap-1 align-middle"
                  to={""}
                >
                  <AiOutlineUser className="self-center"/> Users
                </Link>
              )}
            </Breadcrumbs>
          </div>
          <hr />
        </div>
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
        {showCustomers && <Users />}
      </div>
    </div>
  );

  // Separate components for product form and client orders can be implemented here
};
export default ManageStore;
