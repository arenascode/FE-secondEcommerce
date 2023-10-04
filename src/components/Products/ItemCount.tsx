import { useState } from "react"
import { useCart } from "../context/CartContext"

type ProductId = string

const ItemCount = ({productId}: {productId: ProductId}) => {

  const [count, setCount] = useState(1)

  const { addToCart } = useCart()
  
  const productQuantity = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const action = event.currentTarget.textContent
    
    if (action === '+') {
      setCount(count + 1)
    } else if (action === '-') {
      if (count >= 1) {
        setCount(count - 1)
      }
    }
  }
  const addToCartHandler = () => {
    addToCart(productId, count)
  }
  
  return (
    <div className=" flex gap-2 justify-start items-center border-2 border-spacing-2 rounded-lg border-zinc-400 mt-2 p-2 pb-3">
      <div className="counterBtns flex gap-2 justify-start items-center border-2 border-spacing-2 rounded-full border-grey-800 mt-2">
        <button
          onClick={productQuantity}
          className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl"
        >
          -
        </button>
        <div>{count}</div>
        <button
          onClick={productQuantity}
          className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl"
        >
          +
        </button>
      </div>
      <button onClick={addToCartHandler} className="btn btn-sm rounded-xl mt-2 active:bg-success active:text-whit active:border-success">
        Add To Cart
      </button>
    </div>
  );
}
export default ItemCount