import React from "react";
import { useUser } from "../context/UserContext";


const UserProfile = () => {
  const { user } = useUser();

  if (!user) return null; // Don't render if no user is logged in.
  console.log("USER FROM USERPROFILE:",user)
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-pink-500 to-purple-500">
        {/* Profile Picture */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
          <img
            src={user.photoURL} // Replace with actual profile image URL
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center px-4">
        <button className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 mb-2 shadow-sm hover:bg-gray-100">
          Edit Profile
        </button>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Just someone who loves designing, sketching, and finding beauty in the
          little things 💕
        </p>
      </div>

      {/* My Posts Section */}
      <div className="w-full max-w-[400px] mt-6 px-4">
        <h3 className="text-lg font-bold mb-2">My Posts</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Post 1 */}
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Design meet"
              className="w-full h-36 object-cover rounded-lg shadow-md"
            />
            <span className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow">
              1/2
            </span>
            <p className="text-sm font-medium mt-1">Design meet</p>
            <p className="text-xs text-gray-500">67 ❤️</p>
          </div>

          {/* Post 2 */}
          <div>
            <img
              src="https://via.placeholder.com/150"
              alt="Working on a B2B..."
              className="w-full h-36 object-cover rounded-lg shadow-md"
            />
            <p className="text-sm font-medium mt-1">Working on a B2B...</p>
            <p className="text-xs text-gray-500">40 ❤️</p>
          </div>

          {/* Post 3 - Full width */}
          <div className="col-span-2">
            <img
              src="https://via.placeholder.com/150"
              alt="Parachute ❤️"
              className="w-full h-36 object-cover rounded-lg shadow-md"
            />
            <p className="text-sm font-medium mt-1">Parachute ❤️</p>
            <p className="text-xs text-gray-500">65 ❤️</p>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-lg">
        +
      </button>
    </div>
  );
};

export default UserProfile;
