import { useRef, useState } from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { Product } from "./ProductListContainer";
import ItemCount from "./ItemCount";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import { useSessions } from "../context/SessionsContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();

  const apiUrl = import.meta.env.VITE_API_URL

  const { setCategory, subTotal } = useCart();

  const { profileData, isUserLogged } = useSessions();

  const location = useLocation();
  const firstPartPath: string = location.pathname.split("/")[1];
  
  const CLIENT_URL = useRef(null);

  const [product, setProduct] = useState<Product | null>();

  //* Function to back to category in breadcrumbs

  const { isLoading } = useQuery({
    queryKey: ["productId"],
    queryFn: () => {
      axios
        .get(`${apiUrl}/api/products/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          CLIENT_URL.current = res.data.CLIENT_URL;
          setProduct(res.data.productById);
          return res.data.productById;
        });
    },
  });

  const backToCategory = (event: React.MouseEvent<HTMLElement>) => {
    const category: string | null = event.currentTarget.textContent;
    setCategory(category);
  };

  axios.interceptors.request.use(
    request => {
      return request
    },
    error =>  Promise.reject(error)
  )
  const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: true,
  });
  
  const handleDelete = async () => {
    Toast.fire({
      title: "Are you sure you want to remove the product?",
      showCancelButton: true,
      cancelButtonColor: 'green',
      confirmButtonText: 'Delete',
      confirmButtonColor: 'red',
    }).then((res) => {
      console.log(res.isConfirmed);
      if (res.isConfirmed) {
        Toast.fire({
          text: "For security the request to the server to delete this product is disabled.",
        });
        //* Disabled for security
        // await axios
        //   .delete(`${apiUrl}/api/products/${id}`, {
        //     withCredentials: true,
        // })
        // .then(() => {
        //   alert(`Product has been deleted`);
        //   setProduct(null);
        // })
        //   // .catch((err) => console.error(err));
        // } else {
        //   console.log(`deletion cancelled`);
        // }
        //})
      }
    })
      };
  
  //** ProductCard Component */
  const ProductCard = ({
    productData,
  }: {
    productData: Product | undefined;
  }) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    
    const handleAlertCartEmpty = (): void => {
      Toast.fire({
        title: "Add To Cart First",
        icon: "warning",
      });
    };

    const handleEdit = () => { 
      isUserLogged && <Navigate to={'/sessionExpired'}/>
    }

    return (
      <div className={`card glass w-97 shadow-xl text-white md:flex-row ${firstPartPath == "editproduct" ? 'md:flex-col md:items-center' : ""} lg:w-full`}>
        <div className={`imgContainer ${firstPartPath == 'editproduct' ? '' : 'lg:w-1/2'} p-2`}>
          <figure className=" overflow-hidden rounded-lg sm:max-h-72 md:max-h-96 lg:max-h-[28rem]">
            <img
              src={`${CLIENT_URL.current}${productData?.thumbnails[0]}`}
              alt="Shoes"
              className="rounded-xl h-full"
            />
          </figure>
        </div>
        <div className="card-body items-center text-center lg:flex-1 px-4 pt-0">
          {/* BreadCrumbs */}
          <div className="text-sm breadcrumbs ml-1 mt-2 tracking-wider sm:text-lg xl:text-xl self-start text-gray-300">
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link onClick={() => setCategory("")} to={"/products"}>
                  Motos
                </Link>
              </li>
              <li>
                <Link to={"/products"} onClick={backToCategory}>
                  {productData?.category}
                </Link>
              </li>
              <li>
                <a>{productData?.title}</a>
              </li>
            </ul>
          </div>
          <div className="productTitle flex justify-center">
            <h2 className="card-title tracking-widest sm:text-2xl lg:text-3xl xl:text-4xl">
              {productData?.title} {productData?.description}
            </h2>
          </div>
          <div className="productDetailsTitle w-full flex justify-start pt-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl xl:mt-7">
              Caracteristicas Destacadas
            </h3>
          </div>
          <div className="productDetailsBody w-full flex justify-start tracking-wider sm:text-lg lg:text-xl xl:text-2xl lg:mt-3">
            <ul className="flex flex-col gap-2">
              <li className="flex font-bold gap-1">
                Tipo de Moto:{" "}
                <span className="font-extralight">
                  {" "}
                  {productData?.category}
                </span>
              </li>
              <li className="flex font-bold gap-1">
                Stock:{" "}
                <span className="font-extralight"> {productData?.stock}</span>
              </li>
              <li className="flex font-bold gap-1">
                Precio:{" "}
                <span className="font-extralight"> ${productData?.price}</span>
              </li>
            </ul>
          </div>
          <p className="tracking-wider sm:text-lg lg:text-xl lg:mt-5 xl:text-2xl xl:mt-10">
            Animate a la aventura con la {productData?.title}{" "}
            {productData?.description}
          </p>
          {profileData?.role === "admin" ? (
            firstPartPath == "editproduct" ? (
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-error text-white"
              >
                Delete Product
              </button>
            ) : (
              <button className="btn btn-md btn-success rounded-full tracking-widest mt-1 sm:btn-lg text-white justify-end">
                <Link to={`/editproduct/${product?._id}`} onClick={handleEdit}>Edit Product</Link>
              </button>
            )
          ) : (
            <div className="card-actions flex justify-between w-full items-center">
              <div className="itemCountCountainer flex items-center gap-2">
                <ItemCount
                  productId={productData?._id ?? ""}
                  productStock={productData?.stock ?? 0}
                />
              </div>
              {subTotal >= 1 ? (
                <Link to={`/cartDetail/`}>
                  <button className="btn btn-md btn-success rounded-full tracking-widest mt-1 sm:btn-lg text-white">
                    Buy Now
                  </button>{" "}
                </Link>
              ) : (
                <button
                  onClick={handleAlertCartEmpty}
                  className="btn btn-md btn-success rounded-full tracking-widest mt-1 sm:btn-lg text-white"
                >
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {product ? (
        isLoading ? (
          "Loading..."
        ) : (
          <div className="py-20 flex justify-center px-2 md:px-6 bg-gradient-to-tr from-gray-400 at-center to-stone-800">
            <ProductCard productData={product ? product : undefined} />
          </div>
        )
      ) : (
        <div className="flex align-middle justify-center p-auto justify-items-center">
          <h1 className="text-center">"Product Does Not Exist!"</h1>{" "}
        </div>
      )}
    </>
  );
};

export default ProductDetail;
