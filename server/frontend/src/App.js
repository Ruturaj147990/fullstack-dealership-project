import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const renderComponent = () => {
    const path = currentPath;

    if (path.startsWith("/dealer/")) {
      const parts = path.split("/").filter(Boolean);
      const id = parts[1];
      return <Dealer id={id} />;
    }

    if (path.startsWith("/postreview/")) {
      const parts = path.split("/").filter(Boolean);
      const id = parts[1];
      return <PostReview id={id} />;
    }

    if (path === "/login" || path === "/login/") {
      return <Login />;
    }

    if (path === "/register" || path === "/register/") {
      return <Register />;
    }

    // Default to Dealers list
    return <Dealers />;
  };

  return (
    <div className="app_root">
      <Header />
      <main className="app_main">{renderComponent()}</main>
      <footer className="footer">
        &copy; 2026 Cars Dealership — Full-Stack Web Application. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
