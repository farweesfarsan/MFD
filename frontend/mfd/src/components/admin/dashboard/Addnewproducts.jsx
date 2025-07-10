// import React, { useEffect, useState, useRef } from "react";
// import Sidebar from "../Sidebar";
// import { Menu } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { createNewProduct } from "../../../actions/productActions";
// import { clearError, clearProductCreater } from "../../../slices/productSlice";
// import { X } from "lucide-react";

// const Addnewproducts = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [stock, setStock] = useState(0);
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);

//   const { loading, isProductCreated, error } = useSelector(
//     (state) => state.productState
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const fileInputRef = useRef(null);

//   const categories = [
//     "Milk",
//     "Curd",
//     "Ice-Cream",
//     "Panneer",
//     "Yoghurt",
//     "Ghee",
//     "Butter",
//     "Yoghurt Drink",
//   ];

//   const onImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImage([]);
//     setImagesPreview([]);

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImagesPreview((oldArray) => [...oldArray, reader.result]);
//           setImage((oldArray) => [...oldArray, file]);
//         }
//       };

//       reader.readAsDataURL(file);
//     });
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append("name", name);
//     formData.append("price", price);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("stock", stock);

//     image.forEach((img) => {
//       formData.append("image", img);
//     });

//     dispatch(createNewProduct(formData));
//   };

//   const removeImage = (indexToRemove) => {
//     const updatedImages = image.filter((_, index) => index !== indexToRemove);
//     const updatedPreviews = imagesPreview.filter(
//       (_, index) => index !== indexToRemove
//     );

//     setImage(updatedImages);
//     setImagesPreview(updatedPreviews);

//     // Clear file input if all images are removed
//     if (updatedImages.length === 0 && fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   useEffect(() => {
//     if (isProductCreated) {
//       toast.success("Product Created Successfully!", {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearProductCreater()),
//       });
//       navigate("/admin/dashboard");
//     }

//     if (error) {
//       toast.error(error, {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearError()),
//       });
//     }
//   }, [isProductCreated, error, dispatch, navigate]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
//           showSidebar
//             ? "absolute top-0 left-0 translate-x-0"
//             : "absolute -translate-x-full"
//         } md:translate-x-0`}
//         style={{ minHeight: "100vh" }}
//       >
//         <Sidebar />
//       </div>

//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Mobile header */}
//         <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
//           <h1 className="text-xl font-bold">Add New Product</h1>
//           <button
//             className="p-2 rounded bg-gray-200"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6 flex-grow flex justify-center">
//           <form
//             onSubmit={submitHandler}
//             encType="multipart/form-data"
//             className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md"
//           >
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//               New Product
//             </h2>

//             {/* Name */}
//             <div className="mb-4">
//               <label
//                 htmlFor="name_field"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name_field"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             {/* Price */}
//             <div className="mb-4">
//               <label
//                 htmlFor="price_field"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Price
//               </label>
//               <input
//                 type="text"
//                 id="price_field"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>

//             {/* Description */}
//             <div className="mb-4">
//               <label
//                 htmlFor="description_field"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Description
//               </label>
//               <textarea
//                 id="description_field"
//                 rows="4"
//                 className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             {/* Category */}
//             <div className="mb-4">
//               <label
//                 htmlFor="category_field"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Category
//               </label>
//               <select
//                 id="category_field"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="">Select</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Stock */}
//             <div className="mb-4">
//               <label
//                 htmlFor="stock_field"
//                 className="block mb-2 text-sm font-medium text-gray-700"
//               >
//                 Stock
//               </label>
//               <input
//                 type="number"
//                 id="stock_field"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//               />
//             </div>

//             {/* Images */}
//             <div className="mb-4">
//               <label className="block mb-2 text-sm font-medium text-gray-700">
//                 Images
//               </label>
//               <input
//                 type="file"
//                 name="product_image"
//                 className="w-full"
//                 id="customFile"
//                 onChange={onImagesChange}
//                 accept="image/*"
//                 ref={fileInputRef}
//                 multiple={false}
//               />

