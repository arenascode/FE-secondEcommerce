import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import ProductDetail from "./components/Products/ProductDetail";
import CartContextProvider from "./components/context/CartContext";
import Login from "./components/sessions/Login";
import CartDetail from "./components/cart/CartDetail";
import Register from "./components/sessions/Register";
import Profile from "./components/sessions/Profile";
import { useSessions } from "./components/context/SessionsContext";
import RestorePass from "./components/sessions/RestorePass";
import ManageStore from "./components/manageStore/ManageStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UploadProduct from "./components/Products/UpdateProduct";
import SessionExpired from "./components/sessions/SessionExpired";
import { useEffect } from "react";
import axios from "axios";

interface ProtectedRouteProps {
  children: React.ReactNode
}

function App() {
  const queryClient = new QueryClient();

  const { isUserLogged, setProfileData, setIsUserLogged, setUserHasPhoto } = useSessions();
  
  useEffect(() => {
    axios
    .get("http://127.0.0.1:8080/api/sessions/current", {
      withCredentials: true,
    })
    .then((res) => {
      setProfileData(res.data.currentUserDTO);
    }).catch((err) => {
      console.log(err)
      if (err.response.status == 401) {
        setIsUserLogged(false)
        setProfileData(null)
        setUserHasPhoto(false)
      }
    }
    )
  }, []);
  
  console.log({ isUserLogged });

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    console.log("rendering ProtectedRoute");

    if (!isUserLogged) {
      console.log('user not logged. Redirectin to sessionExpired');
      
      return <Navigate to={"/sessionExpired"} />;
    }
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartContextProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restorePass" element={<RestorePass />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/manageStore"
              element={<ProtectedRoute>{<ManageStore />}</ProtectedRoute>}
            />
            <Route path={"/products"} element={<Products />} />
            <Route path={"/products/:id"} element={<ProductDetail />} />
            <Route
              path={"/editproduct/:id"}
              element={<ProtectedRoute>{<UploadProduct />}</ProtectedRoute>}
            />
            <Route path="/cartDetail/" element={<CartDetail />} />
            <Route path="/sessionExpired" element={<SessionExpired />} />
          </Routes>
        </BrowserRouter>
      </CartContextProvider>
    </QueryClientProvider>
  );
}

export default App;
