import React from "react";
import { auth, googleProvider, signInWithPopup, signOut } from "../../firebase";
import { useUser } from "../context/UserContext";

const Login = () => {
  const { user, setUser } = useUser();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      alert(`Welcome, ${user.displayName}`);
    } catch (error) {
      console.error("Error during Google login:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {!user ? (
        <>
          <img src="../../public/Login.png" alt="App Logo" className="w-60" />
          <button
            onClick={handleGoogleLogin}
            className="w-full max-w-xs py-3 px-4 bg-gray-800 text-white font-semibold rounded-[30px] shadow-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center gap-3"
          >
            <img
              src="../../public/GoogleLogo.png"
              alt="Google Logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
