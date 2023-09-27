import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./components/Home/Home"
import Products from "./components/Products/Products"
import ProductDetail from "./components/Products/ProductDetail"

function App() {
  
  return (
  <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path={"/products"} element={<Products />} />
        <Route path={"/products/:id"} element={<ProductDetail/>} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
