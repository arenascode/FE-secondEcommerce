import ProductListContainer from "./ProductListContainer"

const Products = () => {
  return (
    <>
      <div className="text-xl  glass pt-16 h-100vh">
        <h1 className="text-center text-zinc-700 text-3xl  pt-6">Nuestras Motos</h1>
        <ProductListContainer />
      </div>
    </>
  );
}
export default Products