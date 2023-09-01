import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./components/Home/Home"
import Products from "./components/Products/Products"

function App() {
  
  return (
  <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path={"/products"} element={<Products/>} />
      </Routes>
  </BrowserRouter>
  )
}

export default App
