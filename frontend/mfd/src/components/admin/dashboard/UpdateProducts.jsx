import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../../actions/productActions";
import { clearError, clearProductUpdated } from "../../../slices/productSlice";

const UpdateProducts = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState([]); // holds new image File(s)
  const [imageCleared, setImageCleared] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]); // holds URLs for preview

  const { loading, isProductUpdated, error, product } = useSelector(
    (state) => state.productState
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id: productId } = useParams();

  const categories = [
    "Milk",
    "Curd",
    "Ice-Cream",
    "Panneer",
    "Yoghurt",
    "Ghee",
    "Butter",
    "Yoghurt Drink",
  ];

  // Handle image input change
  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    // Reset both new image and preview arrays
    setImage([]);
    setImagesPreview([]);
    setImageCleared(false); // if a new image is selected, we are not in 'cleared' state anymore

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImage((oldArray) => [...oldArray, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit the form data
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);

    // Append new image file(s) if any
    image.forEach((img) => {
      formData.append("image", img);
    });

    // Pass the imageCleared flag to the backend so it knows to remove the existing image if needed
    formData.append("imageCleared", imageCleared);

    dispatch(updateProduct(product._id, formData));
  };

  // Remove a selected image from preview and from File array
  const removeImage = (indexToRemove) => {
    const updatedImages = image.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = imagesPreview.filter(
      (_, index) => index !== indexToRemove
    );
    setImage(updatedImages);
    setImagesPreview(updatedPreviews);
    setImageCleared(true);

    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Fetch product details when component loads
  useEffect(() => {
    dispatch(getProduct(productId));
  }, [dispatch, productId]);

  // Handle success and error messages
  useEffect(() => {
    if (isProductUpdated) {
      toast.success("Product Updated Successfully!", {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearProductUpdated()),
      });
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearError()),
      });
    }
  }, [isProductUpdated, error, dispatch, navigate]);

  // Set form fields from fetched product.
  // If imageCleared is true, do not restore previews.
  useEffect(() => {
    if (product && product._id) {
      setName(product.name || "");
      setPrice(product.price || "");
      setStock(product.stock || 0);
      setDescription(product.description || "");
      setCategory(product.category || "");

      // Only set the image preview if the user hasn't cleared the image during update.
      if (!imageCleared) {
        if (Array.isArray(product.image)) {
          const previewImages = product.image.map((img) => img.image);
          setImagesPreview(previewImages);
        } else if (typeof product.image === "string" && product.image !== "") {
          setImagesPreview([product.image]);
        } else {
          setImagesPreview([]);
        }
      }
    }
  }, [product, imageCleared]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
          showSidebar
            ? "absolute top-0 left-0 translate-x-0"
            : "absolute -translate-x-full"
        } md:translate-x-0`}
        style={{ minHeight: "100vh" }}
      >
        <Sidebar />
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
          <h1 className="text-xl font-bold">Update Product</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex-grow flex justify-center">
          <form
            onSubmit={submitHandler}
            encType="multipart/form-data"
            className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Update Product
            </h2>

            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label
                htmlFor="price_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="text"
                id="price_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label
                htmlFor="description_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description_field"
                rows="4"
                className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category Field */}
            <div className="mb-4">
              <label
                htmlFor="category_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Field */}
            <div className="mb-4">
              <label
                htmlFor="stock_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* Image Field */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Images
              </label>
              <input
                type="file"
                name="product_image"
                className="w-full"
                id="customFile"
                onChange={onImagesChange}
                accept="image/*"
                ref={fileInputRef}
                multiple={false}
              />

              {/* Preview */}
              <div className="flex mt-3 flex-wrap gap-2">
                {imagesPreview.length > 0 &&
                  imagesPreview.map((img, index) => (
                    <div key={index} className="relative inline-block m-2">
                      <img
                        src={img}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
              }`}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProducts;
