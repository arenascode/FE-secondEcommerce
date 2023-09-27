import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./components/Home/Home"
import Products from "./components/Products/Products"
import ProductDetail from "./components/Products/ProductDetail"
import CartContextProvider from "./components/context/cartContext"

function App() {
  
  return (
    <CartContextProvider>
  <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path={"/products"} element={<Products />} />
        <Route path={"/products/:id"} element={<ProductDetail/>} />
      </Routes>
      </BrowserRouter>
    </CartContextProvider>
  )
}

export default App
