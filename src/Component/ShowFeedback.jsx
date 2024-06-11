import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Component/css/ShowFeedback.css"; // Import CSS file for styling

function ShowFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://railwaymcq.com/student/dbfeedback_api.php"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      setFeedbackData(data); // Assuming setFeedbackData is defined elsewhere
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Feedback</h1>
      <table className="feedback-table">
        <thead>
          <tr>
            <th>Serial</th>
            <th>Zone</th>
            <th>Division</th>
            <th>Department</th>
            <th>Date</th>
            <th>Message</th>
            <th>Message By</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {feedbackData.map((feedback, index) => (
            <tr key={index}>
              <td>{feedback.serial}</td>
              <td>{feedback.zone}</td>
              <td>{feedback.division}</td>
              <td>{feedback.deptt}</td>
              <td>{feedback.date}</td>
              <td>{feedback.message}</td>
              <td>{feedback.message_by}</td>
              <td>{feedback.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowFeedback;
