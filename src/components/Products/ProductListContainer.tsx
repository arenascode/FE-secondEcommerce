import { useState } from "react"

type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
  code: string,
  stock: number,
  status: boolean,
  category: string,
  thumbnails: (string | null)[],
}
const ProductListContainer = () => {
  const [products, setProducts] = useState<Product[]>([])
  
  

  const getProducts = () => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.docs)
      })
      .catch((err) => console.log(err));
  }

  
  const renderProducts = products.map((p) => {
    return <div key={p.id}>
      <li>Title: {p.title}</li>
      <li>Description: {p.description}</li>
      <li>Price: {p.price}</li>
      <li>Category: {p.category}</li>
      <li>Stock: {p.stock}</li>
      <br/>
    </div>
  })
  return (
    <div>
      ProductListContainer
      <button className="btn m-5" onClick={getProducts}>Get Products</button>
      <div>
        {renderProducts}
      </div>
      
    </div>
  )
}
export default ProductListContainer