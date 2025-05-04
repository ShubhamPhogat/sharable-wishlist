import { useState } from "react";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./components/AuthPage";
import WishlistProductsPage from "./components/Wishlist";
import SearchWishlistPage from "./components/SearchWishlistPage";
import DashboardPage from "./components/Dashboard";
import JoinedWishlistsPage from "./components/JoinedWishlistPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/myWishlists" element={<JoinedWishlistsPage />} />
          <Route path="/wishlist/:id" element={<WishlistProductsPage />} />
          <Route path="/search" element={<SearchWishlistPage />} />
          <Route path="/home" element={<DashboardPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
