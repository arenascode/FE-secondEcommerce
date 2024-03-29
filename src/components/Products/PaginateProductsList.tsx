import { useEffect, useRef, useState } from "react";
import { PageNumber, Product } from "./ProductListContainer";

interface ChildComponentProps {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  PageOptions: {
    nextPage: number | null;
    prevPage: number | null;
  };
  Sort: string | null;
  pageNumber: string;
  setPageNumber: React.Dispatch<React.SetStateAction<PageNumber>>;
}

const PaginateProductsList: React.FC<ChildComponentProps> = ({
  setProducts, PageOptions, Sort, setPageNumber
}) => {

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    setArrowLeft(false)
  }, []) 
   
  const [arrowRight, setArrowRight] = useState(true);
  const [arrowLeft, setArrowLeft] = useState(true);
  const [btnColor1, setBtnColor1] = useState(false);
  const [btnColor2, setBtnColor2] = useState(false);
  const [btnColor3, setBtnColor3] = useState(false);
  const [nextPage, setNextPage] = useState(PageOptions.nextPage);
  const [previousPage, setPreviousPage] = useState(PageOptions.prevPage);

  const CLIENT_URL = useRef<string | null>(null);

  function pageOne() {
    setBtnColor1(true);
    setBtnColor2(false);
    setBtnColor3(false);
    
    fetch(`${apiUrl}/api/products?page=1/&sortprice=${Sort}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.docs);
        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        setPageNumber(data.products.page);
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function pageTwo() {
    setBtnColor1(false);
    setBtnColor2(true);
    setBtnColor3(false);
    fetch(`${apiUrl}/api/products?page=2&sortprice=${Sort}/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.docs);
        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        setPreviousPage(data.products.prevPage);
        setNextPage(data.products.nextPage);
        setPageNumber(data.products.page);

        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function pageThree() {
    setBtnColor1(false);
    setBtnColor2(false);
    setBtnColor3(true);
    fetch(`${apiUrl}/api/products?page=3&sortprice=${Sort}/`)
      .then((res) => res.json())
      .then((data) => {
        setPageNumber(data.products.page);
        setProducts(data.products.docs);
        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        setPreviousPage(data.products.prevPage);

        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function nextOnePage() {
    if (nextPage === 3) {
      setBtnColor3(true);
      setBtnColor1(false);
      setBtnColor2(false);
    }
    if (nextPage === 2) {
      setBtnColor3(false);
      setBtnColor1(false);
      setBtnColor2(true);
    }
   
    fetch(`${apiUrl}/api/products?page=${nextPage}&sortprice=${Sort}/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.docs);
        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        setNextPage(data.products.nextPage)
        setPreviousPage(data.products.prevPage)
        setPageNumber(data.products.page);
        
        CLIENT_URL.current = data.CLIENT_URL;
      })
      .catch((err) => console.log(err));
  }
  function previousOnePage() {

    fetch(`${apiUrl}/api/products?page=${previousPage}&sortprice=${Sort}/`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products.docs);
        setArrowRight(data.products.hasNextPage);
        setArrowLeft(data.products.hasPrevPage);
        setNextPage(data.products.nextPage);
        setPreviousPage(data.products.prevPage);
        setPageNumber(data.products.page);
        CLIENT_URL.current = data.CLIENT_URL;

        if (data.products.page === 1) {
          setBtnColor3(false);
          setBtnColor1(true);
          setBtnColor2(false);
        }
        if (data.products.page === 2) {
          setBtnColor3(false);
          setBtnColor1(false);
          setBtnColor2(true);
        }
        if (data.products.page === 3) {
          setBtnColor3(true);
          setBtnColor1(false);
          setBtnColor2(false);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="flex justify-center mt-6 gap-8 mb-5 ">
      <button onClick={previousOnePage}>
        <img
          src="/icons/left-arrow.png"
          alt=""
          className={`${
            arrowLeft ? "block" : "hidden"
          } w-5 h-5 mt-1 lg:w-8 lg:h-8`}
        />
      </button>

      <button
        onClick={pageOne}
        className={`btn btn-circle btn-sm ${
          btnColor1 ? "bg-slate-700 text-white border-none" : ""
        } lg:text-xl`}
      >
        1
      </button>
      <button
        onClick={pageTwo}
        className={`btn btn-circle btn-sm ${
          btnColor2 ? "bg-slate-700 text-white border-none" : ""
        } lg:text-xl`}
      >
        2
      </button>
      <button
        onClick={pageThree}
        className={`btn btn-circle btn-sm ${
          btnColor3 ? "bg-slate-700 text-white border-none" : ""
        } lg:text-xl`}
      >
        3
      </button>
      <button onClick={nextOnePage}>
        <img
          src="/icons/right-arrow.png"
          alt=""
          className={` ${
            arrowRight ? "block" : "hidden"
          } w-5 h-5 mt-1 lg:w-8 lg:h-8`}
        />
      </button>
    </div>
  );
};
export default PaginateProductsList;
