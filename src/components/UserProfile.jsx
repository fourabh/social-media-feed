import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { db } from "../../firebase"; // Firestore config
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user,setUser } = useUser();
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editedName, setEditedName] = useState(user?.name || ""); // Track editable name
  const [editedBio, setEditedBio] = useState(
    "Just someone who loves designing, sketching, and finding beauty in the little things 💕"
  ); // Track editable bio
  const navigate = useNavigate();
  console.log("User from UserProfile:", user);

  useEffect(() => {
    if (!user || !user.uid) {
      console.warn("User or user.uid is undefined");
      return;
    }

    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserPosts(postsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);

      // Check if the document exists
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the document doesn't exist, create it
        await setDoc(userDocRef, {
          name: editedName,
          bio: editedBio,
        });
        alert("Profile created and updated successfully!");
      } else {
        // If the document exists, update it
        await updateDoc(userDocRef, {
          name: editedName,
          bio: editedBio,
        });
        setUser((prev) => ({
          ...prev,
          name: editedName,
          bio: editedBio,
        }));
        alert("Profile updated successfully!");
      }
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Header Section */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-pink-500 to-purple-500">
        {/* Profile Picture */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center px-4">
        <button
          onClick={handleEditClick}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 mb-2 shadow-sm hover:bg-gray-100"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        {isEditing ? (
          <>
            {/* Editable Name */}
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full max-w-[400px] p-2 border border-gray-300 rounded-lg mb-2"
            />
            {/* Editable Bio */}
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              className="w-full max-w-[400px] p-2 border border-gray-300 rounded-lg mb-2"
            />
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-full mt-4"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            {/* Display Name and Bio */}
            <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
            <p className="text-gray-500 mt-1 text-sm">
              {user.bio ||
                "Just someone who loves designing, sketching, and finding beauty in the little things 💕"}
            </p>
          </>
        )}
      </div>

      {/* My Posts Section */}
      <div className="w-full max-w-[400px] mt-6 px-4">
        <h3 className="text-lg font-bold mb-2">My Posts</h3>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {userPosts.map((post) => (
              <div key={post.id}>
                <img
                  src={post.imageUrls?.[0] || "https://via.placeholder.com/150"}
                  alt={post.text}
                  className="w-full h-36 object-cover rounded-lg shadow-md"
                />
                <p className="text-sm font-medium mt-1">{post.text}</p>
                <p className="text-xs text-gray-500">{post.likes || 0} ❤️</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No posts yet.</p>
        )}
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-lg" onClick={()=>navigate("/create-post")}>
        +
      </button>
    </div>
  );
};

export default UserProfile;