//               <div className="flex mt-3 flex-wrap gap-2">
//                 {imagesPreview.map((img, index) => (
//                   <div key={index} className="relative inline-block m-2">
//                     <img
//                       src={img}
//                       alt="Preview"
//                       className="w-20 h-20 object-cover rounded border"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(index)}
//                       className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg font-medium transition duration-200 
//               ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                   : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
//               }`}
//             >
//               {loading ? "Creating..." : "Create Product"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addnewproducts;
// import React, { useEffect, useState, useRef } from "react";
// import Sidebar from "../Sidebar";
// import { Menu, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { createNewProduct } from "../../../actions/productActions";
// import { clearError, clearProductCreater } from "../../../slices/productSlice";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const Addnewproducts = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [image, setImage] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);
//   const fileInputRef = useRef(null);

//   const { loading, isProductCreated, error } = useSelector(
//     (state) => state.productState
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const categories = [
//     "Milk",
//     "Curd",
//     "Ice-Cream",
//     "Panneer",
//     "Yoghurt",
//     "Ghee",
//     "Butter",
//     "Yoghurt Drink",
//   ];

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Product name is required"),
//     price: Yup.number()
//       .typeError("Price must be a number")
//       .required("Price is required"),
//     description: Yup.string().required("Description is required"),
//     category: Yup.string().required("Category is required"),
//     stock: Yup.number()
//       .typeError("Stock must be a number")
//       .required("Stock is required"),
//   });

//   const onImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImage([]);
//     setImagesPreview([]);

//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImagesPreview((oldArray) => [...oldArray, reader.result]);
//           setImage((oldArray) => [...oldArray, file]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (indexToRemove) => {
//     const updatedImages = image.filter((_, index) => index !== indexToRemove);
//     const updatedPreviews = imagesPreview.filter(
//       (_, index) => index !== indexToRemove
//     );
//     setImage(updatedImages);
//     setImagesPreview(updatedPreviews);

//     if (updatedImages.length === 0 && fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   useEffect(() => {
//     if (isProductCreated) {
//       toast.success("Product Created Successfully!", {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearProductCreater()),
//       });
//       navigate("/admin/dashboard");
//     }

//     if (error) {
//       toast.error(error, {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearError()),
//       });
//     }
//   }, [isProductCreated, error, dispatch, navigate]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
//           showSidebar
//             ? "absolute top-0 left-0 translate-x-0"
//             : "absolute -translate-x-full"
//         } md:translate-x-0`}
//         style={{ minHeight: "100vh" }}
//       >
//         <Sidebar />
//       </div>

//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Mobile header */}
//         <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
//           <h1 className="text-xl font-bold">Add New Product</h1>
//           <button
//             className="p-2 rounded bg-gray-200"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6 flex-grow flex justify-center">
//           <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//               New Product
//             </h2>

//             <Formik
//               initialValues={{
//                 name: "",
//                 price: "",
//                 description: "",
//                 category: "",
//                 stock: "",
//               }}
//               validationSchema={validationSchema}
//               onSubmit={(values) => {
//                 const formData = new FormData();
//                 formData.append("name", values.name);
//                 formData.append("price", values.price);
//                 formData.append("description", values.description);
//                 formData.append("category", values.category);
//                 formData.append("stock", values.stock);
//                 image.forEach((img) => {
//                   formData.append("image", img);
//                 });
//                 dispatch(createNewProduct(formData));
//               }}
//             >
//               {() => (
//                 <Form encType="multipart/form-data" className="space-y-5">
//                   {/* Name */}
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Name
//                     </label>
//                     <Field
//                       type="text"
//                       name="name"
//                       id="name"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="name"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Price */}
//                   <div>
//                     <label
//                       htmlFor="price"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Price
//                     </label>
//                     <Field
//                       type="text"
//                       name="price"
//                       id="price"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="price"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div>
//                     <label
//                       htmlFor="description"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Description
//                     </label>
//                     <Field
//                       as="textarea"
//                       name="description"
//                       id="description"
//                       rows="4"
//                       className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label
//                       htmlFor="category"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Category
//                     </label>
//                     <Field
//                       as="select"
//                       name="category"
//                       id="category"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     >
//                       <option value="">Select</option>
//                       {categories.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </Field>
//                     <ErrorMessage
//                       name="category"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Stock */}
//                   <div>
//                     <label
//                       htmlFor="stock"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Stock
//                     </label>
//                     <Field
//                       type="number"
//                       name="stock"
//                       id="stock"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="stock"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Images Upload */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Images
//                     </label>
//                     <input
//                       type="file"
//                       name="product_image"
//                       className="w-full"
//                       id="customFile"
//                       onChange={onImagesChange}
//                       accept="image/*"
//                       ref={fileInputRef}
//                       multiple={false}
//                     />
//                     <div className="flex mt-3 flex-wrap gap-2">
//                       {imagesPreview.map((img, index) => (
//                         <div key={index} className="relative inline-block m-2">
//                           <img
//                             src={img}
//                             alt="Preview"
//                             className="w-20 h-20 object-cover rounded border"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full py-3 rounded-lg font-medium transition duration-200 
//                   ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                       : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
//                   }`}
//                   >
//                     {loading ? "Creating..." : "Create Product"}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addnewproducts;
// import React, { useEffect, useState, useRef } from "react";
// import Sidebar from "../Sidebar";
// import { Menu, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { createNewProduct } from "../../../actions/productActions";
// import { clearError, clearProductCreater } from "../../../slices/productSlice";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// const Addnewproducts = () => {
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [image, setImage] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);
//   const fileInputRef = useRef(null);

