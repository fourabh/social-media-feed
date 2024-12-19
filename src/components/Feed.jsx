import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Firestore config
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Firebase Authentication
import Post from "./Post";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useUser(); // Access user from context
  const navigate = useNavigate();

  useEffect(() => {
    const postsRef = collection(db, "posts"); // Reference to "posts" collection
    const q = query(postsRef, orderBy("createdAt", "desc")); // Fetch posts in descending order

    // Real-time listener for posts
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user from context
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

   // Navigate to CreatePost page when the floating button is clicked
   const handleCreatePostClick = () => {
    navigate("/create-post"); // Navigate to CreatePost page
  };

  return (
    <div className="relative flex flex-col items-center bg-gray-100 min-h-screen p-4">
      {/* Logout Button - Top Right */}
      {user && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      )}

      {/* Profile Info */}
      <div className="flex flex-col items-center w-full max-w-md mt-8">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile Pic"
            className="w-16 h-16 rounded-full mb-2"
          />
        )}
        <p className="text-sm text-gray-500">Welcome Back,</p>
        <h3 className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline" onClick={()=>navigate("/profile")} >
          {user?.name || "User"}
        </h3>
      </div>

      {/* Feeds Info */}
      <div className="w-full max-w-md mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Feeds</h1>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-gray-500 text-center">No posts available.</p>
          )}
        </div>
      </div>
       {/* Floating Add Button */}
       <button onClick={handleCreatePostClick} className="fixed bottom-8 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-lg">
        +
      </button>
    </div>
  );
};

export default Feed;
