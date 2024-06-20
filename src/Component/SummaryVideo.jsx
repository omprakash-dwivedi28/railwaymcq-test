import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Component/css/summaryvideo.css"; // Import CSS file for styling
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function SummaryVideo() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/student/videosummary_api.php"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setFeedbackData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to generate a unique class name for each department
  const generateDeptClass = (deptt) => {
    return `dept-${deptt.replace(/\s+/g, "-").toLowerCase()}`;
  };

  return (
    <div className="container feedback-container mt-5">
      <h1 className="mb-4">Summary of Video Availability</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-striped feedback-table">
          <thead className="thead-dark">
            <tr>
              <th>Serial ID</th>
              <th>Deptt</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Video Title</th>
              <th>Created By</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((feedback, index) => (
              <tr key={index} className={generateDeptClass(feedback.deptt)}>
                <td>{feedback.id}</td>
                <td>{feedback.deptt}</td>
                <td>{feedback.sub}</td>
                <td>{feedback.topic}</td>
                <td>{feedback.title}</td>
                <td>{feedback.created_by}</td>
                <td>{feedback.created_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SummaryVideo;
