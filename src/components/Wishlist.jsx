import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit, Trash } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import Toast from "./Toast";
const WishlistProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wishlistId = location.state?.wishlistId;
  const userId = location.state?.userId;

  const [wishlist, setWishlist] = useState({
    _id: "",
    name: "",
    ownerName: "",
    products: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [editProductData, setEditProductData] = useState({
    _id: "",
    name: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");

  // Fetch wishlist data when component mounts
  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/get/${wishlistId}`
      );
      console.log(response.data);
      setWishlist(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      showToastMessage("Failed to load wishlist data", "error");
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!productData.name || !productData.price) {
      showToastMessage("Please fill in all required fields", "error");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare form data for image upload
      const formData = new FormData();
      formData.append("userId", userId); // Replace with actual user ID
      formData.append("wishlistId", wishlistId);
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("description", productData.description);

      if (imageFile) {
        formData.append("productImage", imageFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        fetchWishlistData(); // Refresh the list
        setProductModalOpen(false);
        setProductData({
          name: "",
          price: "",
          imageUrl: "",
          description: "",
        });
        setImageFile(null);
        setImagePreview("");
        showToastMessage("Product added successfully", "success");
      } else {
        showToastMessage("Failed to add product", "error");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding product:", error);
      showToastMessage("Failed to add product", "error");
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editProductData.name || !editProductData.price) {
      showToastMessage("Please fill in all required fields", "error");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData(); // Create FormData object
      formData.append("userId", userId);
      formData.append("wishlistId", wishlistId);
      formData.append("productId", editProductData._id);
      formData.append("name", editProductData.name);
      formData.append("price", editProductData.price);
      formData.append("description", editProductData.description);

      if (editImageFile) {
        formData.append("productImage", editImageFile); // Append the file
      }

      console.log(formData);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/edit`,
        formData, // Send FormData instead of JSON
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.data.success) {
        fetchWishlistData();
        setEditModalOpen(false);
        // Reset form...
        showToastMessage("Product updated successfully", "success");
      } else {
        showToastMessage("Failed to update product", "error");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating product:", error);
      showToastMessage("Failed to update product", "error");
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/delete/${productId}`
      );

      if (response.data) {
        fetchWishlistData(); // Refresh the list
        showToastMessage("Product deleted successfully", "success");
      } else {
        showToastMessage("Failed to delete product", "error");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      showToastMessage("Failed to delete product", "error");
      setIsLoading(false);
    }
  };

  const openEditModal = (product) => {
    console.log("editing the prodcut", product);
    setEditProductData({
      _id: product._id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      imageUrl: product.imageUrl,
    });
    setEditImagePreview(product.imageUrl);
    setEditModalOpen(true);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductData({
      ...editProductData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, show: false }));
    }, 3000);
  };

  const closeToast = () => {
    setToast((prevToast) => ({ ...prevToast, show: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setProductModalOpen(true)}
            className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h1 className="text-2xl font-bold text-purple-700 mb-2">
                {wishlist.name}
              </h1>
              <p className="text-gray-600">Created by: {wishlist.ownerName}</p>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-purple-700">
                Wishlist Items
              </h2>
            </div>

            {wishlist.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                        >
                          <Edit className="w-4 h-4 text-purple-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition duration-300"
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {product.name}
                        </h3>
                        <span className="font-bold text-purple-700">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="border-t pt-3 text-xs text-gray-500">
                        Last edited by {product.editedBy.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <p className="text-gray-600">
                  No items in this wishlist yet. Add your first item!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setProductData({
            name: "",
            price: "",
            imageUrl: "",
            description: "",
          });
          setImageFile(null);
          setImagePreview("");
        }}
        title="Add New Item"
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="productName"
            >
              Item Name *
            </label>
            <input
              id="productName"
              name="name"
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="Item name"
              value={productData.name}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="productPrice"
            >
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="productPrice"
                name="price"
                type="text"
                className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                placeholder="0.00"
                value={productData.price}
                onChange={handleProductInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="productDescription"
            >
              Description
            </label>
            <textarea
              id="productDescription"
              name="description"
              rows="3"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="Describe the item"
              value={productData.description}
              onChange={handleProductInputChange}
            ></textarea>
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="productImage"
            >
              Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {imagePreview ? (
                <div className="space-y-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-700 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setProductModalOpen(false);
                setProductData({
                  name: "",
                  price: "",
                  imageUrl: "",
                  description: "",
                });
                setImageFile(null);
                setImagePreview("");
              }}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              disabled={isLoading}
              className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditProductData({
            id: "",
            name: "",
            price: "",
            imageUrl: "",
            description: "",
          });
          setEditImageFile(null);
          setEditImagePreview("");
        }}
        title="Edit Item"
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="editProductName"
            >
              Item Name *
            </label>
            <input
              id="editProductName"
              name="name"
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="Item name"
              value={editProductData.name}
              onChange={handleEditProductInputChange}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="editProductPrice"
            >
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="editProductPrice"
                name="price"
                type="text"
                className="w-full pl-8 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                placeholder="0.00"
                value={editProductData.price}
                onChange={handleEditProductInputChange}
                required
              />
            </div>
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="editProductDescription"
            >
              Description
            </label>
            <textarea
              id="editProductDescription"
              name="description"
              rows="3"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="Describe the item"
              value={editProductData.description}
              onChange={handleEditProductInputChange}
            ></textarea>
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="editProductImage"
            >
              Update Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              {editImagePreview ? (
                <div className="space-y-2 text-center">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditImageFile(null);
                      setEditImagePreview(editProductData.imageUrl);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove new image
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <img
                    src={editProductData.imageUrl}
                    alt="Current"
                    className="mx-auto h-32 w-auto object-contain"
                  />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="edit-file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-700 focus-within:outline-none"
                    >
                      <span>Upload new image</span>
                      <input
                        id="edit-file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleEditImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setEditModalOpen(false);
                setEditProductData({
                  id: "",
                  name: "",
                  price: "",
                  imageUrl: "",
                  description: "",
                });
                setEditImageFile(null);
                setEditImagePreview("");
              }}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleEditProduct}
              disabled={isLoading}
              className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update Item"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};
export default WishlistProductsPage;
