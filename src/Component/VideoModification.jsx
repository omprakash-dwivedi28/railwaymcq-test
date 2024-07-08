import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Component/css/EditableQbankData.css";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const VideoModification = () => {
  const [qbankData, setQbankData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    subcode: "",
    topcode: "",
    title: "",
    link: " ",
    description: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [qbankPerPage] = useState(5);

  useEffect(() => {
    fetchSubjects();
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
      const response = await axios.get(
        `https://railwaymcq.com/student/videomodification_api.php?subcode=${formData.subcode}&topcode=${formData.topcode}`
      );
      console.log("Fetched Data:", response.data);
      setQbankData(Array.isArray(response.data) ? response.data : []);
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

    if (name === "subcode") {
      fetchTopcodes(value);
    }
  };

  const handleFetchData = () => {
    fetchData();
  };

  const handleUpdate = async (index) => {
    try {
      const updatedItem = qbankData[index];
      console.log(updatedItem);
      const response = await axios.put(
        "https://railwaymcq.com/student/videomodification_api.php",
        updatedItem
      );
      console.log(response.data);
      setQbankData((prevData) => {
        const newData = [...prevData];
        newData[index] = response.data;
        return newData;
      });
      setEditingIndex(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleDelete = async (index) => {
    const updatedItem = qbankData[index];
    console.log("updatedItem", updatedItem);
    if (
      window.confirm(
        `Are you sure you want to delete this video id ${updatedItem.id}`
      )
    ) {
      try {
        const response = await axios.delete(
          "https://railwaymcq.com/student/videomodification_api.php",
          {
            data: { id: updatedItem.id },
          }
        );

        alert("Video deleted successfully");
        console.log("Deleted video:", response.data);
        fetchData();
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video!");
      }
    }
  };

  const handleEdit = async (index) => {
    setEditingIndex(index);
    await fetchTopcodes(qbankData[index].subcode);
  };

  const indexOfLastQbank = currentPage * qbankPerPage;
  const indexOfFirstQbank = indexOfLastQbank - qbankPerPage;
  const currentQbankData = qbankData.slice(indexOfFirstQbank, indexOfLastQbank);

  return (
    <div className="editable-qbank-container">
      <h2>Editable Videos</h2>
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
              {subject.sub}
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
              <th>Video ID</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Title</th>
              <th>Link</th>
              <th>Description</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(currentQbankData) &&
              currentQbankData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        name="subcode"
                        value={item.subcode}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject, idx) => (
                          <option key={idx} value={subject.subcode}>
                            {subject.sub}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.sub
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <select
                        name="topcode"
                        value={item.topcode}
                        onChange={(e) => handleInputChange(e, index)}
                      >
                        <option value="">Select Topic</option>
                        {topcodes.map((topcode, idx) => (
                          <option key={idx} value={topcode.topcode}>
                            {topcode.topic}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.topic
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <textarea
                        type="text"
                        name="title"
                        value={item.title}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td>{item.link}</td>
                  <td>
                    {editingIndex === index ? (
                      <textarea
                        type="text"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <button onClick={() => handleUpdate(index)}>
                        Update
                      </button>
                    ) : (
                      <FaEdit
                        style={{ color: "blue" }}
                        size={30}
                        onClick={() => handleEdit(index)}
                      />
                    )}
                  </td>
                  <td>
                    {/* <button onClick={() => handleDelete(index)}> */}
                    <MdDeleteForever
                      style={{ color: "red" }}
                      size={30}
                      button
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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
      </div>
    </div>
  );
};

export default VideoModification;