//   const { loading, isProductCreated, error } = useSelector(
//     (state) => state.productState
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const categories = [
//     "Milk",
//     "Curd",
//     "Ice-Cream",
//     "Panneer",
//     "Yoghurt",
//     "Ghee",
//     "Butter",
//     "Yoghurt Drink",
//   ];

//   const validationSchema = Yup.object({
//     name: Yup.string().required("Product name is required"),
//     price: Yup.number()
//       .typeError("Price must be a number")
//       .required("Price is required"),
//     description: Yup.string().required("Description is required"),
//     category: Yup.string().required("Category is required"),
//     stock: Yup.number()
//       .typeError("Stock must be a number")
//       .required("Stock is required"),
//   });

//   const onImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImage([]);
//     setImagesPreview([]);

//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImagesPreview((oldArray) => [...oldArray, reader.result]);
//           setImage((oldArray) => [...oldArray, file]);
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (indexToRemove) => {
//     const updatedImages = image.filter((_, index) => index !== indexToRemove);
//     const updatedPreviews = imagesPreview.filter(
//       (_, index) => index !== indexToRemove
//     );
//     setImage(updatedImages);
//     setImagesPreview(updatedPreviews);

//     if (updatedImages.length === 0 && fileInputRef.current) {
//       fileInputRef.current.value = null;
//     }
//   };

//   useEffect(() => {
//     if (isProductCreated) {
//       toast.success("Product Created Successfully!", {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearProductCreater()),
//       });
//       navigate("/admin/dashboard");
//     }

//     if (error) {
//       toast.error(error, {
//         position: "bottom-center",
//         theme: "dark",
//         onOpen: () => dispatch(clearError()),
//       });
//     }
//   }, [isProductCreated, error, dispatch, navigate]);

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div
//         className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
//           showSidebar
//             ? "absolute top-0 left-0 translate-x-0"
//             : "absolute -translate-x-full"
//         } md:translate-x-0`}
//         style={{ minHeight: "100vh" }}
//       >
//         <Sidebar />
//       </div>

//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Mobile header */}
//         <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
//           <h1 className="text-xl font-bold">Add New Product</h1>
//           <button
//             className="p-2 rounded bg-gray-200"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6 flex-grow flex justify-center">
//           <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//               New Product
//             </h2>

//             <Formik
//               initialValues={{
//                 name: "",
//                 price: "",
//                 description: "",
//                 category: "",
//                 stock: "",
//               }}
//               validationSchema={validationSchema}
//               onSubmit={(values) => {
//                 const formData = new FormData();
//                 formData.append("name", values.name);
//                 formData.append("price", values.price);
//                 formData.append("description", values.description);
//                 formData.append("category", values.category);
//                 formData.append("stock", values.stock);
//                 image.forEach((img) => {
//                   formData.append("image", img);
//                 });
//                 dispatch(createNewProduct(formData));
//               }}
//             >
//               {() => (
//                 <Form encType="multipart/form-data" className="space-y-5">
//                   {/* Name */}
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Name
//                     </label>
//                     <Field
//                       type="text"
//                       name="name"
//                       id="name"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="name"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Price */}
//                   <div>
//                     <label
//                       htmlFor="price"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Price
//                     </label>
//                     <Field
//                       type="text"
//                       name="price"
//                       id="price"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="price"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Description */}
//                   <div>
//                     <label
//                       htmlFor="description"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Description
//                     </label>
//                     <Field
//                       as="textarea"
//                       name="description"
//                       id="description"
//                       rows="4"
//                       className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label
//                       htmlFor="category"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Category
//                     </label>
//                     <Field
//                       as="select"
//                       name="category"
//                       id="category"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     >
//                       <option value="">Select</option>
//                       {categories.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </Field>
//                     <ErrorMessage
//                       name="category"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Stock */}
//                   <div>
//                     <label
//                       htmlFor="stock"
//                       className="block mb-1 text-sm font-medium text-gray-700"
//                     >
//                       Stock
//                     </label>
//                     <Field
//                       type="number"
//                       name="stock"
//                       id="stock"
//                       className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
//                     />
//                     <ErrorMessage
//                       name="stock"
//                       component="div"
//                       className="text-red-500 text-sm"
//                     />
//                   </div>

//                   {/* Images Upload */}
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Images
//                     </label>
//                     <input
//                       type="file"
//                       name="product_image"
//                       className="w-full"
//                       id="customFile"
//                       onChange={onImagesChange}
//                       accept="image/*"
//                       ref={fileInputRef}
//                       multiple={false}
//                     />
//                     <div className="flex mt-3 flex-wrap gap-2">
//                       {imagesPreview.map((img, index) => (
//                         <div key={index} className="relative inline-block m-2">
//                           <img
//                             src={img}
//                             alt="Preview"
//                             className="w-20 h-20 object-cover rounded border"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
//                           >
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full py-3 rounded-lg font-medium transition duration-200 
//                   ${
//                     loading
//                       ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                       : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
//                   }`}
//                   >
//                     {loading ? "Creating..." : "Create Product"}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Addnewproducts;
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createNewProduct } from "../../../actions/productActions";
import { clearError, clearProductCreater } from "../../../slices/productSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Addnewproducts = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [image, setImage] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fileInputRef = useRef(null);

  const { loading, isProductCreated, error } = useSelector(
    (state) => state.productState
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    stock: Yup.number()
      .typeError("Stock must be a number")
      .required("Stock is required"),
  });

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImage([]);
    setImagesPreview([]);

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

  const removeImage = (indexToRemove) => {
    const updatedImages = image.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = imagesPreview.filter(
      (_, index) => index !== indexToRemove
    );
    setImage(updatedImages);
    setImagesPreview(updatedPreviews);

    if (updatedImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  useEffect(() => {
    if (isProductCreated) {
      toast.success("Product Created Successfully!", {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearProductCreater()),
      });
      navigate("/admin/dashboard");
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearError()),
      });
    }
  }, [isProductCreated, error, dispatch, navigate]);

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
        <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
          <h1 className="text-xl font-bold">Add New Product</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-grow flex justify-center">
          <div className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              New Product
            </h2>

            <Formik
              initialValues={{
                name: "",
                price: "",
                description: "",
                category: "",
                stock: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                // Custom validation: Product name must relate to allowed categories
                const validCategories = [
                  "Milk",
                  "Curd",
                  "Ice-Cream",
                  "Panneer",
                  "Yoghurt",
                  "Ghee",
                  "Butter",
                  "Yoghurt Drink",
                ];

                const normalizedName = values.name.toLowerCase();

                const isRelated = validCategories.some((cat) =>
                  normalizedName.includes(cat.toLowerCase().replace(/[- ]/g, ""))
                );

                if (!isRelated) {
                  toast.error(
                    "Product name should relate to Milk, Curd, Yoghurt, etc.",
                    {
                      position: "bottom-center",
                      theme: "dark",
                    }
                  );
                  return;
                }

                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("price", values.price);
                formData.append("description", values.description);
                formData.append("category", values.category);
                formData.append("stock", values.stock);
                image.forEach((img) => {
                  formData.append("image", img);
                });

                dispatch(createNewProduct(formData));
              }}
            >
              {() => (
                <Form encType="multipart/form-data" className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <Field
                      type="text"
                      name="price"
                      id="price"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      id="category"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Stock
                    </label>
                    <Field
                      type="number"
                      name="stock"
                      id="stock"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="stock"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Images Upload */}
                  <div>
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
                    <div className="flex mt-3 flex-wrap gap-2">
                      {imagesPreview.map((img, index) => (
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
                    className={`w-full py-3 rounded-lg font-medium transition duration-200 
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed text-gray-700"
                      : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
                  }`}
                  >
                    {loading ? "Creating..." : "Create Product"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addnewproducts;



