import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { useSessions } from "../context/SessionsContext";

interface ProductIdProps {
  productId: string 
}
interface FormData {
  title: string;
  description: string;
  price: string;
  code: string;
  stock: string;
  category: string;
}

const UpdateProductForm: React.FC<ProductIdProps> = (productId) => {
  const [file, setFile] = useState(null as File | null);
  const pId = productId.productId
  
  const {setIsUserLogged, setProfileData, setUserHasPhoto} = useSessions()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    code: "",
    stock: "",
    category: "",
  });
  
  const queryClient = useQueryClient();

  const productMutation = useMutation({
    mutationFn: async (formToSend) => {
      return axios
        .put(`http://127.0.0.1:8080/api/products/${pId}`, formToSend, {
          withCredentials: true,
        })
        .then((res) => {
          
          if (res.status === 200) {
            setFormData({
              title: "",
              description: "",
              price: "",
              code: "",
              stock: "",
              category: "",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsUserLogged(false)
          setProfileData(null)
          setUserHasPhoto(false);
        });
    }, 
    onSuccess: () => {
      queryClient.invalidateQueries(["productId"])
    }
  },
)
  
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    console.log(file);
    if (file) {
      setFile(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = document.querySelector("form");
    
    const updateProductForm = new FormData(form as HTMLFormElement);

    updateProductForm.append("productImg", file as File);
    
    const formToSend = new FormData()

    for (const [key, value] of updateProductForm.entries()) {
      if (value !== '' && value !== 'null') {
        console.log(`The ${key} field it's empty!`);
        formToSend.append(key, value)
      }
    }
    
    productMutation.mutate(formToSend)

  };

  return (
    <div className="w-full m-auto p-5 shadow-lg rounded h-[100%] overflow-y-scroll bg-gradient-to-br from-blue-800 at-center to-gray-400">
      <h2 className="text-2xl font-semibold mb-4 text-white tracking-wider">Update Product</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full smd:h-[33rem] md:h-[30rem] text-gray-800"
        name="UpdateProductForm"
      >
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-200"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            // value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-200"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            // value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-200"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            // value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Code */}
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-200"
          >
            Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            // value={formData.code}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-200"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            // value={formData.stock}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-200"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            // value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="" defaultValue={""}></option>
            <option value="Naked">Naked</option>
            <option value="Superbike">Superbike</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div className="mt-8 mb-4">
          <label
            htmlFor="productImg"
            className=" text-sm md:text-lg font-medium text-gray-200 flex gap-3 items-center w-max cursor-pointer tracking-wide"
          >
           <AddPhotoAlternateOutlined fontSize="large"/>
            Upload Photo
          </label>
          <input
            type="file"
            id="productImg"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded-md text-gray-200 pl-7 hidden"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="py-2 px-4 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
