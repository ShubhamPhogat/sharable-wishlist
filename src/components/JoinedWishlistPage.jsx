import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "./Toast";

const JoinedWishlistsPage = () => {
  const [recentWishlists, setRecentWishlists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchRecentWishlists();
    }
  }, [userId]);

  const fetchRecentWishlists = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/wishlist/${userId}`
      );
      if (res) {
        console.log(res.data);
        setRecentWishlists(res.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      showToastMessage("Failed to load wishlists", "error");
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-purple-700">My Wishlists</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/search", { state: { userId } })}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
            >
              Find Another Wishlist
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-purple-700 hover:text-purple-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : recentWishlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWishlists.map((wishlist) => (
                <div
                  key={wishlist._id}
                  className="bg-white p-6 rounded-lg shadow-md border border-purple-100 hover:shadow-lg transition duration-300 cursor-pointer"
                  onClick={() =>
                    navigate(`/wishlist/${wishlist._id}`, {
                      state: { userId, wishlistId: wishlist._id },
                    })
                  }
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {wishlist.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Created by: {wishlist.ownerName}
                  </p>
                  <button className="w-full bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition duration-300">
                    View Wishlist
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven't joined any wishlists yet.
              </p>
              <button
                onClick={() => navigate("/search", { state: { userId } })}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
              >
                Find a Wishlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default JoinedWishlistsPage;
