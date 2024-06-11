import React, { useEffect } from "react";
import axios from "axios";
import { useInitialContext } from "../context/InitialContext";
import { useNavigate } from "react-router-dom";

function Logout() {
  // const { adminloginData, Logout, userloginData } = useInitialContext();
  const { adminloginData, Logout } = useInitialContext();

  const navigate = useNavigate();
  console.log("adminloginData", adminloginData);
  // console.log("userloginData", userloginData);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `https://railwaymcq.com/student/logout_api.php`,
        {
          logout: true,
        }
      );
      if (adminloginData?.userData?.login_type === "admin") Logout("admin");
      if (adminloginData?.userData?.login_type === "user") Logout("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // useEffect(() => {
  //   if (adminloginData === null) navigate("/LoginForm");
  //   if (userloginData === null) navigate("/LoginForm");
  // }, [adminloginData, userloginData]);

  // useEffect(() => {
  //   if (!adminloginData && !userloginData) {
  //     navigate("/LoginForm");
  //   }
  // }, [adminloginData, userloginData, navigate]);
  useEffect(() => {
    if (!adminloginData) {
      navigate("/LoginForm");
    }
  }, [adminloginData, navigate]);
  return (
    <div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Logout;
