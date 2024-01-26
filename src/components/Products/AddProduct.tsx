import React, { useState } from "react";
import axios from "axios";

const AddProductForm: React.FC = () => {
  const [file, setFile] = useState(null as File | null);

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
  };

  // Handler for file input changes (for thumbnails)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setFile(file);
    }
  };
  const form = document.querySelector("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormData({
      title: "",
      description: "",
      price: "",
      code: "",
      stock: "",
      category: "Naked",
    });

    const addProductForm = new FormData(form as HTMLFormElement);
    addProductForm.append("productImg", file as File);

    await axios
      .post("http://127.0.0.1:8080/api/products", addProductForm, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          alert("Product Added");
          setFile(null);
          document.getElementById("thumbnail")?.setAttribute("value", "");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.errorMsg);
        document.getElementById("thumbnail")?.setAttribute("value", "");
      });
  };

  return (
    <>
      <div className="w-full m-auto p-8 bg-white shadow-lg rounded-b-md flex bg-gradient-to-tr from-gray-400 at-center to-stone-800 sm:flex-col smd:flex-row smd:justify-between">
        <div className="form">
          <h2 className="text-2xl font-semibold mb-4">Add a New Product</h2>
          <form
            onSubmit={handleSubmit}
            className="md:w-[400px] sm:w-full smm:items-center"
            name="addProductForm"
          >
            {/* Title */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600"
              >
                Product Name
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
                type="number"
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
                type="number"
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
        <div className="productAdded p-4 smm:ml-2 smm:max-w-[200px] smd:max-w-[230px] smd:p-0 md:max-w-[380px] self-start md:ml-5">
          {file && (
            <>
              <h4 className="tracking-wider md:text-lg md:mb-5">Motorbike Photo</h4>{" "}
              <img src={URL.createObjectURL(file)} alt="" className="w-full"/>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddProductForm;
