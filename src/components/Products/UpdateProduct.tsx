import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import UpdateProductForm from "./UpdateForm";
import { useEffect, useState } from "react";

const UpdateProduct = () => {

  const [layoutProductCard, setLayoutProductCard] = useState<boolean>(false)
  
  const params = useParams()
  const pId = params.id
  console.log(`pid To update ${JSON.stringify(params.id)}`);
  
  
  return (
    <div className='updateProduct sm:p-2 smd:pt-[56px] smd:p-0 flex sm:flex-col-reverse smd:flex-row bg-gradient-to-tr from-gray-400 at-center to-blue-800 w-[100vw] h-full '>
      <div className="left w-[60rem] sm:w-[22.5rem] smm:w-[29rem] smd:w-[80rem]">
        {pId && <UpdateProductForm productId={pId} />}
      </div>
      <div className="right h-full">
        <ProductDetail />
      </div>
    </div>
  );
}
export default UpdateProduct