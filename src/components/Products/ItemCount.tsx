import { useState } from "react"

const ItemCount = () => {

  const [count, setCount] = useState(1)

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
  return (
    <div className=" flex gap-2 justify-start items-center border-2 border-spacing-2 rounded-full border-grey-800 mt-2">
      <button onClick={productQuantity} className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl">
        -
      </button>
      <div>{count}</div>
      <button onClick={productQuantity} className="btn btn-sm btn-circle active:bg-slate-600 active:text-white active:border-slate-600 text-xl">
        +
      </button>
    </div>
  );
}
export default ItemCount