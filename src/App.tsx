import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./components/Home/Home"
import Products from "./components/Products/Products"
import ProductDetail from "./components/Products/ProductDetail"
import CartContextProvider from "./components/context/CartContext"
import Login from "./components/sessions/Login"
import CartDetail from "./components/cart/CartDetail"
import Register from "./components/sessions/Register"
import Profile from "./components/sessions/Profile"

function App() {
  
  return (
    <CartContextProvider>
  <BrowserRouter>
      <NavBar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path={"/products"} element={<Products />} />
          <Route path={"/products/:id"} element={<ProductDetail />} />
          <Route path="/cartDetail/:id" element={<CartDetail/>} />
      </Routes>
      </BrowserRouter>
    </CartContextProvider>
  )
}

export default App
