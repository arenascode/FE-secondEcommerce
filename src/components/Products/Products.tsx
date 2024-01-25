import ProductListContainer from "./ProductListContainer"

const Products = () => {
  
  return (
    <>
      <div className="text-xl  glass pt-16 h-100vh bg-gradient-to-tr from-gray-400 at-center to-blue-800">
        <h1 className="text-center text-white text-3xl tracking-wider pt-6">
          Nuestras Motos
        </h1>
        <ProductListContainer />
      </div>
    </>
  );
}
export default Products