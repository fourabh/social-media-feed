import React, { useState } from "react";
import { db, collection, addDoc } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreatePost = ({ user }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file changes (multiple images)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files selected:", files);

    setImages(files);
  };

  // Handle form submission (creating the post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && images.length === 0) return;

    try {
      setUploading(true);

      // Check if images array is populated
      if (images.length === 0) {
        console.log("No images to upload");
      } else {
        console.log("Uploading images:", images);
      }

      // Upload images to Firebase Storage and get download URLs
      const storage = getStorage();
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      // Add post to Firestore
      const postRef = collection(db, "posts");
      await addDoc(postRef, {
        text,
        images: uploadedImageUrls,
        createdAt: new Date(),
        userId: user?.uid,
        username: user?.displayName,
        profilePic: user?.photoURL,
      });

      // Reset states after posting
      setText("");
      setImages([]);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 p-4 md:p-6 max-w-md md:max-w-lg lg:max-w-2xl mx-auto rounded-lg shadow-md">
      {/* Header */}
      <header className="flex items-center gap-2 mb-4">
        <button className="text-2xl font-semibold">←</button>
        <h1 className="text-xl md:text-2xl font-semibold">New Post</h1>
      </header>

      {/* Post Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between flex-1"
      >
        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-32 md:h-40 p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black resize-none mb-6"
        />

        {/* File upload and media options */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Choose File */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <span className="text-red-500 text-xl">📁</span>
            <span>Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Video Upload */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <span className="text-blue-500 text-xl">🎥</span>
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Camera */}
          <button
            type="button"
            className="flex items-center gap-2 text-green-500 text-lg"
          >
            <span>📷</span>
            Camera
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-900 transition duration-300"
        >
          {uploading ? "Uploading..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
