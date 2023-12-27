import { useLocation } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import UploadProductForm from "./UploadForm";

const UploadProduct = () => {

  const location = useLocation()
  const productId = (location.pathname).split('/')[2]
  console.log(productId);
  
  return (
    <div className="uploadProduct pt-20 flex">
      <div className="left flex-2"><UploadProductForm productId={productId}/></div>
      <div className="right flex-3"><ProductDetail/></div>
    </div>
  )
}
export default UploadProduct