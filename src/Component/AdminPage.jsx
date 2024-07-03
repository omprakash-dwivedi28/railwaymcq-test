import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Component/css/AdminPage.css";
import { useInitialContext } from "../context/InitialContext";
import Logout from "./logout";

const AdminPage = () => {
  const navigate = useNavigate();

  const { adminloginData } = useInitialContext();

  if (adminloginData?.userData?.login_type === "admin") {
    console.log(adminloginData?.userData?.login_type);
    return (
      <div className="admin-container">
        <h2>Welcome, {adminloginData?.userData?.name} sir ji!</h2>
        <ul className="admin-menu">
          <li>
            <Link to="/QbankMaster" className="menu-item">
              Add Qbank
            </Link>
          </li>
          <li>
            <Link to="/EditableQbankData" className="menu-item">
              Modify Qbank
            </Link>
          </li>
          <li>
            <Link to="/ShowFeedback" className="menu-item">
              Show website Feedback
            </Link>
          </li>
          <li>
            <Link to="/FatchQbankFeedback" className="menu-item">
              Show MCQ Feedback
            </Link>
          </li>
          <li>
            <Link to="/MCQverifier" className="menu-item">
              MCQ verifier
            </Link>
          </li>
          <li>
            <Link to="/AddVideolinks" className="menu-item">
              Add Video Links
            </Link>
          </li>
          <li>
            <Link to="/AddDept" className="menu-item">
              Add Department
            </Link>
          </li>
          <li>
            <Link to="/VideoApproval" className="menu-item">
              Video Approval
            </Link>
          </li>
          <li>
            <Link to="/SummaryVideo" className="menu-item">
              Video Summary
            </Link>
          </li>
          <li>
            <Link to="/VideoModification" className="menu-item">
              Video Modification
            </Link>
          </li>
        </ul>
        <Logout />
      </div>
    );
  } else if (adminloginData?.userData?.login_type === "user") {
    console.log(adminloginData?.userData?.login_type);
    return (
      <div className="admin-container">
        <div className="admin-container">
          <h2>Welcome, {adminloginData?.userData?.name} Sir!!!</h2>
          <ul className="admin-menu">
            <li>
              <Link to="/InspectionNote" className="menu-item">
                Note
              </Link>
            </li>
          </ul>
        </div>
        <Logout />
      </div>
    );
  } else if (adminloginData?.userData?.login_type === "partener") {
    console.log(adminloginData?.userData?.login_type);
    return (
      <div className="admin-container">
        <div className="admin-container">
          <h2>Welcome, {adminloginData?.userData?.name} Sir!!!</h2>
          <ul className="admin-menu">
            <li>
              <Link to="/AddVideolinksPartner" className="menu-item">
                Add Video
              </Link>
            </li>
          </ul>
        </div>
        <Logout />
      </div>
    );
  } else {
    navigate("/LoginForm");
  }
};

export default AdminPage;
