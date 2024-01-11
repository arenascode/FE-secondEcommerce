import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import UploadProductForm from "./UploadForm";

const UploadProduct = () => {

  // const location = useLocation()
  // const productId = (location.pathname).split('/')[2]
  // console.log(productId);
  const params = useParams()
  const pId = params.id
  console.log(`pid To Upload ${JSON.stringify(params.id)}`);
  
  
  return (
    <div className="uploadProduct pt-20 flex">
      <div className="left flex-2">
        {pId && <UploadProductForm productId={pId} />}
      </div>
      <div className="right flex-3"><ProductDetail/></div>
    </div>
  )
}
export default UploadProduct