import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("User Info:", decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="signin-page">
      <h2>Sign In</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
      />
    </div>
  );
};

export default SignIn;
