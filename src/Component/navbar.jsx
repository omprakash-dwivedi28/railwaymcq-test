import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useInitialContext } from "../context/InitialContext";

export default function Navbar(PropTypes) {
  const { zoneAndDivisionLoading, zoneAndDivisionData, zoneAndDivisionError } =
    useInitialContext();

  return (
    <ul className="nav nav-tabs">
      <li className="nav-item dropdown">
        <b
          className="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          href="/"
          role="button"
          aria-expanded="false"
        >
          {PropTypes.quiz}
        </b>
        <ul className="dropdown-menu">
          <li>
            <b className="dropdown-item" href="/">
              <Link to="/QuizSetup">MCQ</Link>
            </b>
          </li>
          <li>
            <b className="dropdown-item" href="/">
              <Link to="/VideoLearner">Videos</Link>
            </b>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>
        </ul>
      </li>
      <li className="nav-item">
        <b className="nav-link" href="/">
          <Link to="/FeedBack_user">User Feedback</Link>
        </b>
      </li>
      <li className="nav-item">
        <b className="nav-link" href="/">
          <Link to="/About">About us</Link>
        </b>
      </li>

      <li className="nav-item">
        <b className="nav-link" href="/">
          <Link to="/LoginForm">Login</Link>
        </b>
      </li>
    </ul>
  );
}
