import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Component/css/EditableQbankData.css";
import { useNavigate } from "react-router-dom";
// import AdminPage from "./AdminPage";

const FatchQbankFeedback = () => {
  const [qbankData, setQbankData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [formData, setFormData] = useState({
    qcode: "",
    subcode: "",
    topcode: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    reference: "",
    flagUser: true,
  });
  const [editingIndex, setEditingIndex] = useState(null); // State variable to track the index of the row being edited
  const [currentPage, setCurrentPage] = useState(1);
  const [qbankPerPage] = useState(5); // Number of qbank items per page
  const navigate = useNavigate();
  useEffect(() => {
    fetchSubjects();
    fetchData();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/subMaster_api.php"
      );
      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTopcodes = async (subcode) => {
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/topicMaster_api.php?subcode=${subcode}`
      );
      setTopcodes(response.data);
    } catch (error) {
      console.error(error);
      setTopcodes([]);
    }
  };

  const fetchData = async () => {
    try {
      let url;
      if (formData.subcode && formData.topcode) {
        url = `https://railwaymcq.com/student/quiz_feedback_api.php?subcode=${formData.subcode}&topcode=${formData.topcode}`;
      } else {
        url = "https://railwaymcq.com/student/quiz_feedback_api.php";
      }

      const response = await axios.get(url);
      setQbankData(response.data);
    } catch (error) {
      console.error(error);
      setQbankData([]);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    setQbankData((prevData) => {
      const newData = [...prevData];
      newData[index][name] = value;
      return newData;
    });
  };

  console.log("========", qbankData);
  const handleFetchData = () => {
    fetchData();
  };

  const handleUpdate = async (index) => {
    try {
      let updatedItem = qbankData[index];
      updatedItem = { ...updatedItem, flagUser: true };
      console.log("updatedItem:----", updatedItem);
      const response = await axios.put(
        "https://railwaymcq.com/student/Qbank_op_api.php",
        updatedItem
      );
      alert("Successfully updation!!!!");
      console.log(response.data);
      console.log(updatedItem);
      setQbankData((prevData) => {
        const newData = [...prevData];
        newData[index] = response.data;
        return newData;
      });
      setEditingIndex(null); // Reset editing index after update
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index); // Set the editing index to the clicked row index
  };

  const handleGoBack = () => {
    // Set admin state to true in local storage
    localStorage.setItem("admin", "true");
    // Navigate to the login page
    // if(admin)
    navigate("/AdminPage");
  };
  // const handleGoBack = () => {
  //   // // Your condition to determine whether to render AdminPage
  //   // const isAdmin = true; // Example condition, replace with your logic

  //   // if (isAdmin) {
  //   // If the user is an admin, render AdminPage
  //   // return <AdminPage admin={true} />;
  //   // } else {
  //   //   // If the user is not an admin, navigate back one step
  //   navigate("/LoginForm", { state: { admin: true } });
  //   //admin = true; // Go back one step in the history stack
  //   // }
  // };
  // Get current qbank items
  const indexOfLastQbank = currentPage * qbankPerPage;
  const indexOfFirstQbank = indexOfLastQbank - qbankPerPage;
  const currentQbankData = qbankData.slice(indexOfFirstQbank, indexOfLastQbank);

  return (
    <div className="editable-qbank-container">
      <h2>Your MCQ Feedback</h2>
      <div className="filter-section">
        <select
          name="subcode"
          value={formData.subcode}
          onChange={(e) => {
            setFormData({ ...formData, subcode: e.target.value });
            fetchTopcodes(e.target.value);
          }}
        >
          <option value="">Select Subject</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject.subcode}>
              {subject.sub}+{subject.subcode}
            </option>
          ))}
        </select>
        <select
          name="topcode"
          value={formData.topcode}
          onChange={(e) =>
            setFormData({ ...formData, topcode: e.target.value })
          }
        >
          <option value="">Select Topic</option>
          {topcodes.map((topcode, index) => (
            <option key={index} value={topcode.topcode}>
              {topcode.topic}
            </option>
          ))}
        </select>
        <button onClick={handleFetchData}>Fetch Data</button>
      </div>
      <div className="qbank-table-container">
        <table className="qbank-table">
          <thead>
            <tr>
              <th>Response</th>
              <th>Question</th>
              <th>Feedback</th>
              <th>Option 1</th>
              <th>Option 2</th>
              <th>Option 3</th>
              <th>Option 4</th>
              <th>Answer</th>
              <th>Reference</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentQbankData.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    backgroundColor: item.res_code === "0" ? "red" : "green",
                    color: "white",
                  }}
                >
                  {editingIndex === index ? (
                    <textarea
                      rows="6"
                      cols="50"
                      name="res_code"
                      value={item.res_code}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : item.res_code === "0" ? (
                    "Pending"
                  ) : (
                    "Attended"
                  )}
                </td>

                <td>
                  {editingIndex === index ? (
                    <textarea
                      rows="6"
                      cols="50"
                      name="question"
                      value={item.question}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.question
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <textarea
                      rows="6"
                      cols="50"
                      name="feedback"
                      value={item.feedback}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.feedback
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="option1"
                      value={item.option1}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option1
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="option2"
                      value={item.option2}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option2
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="option3"
                      value={item.option3}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option3
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="option4"
                      value={item.option4}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.option4
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="answer"
                      value={item.answer}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.answer
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      name="reference"
                      value={item.reference}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    item.reference
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <button onClick={() => handleUpdate(index)}>Update</button>
                  ) : (
                    <button onClick={() => handleEdit(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentQbankData.length < qbankPerPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
        <div>
          {/* <button onClick={() => window.history.back()}>Back</button> */}
          <button onClick={handleGoBack}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default FatchQbankFeedback;
