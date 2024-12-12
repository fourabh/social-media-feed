import React from "react";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <img
        src="../../public/Login.png"
        alt="App Logo"
        className="w-60 h-800 "
      />
      {/* <div className=" bg-gray-100 rounded-t-[30px] shadow-lg p-6 flex flex-col items-center mb-5 -mt-20"> */}
        <img
          src="../../public/LoginText.png" 
          alt="Text Image"
          className="w-[260px] h-[90px] rounded-t-[30px] mb-8 bg-gray-100" 
        />

        <button
          onClick={() => alert("Login with Google")}
          className="w-full max-w-xs py-3 px-4 bg-gray-800 text-white font-semibold rounded-[30px] shadow-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center gap-3"
        >
          <img
            src="../../public/GoogleLogo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      {/* </div> */}
    </div>
  );
};

export default Login;
