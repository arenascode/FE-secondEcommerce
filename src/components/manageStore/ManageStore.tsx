import React, { useState, useEffect } from "react";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
const ManageStore = () => {
  // Interfaces for product and client data
  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  }

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

  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );

  // Functions for CRUD operations
  const fetchProducts = async () => {
    // Implement logic to fetch products from API/database
    const response = await fetch("/api/products");
    const data: Product[] = await response.json();
    setProducts(data);
  };

  const addProduct = async (product: Product) => {
    // Implement logic to send create request to API/database
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
    if (response.ok) {
      // Update state with new product
      setProducts([...products, product]);
    } else {
      // Handle error
    }
  };

  const deleteProduct = async (id: string) => {
    // Implement logic to send delete request to API/database
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      // Update state with removed product
      setProducts(products.filter((product) => product.id !== id));
    } else {
      // Handle error
    }
  };

  const updateProduct = async (product: Product) => {
    // Implement logic to send update request to API/database
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    if (response.ok) {
      // Update state with updated product
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      // Handle error
    }
  };

  const fetchClients = async () => {
    // Implement logic to fetch clients from API/database
    const response = await fetch("/api/clients");
    const data: Client[] = await response.json();
    setClients(data);
  };

  // useEffect for initial data fetch
  // useEffect(() => {
  //   fetchProducts();
  //   fetchClients();
  // }, []);

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  // Render components
  return (
    <div className="admin-panel pt-20 flex flex-col">
      <div className="left flex-1 w-1/3">
        <div className="admData">
          Admin name
        </div>
        <div
          tabIndex={0}
          className="collapse collapse-arrow border border-base-300 bg-base-200"
        >
          <div className="collapse-title text-xl font-medium flex gap-2">
            <FolderOpenOutlinedIcon />
            <span>Products</span>
          </div>
          <div className="collapse-content">
            <ul className="menu xl:menu-horizontal lg:min-w-max bg-base-200 rounded-box">
              <li>
                <a>See Products</a>
              </li>
              <li>
                <a>Add Products</a>
              </li>
              <li>
                <a>Update Products</a>
              </li>
              <li>
                <a>Delete Products</a>
              </li>
            </ul>
          </div>
          <div
            tabIndex={0}
            className="collapse collapse-arrow border border-base-300 bg-base-200"
          >
            <div className="collapse-title text-xl font-medium flex gap-2">
              <PersonOutlineOutlinedIcon />
              <span>Customers</span>
            </div>
            <div className="collapse-content">
              <li>
                <a>See Customers</a>
              </li>
              <li>
                <a>View Orders</a>
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="right flex-6"></div>
    </div>
  );

  // Separate components for product form and client orders can be implemented here
};
export default ManageStore;
