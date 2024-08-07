import React from "react";
import { Link } from "react-router-dom";
import { useInitialContext } from "../context/InitialContext";
import "../Component/css/Navbar.css"; // Import your custom CSS
// import Logout from "./Logout";
import GoogleTranslate from "./GoogleTranslate";
import { FaLanguage } from "react-icons/fa";
import Chatbot from "./Chatbot";
import { FaTrainTram } from "react-icons/fa6";

export default function Navbar() {
  const {
    zoneAndDivisionLoading,
    zoneAndDivisionData,
    zoneAndDivisionError,
    adminloginData,
  } = useInitialContext();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <FaTrainTram style={{ color: "blue", fontSize: "25 px" }} />
          MyRailApp
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/QuizSetup" className="nav-link">
                MCQ section
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/VideoLearner" className="nav-link">
                Videos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/TrandingVideos" className="nav-link">
                Trending Videos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/FeedBack_user" className="nav-link">
                User Feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/LoginForm" className="nav-link">
                Login
              </Link>
            </li>
            <li></li>
          </ul>
        </div>
        <div>
          <FaLanguage style={{ color: "blue", fontSize: "50px" }} />
          <GoogleTranslate />
          {/* <Chatbot /> */}
        </div>
      </div>
    </nav>
  );
}
