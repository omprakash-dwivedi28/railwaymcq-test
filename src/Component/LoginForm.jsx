import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import { useInitialContext } from "../context/InitialContext";
import "../Component/css/LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);

  const navigate = useNavigate();

  const { adminloginData, adminloginInfo } = useInitialContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://railwaymcq.com/student/user_login_api.php",
        {
          username: username,
          password: password,
        }
      );
      const data = response.data;
      setAdmin(response.data.success);

      if (response.data.userData.login_type === "admin") {
        localStorage.setItem("admin", JSON.stringify(response.data.userData));

        adminloginInfo(response.data);
      } else if (response.data.userData.login_type === "user") {
        localStorage.setItem("user", JSON.stringify(response.data.userData));
        adminloginInfo(response.data);
      } else if (response.data.userData.login_type === "partener") {
        localStorage.setItem(
          "partener",
          JSON.stringify(response.data.userData)
        );
        adminloginInfo(response.data);
      } else {
        console.log("Return responsive data through login" + response.data);
        setError("Invalid Login Id & Password or Unauthorise user");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  const handlalert = () => {
    navigate("/SignUpUser");
  };

  useEffect(() => {
    if (adminloginData?.userData?.login_type === "admin") {
      navigate("/AdminPage");
    } else if (adminloginData?.userData?.login_type === "user") {
      navigate("/AdminPage");
    } else if (adminloginData?.userData?.login_type === "partener") {
      navigate("/AdminPage");
    }
  }, [adminloginData]);
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>

          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn">
            Login
          </button>
        </form>
        <br />

        <div className="btn-signup">
          <button type="submit" className="btn" onClick={handlalert}>
            New around here?Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
