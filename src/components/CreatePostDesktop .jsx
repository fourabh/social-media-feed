import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Firestore config
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ user }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // Array to store selected files
  const [previewUrls, setPreviewUrls] = useState([]); // Array for image previews
  const [base64Files, setBase64Files] = useState([]); // Array for base64 strings
  const navigate = useNavigate();
  console.log("user fro createPost ")
  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file input for multiple files
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Generate previews
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Convert files to base64
    try {
      const base64Promises = selectedFiles.map((file) => convertToBase64(file));
      const base64Results = await Promise.all(base64Promises);
      setBase64Files(base64Results);
    } catch (error) {
      console.error("Error converting files to base64:", error);
    }
  };

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    try {
      // Save post data to Firestore
      const postsRef = collection(db, "posts");
      await addDoc(postsRef, {
        text,
        imageUrls: base64Files, // Save base64 strings
        createdAt: Timestamp.fromDate(new Date()),
        userId: user?.uid || "anonymous",
        username: user?.name || "Guest",
        profilePic: user?.photoURL || "../../public/profilePicFeeds.png",
      });

      // Reset the form
      setText("");
      setFiles([]);
      setPreviewUrls([]);
      setBase64Files([]);
      alert("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4 max-w-md mx-auto md:max-w-lg">
      <header className="flex items-center gap-3 mb-4">
        <button className="text-2xl font-semibold" onClick={() => navigate("/")}>
          &larr;
        </button>
        <h1 className="text-lg md:text-xl font-semibold">New Post</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1">
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-36 p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black resize-none mb-6"
        />

        <div className="flex flex-col gap-4 mb-6">
          {/* File Upload */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <span className="text-red-500 text-lg">📁</span>
            <span>Choose files</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
            />
          </label>

          {/* Image Previews */}
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                onError={(e) => console.error("Preview failed for URL:", url)}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition duration-300"
        >
          CREATE
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
