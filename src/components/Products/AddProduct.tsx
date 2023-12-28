import React, { useState } from "react";
import axios from "axios";

const AddProductForm: React.FC = () => {
  
  const [file, setFile] = useState(null as File | null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    code: "",
    stock: "",
    category: "Naked",
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
      setFile(file)
      // You may want to handle file uploads accordingly (e.g., using FormData)
      // setFormData((prevData) => ({
      //   ...prevData,
      // }));
    }
  };
  const form = document.querySelector("form");
  // console.log(form)

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Perform the action to add the product with formData
    console.log("Form data submitted:", formData);
    // Reset the form
    setFormData({
      title: "",
      description: "",
      price: "",
      code: "",
      stock: "",
      category: "Naked",
    });
    
    
    const addProductForm = new FormData(form as HTMLFormElement)
    addProductForm.append("productImg", file as File)

    await axios.post("http://127.0.0.1:8080/api/products", addProductForm, {
      withCredentials: true
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        alert("product Added")
      }
    }).catch(err => console.log(err)
    )
  };

  return (
    <div className="w-full m-auto p-10 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-semibold mb-4">Add a New Product</h2>
      <form onSubmit={handleSubmit} className="w-[500px]" name="addProductForm">
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;