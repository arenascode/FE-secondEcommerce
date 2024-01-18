import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import UploadProductForm from "./UploadForm";

const UploadProduct = () => {

  const params = useParams()
  const pId = params.id
  console.log(`pid To Upload ${JSON.stringify(params.id)}`);
  
  
  return (
    <div className="uploadProduct pt-[4rem] flex bg-gradient-to-tr from-gray-400 at-center to-blue-800 w-[100vw] h-full">
      <div className="left w-[60rem]">
        {pId && <UploadProductForm productId={pId} />}
      </div>
      <div className="right h-full">
        <ProductDetail />
      </div>
    </div>
  );
}
export default UploadProduct