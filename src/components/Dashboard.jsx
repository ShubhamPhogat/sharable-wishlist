import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, List, LogIn, UserPlus } from "lucide-react";

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const userName = location.state?.userName;

  const navigateTo = (path) => {
    if (userId) {
      navigate(path, { state: { userId } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 mt-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">WishShare</h1>
          <p className="text-gray-600">
            Create and share wishlists with friends and family
          </p>
        </div>

        {userId ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Welcome back!
            </h2>

            <button
              onClick={() => navigateTo("/search")}
              className="w-full flex items-center justify-between p-4 bg-white border border-purple-200 rounded-lg shadow-sm hover:bg-purple-50 transition duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Find a Wishlist</h3>
                  <p className="text-sm text-gray-500">
                    Search for wishlists to join
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigateTo("/myWishlists")}
              className="w-full flex items-center justify-between p-4 bg-white border border-purple-200 rounded-lg shadow-sm hover:bg-purple-50 transition duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <List className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">My Wishlists</h3>
                  <p className="text-sm text-gray-500">
                    View your joined wishlists
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Get started with WishShare
            </h2>

            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-between p-4 bg-white border border-purple-200 rounded-lg shadow-sm hover:bg-purple-50 transition duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <LogIn className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Login</h3>
                  <p className="text-sm text-gray-500">
                    Sign in to your account
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full flex items-center justify-between p-4 bg-white border border-purple-200 rounded-lg shadow-sm hover:bg-purple-50 transition duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Sign Up</h3>
                  <p className="text-sm text-gray-500">Create a new account</p>
                </div>
              </div>
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          {userId ? (
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-800"
            >
              Not {userName}? Switch account
            </button>
          ) : (
            <p>Continue as guest to browse public wishlists</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
