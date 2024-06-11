import React, { useState, useEffect } from "react";
import axios from "axios";

const QbankMaster = () => {
  const [formData, setFormData] = useState({
    subcode: "", // Initial value should match this
    topcode: "",
    validity: "",
    difficulty: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: "",
    reference: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/subMaster_api.php"
      );
      setSubjects(response.data);
      console.log("Subject Code is ::::::-" + formData.subcode);
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
      setTopcodes([]); // Clear topcodes if fetching fails
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "subcode") {
      console.log(formData);

      fetchTopcodes(value); // Fetch topcodes when subcode changes
    }
  };
  const handleInsert = async () => {
    try {
      // Qbank_op_api.php
      await axios.post(
        "https://railwaymcq.com/student/Qbank_op_api.php",
        formData
      );
      alert("Data inserted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to insert data!");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.post("http://your-php-api-url/update.php", formData);
      alert("Data updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update data!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(
        `http://your-php-api-url/delete.php?id=${formData.qcode}`
      );
      alert("Data deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete data!");
    }
  };
  console.log(formData);
  return (
    <div>
      <h2>Qbank Page</h2>
      <form>
        <select
          name="subcode"
          //   value={formData.subcode}
          onChange={handleInputChange}
        >
          <option key="default" value="">
            Select Subject
          </option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject.subcode}>
              {subject.sub}+{subject.subcode}
            </option>
          ))}
        </select>
        <select
          name="topcode"
          value={formData.topcode}
          onChange={handleInputChange}
        >
          <option value="">Select Topic</option>
          {topcodes.map((topcode) => (
            <option key={topcode.topcode} value={topcode.topcode}>
              {topcode.topic}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="validity"
          value={formData.validity}
          onChange={handleInputChange}
          placeholder="Validity"
        />
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
        >
          <option value="">Select Difficulty</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
        <input
          type="text"
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          placeholder="Question"
        />
        <input
          type="text"
          name="option1"
          value={formData.option1}
          onChange={handleInputChange}
          placeholder="Option 1"
        />
        <input
          type="text"
          name="option2"
          value={formData.option2}
          onChange={handleInputChange}
          placeholder="Option 2"
        />
        <input
          type="text"
          name="option3"
          value={formData.option3}
          onChange={handleInputChange}
          placeholder="Option 3"
        />
        <input
          type="text"
          name="option4"
          value={formData.option4}
          onChange={handleInputChange}
          placeholder="Option 4"
        />
        <input
          type="text"
          name="answer"
          value={formData.answer}
          onChange={handleInputChange}
          placeholder="Answer"
        />
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleInputChange}
          placeholder="Reference"
        />
        <button type="button" onClick={handleInsert}>
          Insert
        </button>
        {/* <button type="button" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button> */}
      </form>
    </div>
  );
};

export default QbankMaster;
