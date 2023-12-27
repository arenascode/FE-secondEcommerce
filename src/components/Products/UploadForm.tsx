import React, { useState } from "react";
import axios from "axios";

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

const UploadProductForm: React.FC<ProductIdProps> = (productId) => {
  const [file, setFile] = useState(null as File | null);
  console.log(productId.productId);
  const pId = productId.productId
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    code: "",
    stock: "",
    category: "",
  });

  // Handler for input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };

  // Handler for file input changes (for thumbnails)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    console.log(file);
    if (file) {
      setFile(file);
      // You may want to handle file uploads accordingly (e.g., using FormData)
      // setFormData((prevData) => ({
      //   ...prevData,
      // }));
    }
  };
  
  
  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform the action to add the product with formData
    console.log("Form data submitted:", formData);
    
    const form = document.querySelector("form");
    
    const UploadProductForm = new FormData(form as HTMLFormElement);

    UploadProductForm.append("productImg", file as File);
    
    for (const [key, value] of UploadProductForm.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    axios
      .put(`http://127.0.0.1:8080/api/products/${pId}`, UploadProductForm, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          alert("product Updated");
          // Reset the form
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
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-50 m-auto p-5 bg-white shadow-lg rounded h-[97%] overflow-y-scroll">
      <h2 className="text-2xl font-semibold mb-4">Upload Product</h2>
      <form
        onSubmit={handleSubmit}
        className="w-[500px] "
        name="UploadProductForm"
      >
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-600"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Code */}
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-600"
          >
            Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-600"
          >
            Stock
          </label>
          <input
            type="text"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-600"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="Naked">Naked</option>
            <option value="Superbike">Superbike</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-600"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="thumbnail"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="py-2 px-4 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Upload Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProductForm;
