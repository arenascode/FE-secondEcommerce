import { useState, useEffect, useRef } from "react";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useSessions } from "../context/SessionsContext";
import axios from "axios";
import {
  PageOptions,
  Product,
  SortProducts,
} from "../Products/ProductListContainer";
import { Link } from "react-router-dom";
import PaginateProductsList from "../Products/PaginateProductsList";
import AddProductForm from "../Products/AddProduct";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  AddOutlined,
  BikeScooter,
  Home,
  MonetizationOn,
  PersonOutlined,
  Store,
} from "@mui/icons-material";
import Users from "./Users";
import { AiOutlineUser } from "react-icons/ai";
import Orders from "./Orders";
import { red } from "@mui/material/colors";

const ManageStore = () => {
  const { setProfileData, profileData } = useSessions();
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [formToAddProduct, setFormToAddProduct] = useState<boolean>(false);
  const [pageOptions, setPageOptions] = useState<PageOptions>();
  const [sortProducts, setSortProducts] = useState<SortProducts>("1");
  const [pageNumber, setPageNumber] = useState("1");
  const [showCustomers, setShowCustomers] = useState<boolean>(false);
  const [showOrders, setShowOrders] = useState<boolean>(false);
  const CLIENT_URL = useRef(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/sessions/current", {
        withCredentials: true,
      })
      .then((res) => {
        setProfileData(res.data.currentUserDTO);
      });
  }, []);

  // Functions for CRUD operations
  const fetchProducts = async () => {
    // Implement logic to fetch products from API/database
    await axios.get("http://127.0.0.1:8080/api/products").then((res) => {
      setProducts(res.data.products.docs);
      CLIENT_URL.current = res.data.CLIENT_URL;
      setShowProducts(true);
      const pageOptions: PageOptions = {
        prevPage: res.data.products.prevPage,
        nextPage: res.data.products.nextPage,
        hasNextPage: res.data.products.hasNextPage,
        hasPrevPage: res.data.products.hasPrevPage,
      };
      setPageOptions(pageOptions);
      setFormToAddProduct(false);
      setShowCustomers(false);
      setShowOrders(false);
    });
  };

  const handleFormAddProduct = () => {
    setFormToAddProduct(true);
    setShowProducts(false);
    setShowCustomers(false);
    setShowOrders(false);
  };

  //* Fetch Customers

  const fetchCustomers = async () => {
    setShowCustomers(true);
    setFormToAddProduct(false);
    setShowProducts(false);
    setShowOrders(false);
  };

  //*Show Orders Component
  const handleShowOrders = () => {
    setShowCustomers(false);
    setFormToAddProduct(false);
    setShowProducts(false);
    setShowOrders(true);
  };
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
    <div
      className={`admin-panel pt-16 flex ${
        showProducts ? "h-[max-content]" : "h-[100dvh]"
      } sm:flex-col bg-gradient-to-tr from-gray-400 at-center to-blue-800`}
    >
      <div className="left flex-2 w-1/5 p-1 sm:flex-col">
        <div className="admData p-3 sm:w-max">
          <span className="text-md lowercase sm:w-max md:text-lg xl:text-xl text-gray-100 tracking-wider">
            {profileData?.fullName} ({profileData?.role})
          </span>
        </div>
        <div className="panelMenu flex sm:flex-row sm:w-max sm:gap-3 sm:px-2 smm:pl-14 smm:gap-8 smd:pl-28 smd:gap-12 md:pl-48 lg:pl-80 xl:pl-96">
          <div className="collapseProducts">
            <div
              tabIndex={0}
              className="collapse collapse-plus bg-base-200 rounded-none rounded-t-xl sm:rounded-md"
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
          </div>
          <div className="collapseCustomers">
            <div
              tabIndex={0}
              className="collapse collapse-plus bg-base-200 rounded-none rounded-b-xl sm:rounded-md"
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
                    onClick={handleShowOrders}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    View Sales
                  </a>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right flex flex-wrap w-full p-3">
        <div className="prevPage w-full p-2 rounded-t-md">
          <div role="presentation" className="BreadCrumbs">
            <Breadcrumbs aria-label="breadcrumb" className="p-2 xl:p-4">
              <Link
                color={red['50']}
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
                  <AiOutlineUser className="self-center" /> Users
                </Link>
              )}
              {showOrders && (
                <Link
                  color="inherit"
                  className="hover:underline flex gap-1 align-middle"
                  to={""}
                >
                  <MonetizationOn fontSize="small" className="self-center" />{" "}
                  Sales
                </Link>
              )}
            </Breadcrumbs>
          </div>
          <hr />
        </div>
        {showProducts && (
          <div className="gap-2 flex flex-wrap justify-center ">
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
        {showOrders && <Orders />}
      </div>
    </div>
  );
};
export default ManageStore;
