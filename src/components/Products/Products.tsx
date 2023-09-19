import ProductListContainer from "./ProductListContainer"
import PaginateProductsList from "../Products/PaginateProductsList"

const Products = () => {
  return (
    <>
      <div className="text-xl glass">
        <h1 className="text-center text-white text-3xl pt-6">Nuestras Motos</h1>
        <PaginateProductsList/>
      <ProductListContainer />
      </div>
      
    </>
    
  )
}
export default Products