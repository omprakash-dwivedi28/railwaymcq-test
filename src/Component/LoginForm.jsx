import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";
import { useInitialContext } from "../context/InitialContext";
import "../Component/css/LoginForm.css";
import { FaUserTie } from "react-icons/fa";
import { HiEyeSlash } from "react-icons/hi2";

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
            <label>
              <FaUserTie style={{ color: "blue" }} />
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Type your user name"
            />
          </div>
          <div className="form-group">
            <label>
              <HiEyeSlash style={{ color: "blue" }} />
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Type your password"
            />
          </div>

          {error && <div className="error">{error}</div>}
          <div>
            <button type="submit" className="btn btn-outline-success">
              Login
            </button>
          </div>
        </form>
        <br />

        <div className="btn">
          <button
            type="submit"
            className="btn btn-outline-success"
            onClick={handlalert}
          >
            New around here?Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
