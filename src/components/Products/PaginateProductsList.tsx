import { useRef, useState } from "react";
import { Product } from "./ProductListContainer";

interface ChildComponentProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const PaginateProductsList: React.FC<ChildComponentProps> = ({
  setProducts,
}) => {
  const [arrowRight, setArrowRight] = useState(true);
  const [arrowLeft, setArrowLeft] = useState(true);
  const [btnColor1, setBtnColor1] = useState(false);
  const [btnColor2, setBtnColor2] = useState(false);
  const [btnColor3, setBtnColor3] = useState(false);

  const CLIENT_URL = useRef<string | null>(null);

  function pageOne() {
    setBtnColor1(true);
    setBtnColor2(false)
    setBtnColor3(false)
    fetch("http://localhost:8080/api/products?page=1/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(data.products.docs);

        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function pageTwo() {
    setBtnColor1(false);
    setBtnColor2(true)
    setBtnColor3(false)
    fetch("http://localhost:8080/api/products?page=2/")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProducts(data.products.docs);

        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function pageThree() {
    setBtnColor1(false);
    setBtnColor2(false);
    setBtnColor3(true);
    fetch("http://localhost:8080/api/products?page=3/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.docs);

        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex justify-center mt-6 gap-8 mb-5 ">
      <img
        src="src/assets/icons/left-arrow.png"
        alt=""
        className={`${arrowLeft ? "block" : "hidden"} w-5 h-5 mt-1`}
      />
      <button
        onClick={pageOne}
        className={`btn btn-circle btn-sm ${
          btnColor1 ? "bg-slate-700 text-white border-none" : ""
        }`}
      >
        1
      </button>
      <button
        onClick={pageTwo}
        className={`btn btn-circle btn-sm ${
          btnColor2 ? "bg-slate-700 text-white border-none" : ""
        }`}
      >
        2
      </button>
      <button
        onClick={pageThree}
        className={`btn btn-circle btn-sm ${
          btnColor3 ? "bg-slate-700 text-white border-none" : ""
        }`}
      >
        3
      </button>
      <img
        src="src/assets/icons/right-arrow.png"
        alt=""
        className={` ${arrowRight ? "block" : "hidden"} w-5 h-5 mt-1`}
      />
    </div>
  );
};
export default PaginateProductsList;
