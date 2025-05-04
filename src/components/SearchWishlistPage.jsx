import React, { useState } from "react";
import { Search, Plus, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Toast from "./Toast";

const SearchWishlistPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  // At the top of the component

  // Then use this userId in your API calls

  const [wishlistData, setWishlistData] = useState({
    name: "",
    ownerName: "",
    email: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [createdWishlistId, setCreatedWishlistId] = useState("");
  const [showWishlistCreatedModal, setShowWishlistCreatedModal] =
    useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const searchWishlist = async () => {
    if (!searchQuery.trim()) {
      showToastMessage("Please enter a wishlist ID", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/get/${searchQuery}`
      );

      if (response.data) {
        setSearchResults(response.data);
      } else {
        showToastMessage("Wishlist not found", "error");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching wishlist:", error);
      showToastMessage("Failed to search for wishlist", "error");
      setIsLoading(false);
    }
  };

  const createWishlist = async () => {
    if (!wishlistData.name || !wishlistData.ownerName || !wishlistData.email) {
      showToastMessage("Please fill in all fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      console.log(wishlistData);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/create`,
        { ...wishlistData, userId }
      );

      setCreatedWishlistId(res.data._id);
      setModalOpen(false);
      setShowWishlistCreatedModal(true);
      showToastMessage("Wishlist created successfully!", "success");
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating wishlist:", error);
      showToastMessage("Failed to create wishlist", "error");
      setIsLoading(false);
    }
  };

  const joinWishlist = async (wishlistId) => {
    try {
      setIsLoading(true);
      // Mock API call
      console.log(wishlistId, userId);
      const res = axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/join`,
        { wishListId: wishlistId, userId }
      );

      if (res) {
        showToastMessage("Successfully joined wishlist!", "success");
        setIsLoading(false);
        navigate("/myWishlists", { state: { userId } });
      } else {
        console.error("Error joining wishlist:", error);
        showToastMessage("Failed to join wishlist", "error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error joining wishlist:", error);
      showToastMessage("Failed to join wishlist", "error");
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, show: false }));
    }, 3000);
  };

  const closeToast = () => {
    setToast((prevToast) => ({ ...prevToast, show: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWishlistData({
      ...wishlistData,
      [name]: value,
    });
  };

  const copyWishlistId = () => {
    navigator.clipboard
      .writeText(createdWishlistId)
      .then(() => {
        showToastMessage("Wishlist ID copied to clipboard!", "success");
      })
      .catch(() => {
        showToastMessage("Failed to copy wishlist ID", "error");
      });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-purple-700">
            Find a Wishlist
          </h1>
          <button
            onClick={() => window.history.back()}
            className="text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                placeholder="Enter wishlist ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={searchWishlist}
              disabled={isLoading}
              className={`bg-purple-600 text-white px-4 py-2.5 rounded-r-lg font-medium hover:bg-purple-700 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Search Results
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {searchResults.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Created by: {searchResults.ownerName}
                  </p>
                  <button
                    onClick={() => joinWishlist(searchResults._id)}
                    disabled={isLoading}
                    className={`w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-300 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Joining..." : "Join Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Or create your own wishlist to share with friends
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Create Wishlist Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Wishlist"
      >
        <div className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="wishlistName"
            >
              Wishlist Name
            </label>
            <input
              id="wishlistName"
              name="name"
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="e.g., Birthday Wishlist"
              value={wishlistData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="ownerName"
            >
              Your Name
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="Your name"
              value={wishlistData.ownerName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
              placeholder="your@email.com"
              value={wishlistData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setModalOpen(false)}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={createWishlist}
              disabled={isLoading}
              className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create Wishlist"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Wishlist Created Success Modal */}
      <Modal
        isOpen={showWishlistCreatedModal}
        onClose={() => setShowWishlistCreatedModal(false)}
        title="Wishlist Created!"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <p className="text-gray-700">
            Your wishlist has been created successfully!
          </p>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
            <span className="text-gray-700 font-medium">
              {createdWishlistId}
            </span>
            <button
              onClick={copyWishlistId}
              className="text-purple-600 hover:text-purple-800"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Share this ID with friends so they can join your wishlist!
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                navigate("/myWishlists", { state: { userId } });
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              View My Wishlist
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

export default SearchWishlistPage;
