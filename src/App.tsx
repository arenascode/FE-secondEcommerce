import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import ProductDetail from "./components/Products/ProductDetail";
import CartContextProvider from "./components/context/CartContext";
import Login from "./components/sessions/Login";
import CartDetail from "./components/cart/CartDetail";
import Register from "./components/sessions/Register";
import Profile from "./components/sessions/Profile";
import SessionsContextProvider from "./components/context/SessionsContext";
import RestorePass from "./components/sessions/RestorePass";
import ManageStore from "./components/manageStore/ManageStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UploadProduct from "./components/Products/UploadProduct";
import PaymentForm from "./components/cart/PaymentForm";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionsContextProvider>
        <CartContextProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/restorePass" element={<RestorePass />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manageStore" element={<ManageStore />} />
              <Route path={"/products"} element={<Products />} />
              <Route path={"/products/:id"} element={<ProductDetail />} />
              <Route path={"/editproduct/:id"} element={<UploadProduct />} />
              <Route path="/cartDetail/" element={<CartDetail />} />
              <Route path="/paymentForm" element={<PaymentForm />} />
            </Routes>
          </BrowserRouter>
        </CartContextProvider>
      </SessionsContextProvider>
    </QueryClientProvider>
  );
}

export default App;
