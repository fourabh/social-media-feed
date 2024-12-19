import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Assuming you have UserContext for global user state
import Feed from "./components/Feed";
import CreatePostDesktop from "./components/CreatePostDesktop ";
import Login from "./components/Login"; // Assuming you have a Login component
import UserProfile from "./components/UserProfile";

const App = () => {
  const { user } = useUser(); // Access user from context

  return (
    <Router>
      <div className="m-0 p-0">
        <div className="container">
          {/* Conditionally render based on the user state */}
          {user ? (
            <Routes>
              {/* Render Feed when logged in */}
              <Route path="/" element={<Feed />} />
              {/* Add route for CreatePost */}
              <Route path="/create-post" element={<CreatePostDesktop user={user} />} />

              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          ) : (
            <Login />
          )}
        </div>
        
        {/* Uncomment these when needed */}
        {/* <CreatePostDesktop /> */}
        {/* <UserProfile /> */}
        {/* <CreatePostMobile /> */}
      </div>
    </Router>
  );
};

export default App;
