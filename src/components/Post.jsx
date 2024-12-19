import React, { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // Firestore setup
import { useUser } from "../context/UserContext"; // Assuming a UserContext is available

const Post = ({ post }) => {
  const { user } = useUser(); // Get the current logged-in user
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Check if the user has already liked the post
  useEffect(() => {
    if (user && post.likedBy?.includes(user.uid)) {
      setIsLiked(true);
    }
  }, [user, post.likedBy]);

  const handleToggleLike = async () => {
    if (!user) {
      alert("You need to log in to like posts.");
      return;
    }

    const postRef = doc(db, "posts", post.id);

    try {
      if (isLiked) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid), // Remove user ID from likedBy array
        });
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid), // Add user ID to likedBy array
        });
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-2xl shadow">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <img
          src={post.profilePic || "/user1.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h4 className="text-sm font-semibold text-gray-800">
            {post.username || "Guest User"}
          </h4>
          <p className="text-xs text-gray-500">
            {post.createdAt
              ? new Date(post.createdAt.seconds * 1000).toLocaleString()
              : "Just now"}
          </p>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-sm text-gray-700 mb-3">
        {post.text}
        <span className="text-blue-500"> {post.hashtags || ""}</span>
      </p>

      {/* Post Images */}
      {post.imageUrls &&
        post.imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Post Image ${index}`}
            className="rounded-lg object-cover w-full h-32"
          />
        ))}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between">
        <button
          className={`flex items-center gap-1 text-sm ${
            isLiked ? "text-red-500" : "text-gray-600"
          } hover:text-red-500 transition`}
          onClick={handleToggleLike}
        >
          ❤️ {likes}
        </button>
        <button className="text-sm text-gray-600">
          <img src="/shareButton.png" alt="Share" />
        </button>
      </div>
    </div>
  );
};

export default Post;
