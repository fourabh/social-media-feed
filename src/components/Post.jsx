import React from "react";

const Post = ({ post }) => {
  return (
    <div className="bg-purple-50 p-4 rounded-2xl shadow">
      {/* User Info */}
      <div className="flex items-center mb-3">
        <img
          src={post.profilePic || "../../public/user1.png"}
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
      {post.imageUrl && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <img
            src={post.imageUrl}
            alt="Post Content"
            className="rounded-lg object-cover w-full h-32"
          />
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition">
          ❤️ 67
        </button>
        <button className="text-sm text-gray-600">
          <img src="../../public/shareButton.png" alt="Share" />
        </button>
      </div>
    </div>
  );
};

export default Post;
