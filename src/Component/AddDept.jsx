import React, { useState, useEffect } from "react";
import axios from "axios";
import "./feedback.css";
import { useInitialContext } from "../context/InitialContext";

const AddDept = ({ showAlert }) => {
  const [deptt, setDeptt] = useState("");
  const [depttcode, setDepttcode] = useState("");
  const [subject, setSubject] = useState("");
  const [subcode, setSubcode] = useState("");
  const [topic, setTopic] = useState("");
  const [maxDepttCode, setMaxDepttCode] = useState(0);
  const [maxSubcode, setMaxSubcode] = useState(0);
  const [maxTopcode, setMaxTopcode] = useState(0);
  const [error, setError] = useState("");
  const { subjectData } = useInitialContext();
  const [selectedDept, setSelectedDept] = useState(null);
  const [isNewDeptt, setIsNewDeptt] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchMaxDepttCode();
  }, []);

  useEffect(() => {
    if (depttcode) {
      fetchMaxSubcode();
    }
  }, [depttcode]);

  useEffect(() => {
    if (depttcode && subcode) {
      fetchMaxTopcode();
    }
  }, [depttcode, subcode]);

  const fetchMaxDepttCode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/ManageDept_sub_topic_api.php"
      );
      setMaxDepttCode(response.data.max_depttcode || 0);
    } catch (error) {
      console.error("Error fetching max deptt code:", error);
      setMaxDepttCode(0);
    }
  };

  const fetchMaxSubcode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/ManageDept_sub_topic_api.php",
        { params: { depttcode } }
      );
      setMaxSubcode(response.data.max_subcode || 0);
    } catch (error) {
      console.error("Error fetching max subcode:", error);
      setMaxSubcode(0);
    }
  };

  const fetchMaxTopcode = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/ManageDept_sub_topic_api.php",
        { params: { depttcode, subcode } }
      );
      setMaxTopcode(response.data.max_topcode || 0);
    } catch (error) {
      console.error("Error fetching max topcode:", error);
      setMaxTopcode(0);
    }
  };

  const checkDepttAvailability = (depttName) => {
    return subjectData.some((depttObject) => depttObject.deptt === depttName);
  };

  const checkSubjectAvailability = (subjectName) => {
    if (selectedDept && selectedDept.subjects) {
      return Object.values(selectedDept.subjects).some(
        (sub) => sub.sub === subjectName
      );
    }
    return false;
  };

  const handleDepttChange = (e) => {
    const selectedDeptObj = subjectData.find(
      (depttObject) => depttObject.depttcode === e.target.value
    );
    setSelectedDept(selectedDeptObj);
    setDeptt(selectedDeptObj.deptt);
    setDepttcode(selectedDeptObj.depttcode);
    setIsNewSubject(false);
    setSubcode("");
    setTopic("");
    setError("");
  };

  const handleSubjectChange = (e) => {
    const selectedSubjectObj = selectedDept.subjects[e.target.value];
    setSelectedSubject(selectedSubjectObj);
    setSubject(selectedSubjectObj.sub);
    setSubcode(e.target.value);
    setTopic("");
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isNewDeptt && checkDepttAvailability(deptt)) {
      setError("Department already exists. Please choose a different name.");
      return;
    }

    if (isNewSubject && checkSubjectAvailability(subject)) {
      setError("Subject already exists. Please choose a different name.");
      return;
    }

    const newDepttCode = isNewDeptt ? Number(maxDepttCode) + 1 : depttcode;
    const newSubcode = isNewSubject ? Number(maxSubcode) + 1 : subcode;
    const newTopcode = Number(maxTopcode) + 1;

    try {
      await axios.post(
        "https://railwaymcq.com/student/ManageDept_sub_topic_api.php",
        {
          deptt,
          depttcode: newDepttCode,
          sub: subject,
          subcode: newSubcode,
          topic,
          topcode: newTopcode,
        }
      );
      showAlert(
        `${isNewDeptt ? "Department" : "Data"} added successfully!`,
        "success"
      );

      if (isNewDeptt) {
        setDepttcode(newDepttCode);
        fetchMaxDepttCode();
      } else if (isNewSubject) {
        fetchMaxSubcode();
      }

      setDeptt("");
      setDepttcode("");
      setSubject("");
      setSubcode("");
      setTopic("");
      setIsNewDeptt(false);
      setIsNewSubject(false);
      setSelectedDept(null);
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred");
    }
  };

  const handleIsNewDepttChange = (e) => {
    setIsNewDeptt(e.target.checked);
    if (!e.target.checked) {
      setError("");
    }
  };

  const handleIsNewSubjectChange = (e) => {
    setIsNewSubject(e.target.checked);
    if (!e.target.checked) {
      setError("");
    }
  };

  const handleDepttInputChange = (e) => {
    const depttName = e.target.value;
    setDeptt(depttName);
    if (isNewDeptt && checkDepttAvailability(depttName)) {
      setError("Department already exists. Please choose a different name.");
    } else {
      setError("");
    }
  };

  const handleSubInputChange = (e) => {
    const subjectName = e.target.value;
    setSubject(subjectName);
    if (isNewSubject && checkSubjectAvailability(subjectName)) {
      setError("Subject already exists. Please choose a different name.");
    } else {
      setError("");
    }
  };

  return (
    <div className="inspection-note-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Manage Department, Subject, and Topic</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="input-container">
          <label>
            <input
              type="checkbox"
              checked={isNewDeptt}
              onChange={handleIsNewDepttChange}
            />
            Add New Department
          </label>
        </div>
        {isNewDeptt ? (
          <input
            type="text"
            name="deptt"
            value={deptt}
            onChange={handleDepttInputChange}
            placeholder="Department Name"
            required={isNewDeptt}
          />
        ) : (
          <div className="input-container">
            <label>Department:</label>
            <select
              className="form-select"
              name="deptt"
              value={depttcode}
              onChange={handleDepttChange}
              required={!isNewDeptt}
            >
              <option value="">Please select Department</option>
              {subjectData &&
                subjectData.map((depttObject, index) => (
                  <option key={index} value={depttObject.depttcode}>
                    {depttObject.deptt}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="input-container">
          <label>
            <input
              type="checkbox"
              checked={isNewSubject}
              onChange={handleIsNewSubjectChange}
            />
            Add New Subject
          </label>
        </div>
        {isNewSubject ? (
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={handleSubInputChange}
            placeholder="Subject Name"
            required={isNewSubject}
          />
        ) : (
          <div className="input-container">
            <label>Subject:</label>
            <select
              className="form-select"
              name="subject"
              value={subcode}
              onChange={handleSubjectChange}
              disabled={!selectedDept || !selectedDept.subjects}
              required={!isNewDeptt}
            >
              <option value="">Please select Subject</option>
              {selectedDept?.subjects &&
                Object.entries(selectedDept.subjects).map(
                  ([subCode, subDetails], index) => (
                    <option key={index} value={subCode}>
                      {subDetails.sub}
                    </option>
                  )
                )}
            </select>
          </div>
        )}

        <div className="input-container">
          <label>Added topic:(only for verifying purpose)</label>
          <select
            className="form-select"
            // name="topic"
            // value={topic}
            // onChange={handleTopicChange}
            // disabled={!selectedSubject}
          >
            <option value="">Please watch topic before adding..........</option>
            {selectedSubject?.topics &&
              selectedSubject.topics.map((topicObj, index) => (
                <option key={index} value={topicObj.topic}>
                  {topicObj.topic}
                </option>
              ))}
          </select>
        </div>

        <input
          type="text"
          name="topic"
          value={topic}
          onChange={handleTopicChange}
          placeholder="Topic Name"
          required
        />
        <button className="btn btn-primary save-note-button" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddDept;
