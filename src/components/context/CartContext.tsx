import { createContext, ReactNode, useContext, useState} from "react";


export type Category = string | null;

type CartContextType = {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
};

const CartContext = createContext<CartContextType>({
  setCategory: () => {},
  category: null
})

export const useCart = () => {
  return useContext(CartContext)
}
type CartContextPRoviderProps = {
  children: ReactNode
}
const CartContextProvider = ({ children }: CartContextPRoviderProps) => {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [pageOptions, setPageOptions] = useState<PageOptions>();
  const [category, setCategory] = useState<Category>('');

  const contextValue: CartContextType = {
    category: category,
    setCategory: setCategory
  }
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider