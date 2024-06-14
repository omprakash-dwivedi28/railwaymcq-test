import React, { useState, useEffect } from "react";
import "../Component/css/QuizSetup.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useInitialContext } from "../context/InitialContext";

function QuizSetup() {
  const [selectedOption, setSelectedOption] = useState("option2");
  const [name, setName] = useState("");
  const [deptt, setDeptt] = useState("");
  const [depttcode, setDepttcode] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({
    sub: "",
    subCode: "",
  });
  const [selectedTopic, setSelectedTopic] = useState({
    topic: "",
    topicCode: "",
  });
  const [difficulty, setDifficulty] = useState("1");
  const [deptObj, setDeptObj] = useState(null);

  const navigate = useNavigate();
  const { subjectData } = useInitialContext();
  const { adminloginData } = useInitialContext();

  useEffect(() => {
    console.log("Subject Data:", subjectData);
  }, [subjectData]);

  const handleDepttChange = (e) => {
    const selectedDepttcode = e.target.value;
    setDepttcode(selectedDepttcode);
    const selectedDepttObj = subjectData?.find(
      (depttObject) => depttObject.depttcode === selectedDepttcode
    );
    setDeptObj(selectedDepttObj || null);
    console.log("Selected Department Object:", selectedDepttObj);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    const subjectAndSubjectCode = e.target.value;
    const sub = subjectAndSubjectCode.replace(/[^a-zA-Z]/g, "");
    const subCode = subjectAndSubjectCode.replace(/[a-zA-Z]/g, "");
    setSelectedSubject({ sub: sub, subCode: subCode });
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    const topicAndCode = e.target.value;
    const parts = topicAndCode.split(",").map((part) => part.trim());

    let topicCode = "";
    let topic = "";

    parts.forEach((part) => {
      if (part.startsWith("topicCode=")) {
        topicCode = part.split("=")[1];
      } else if (part.startsWith("topic=")) {
        topic = part.split("=")[1];
      }
    });

    setSelectedTopic({ topic: topic, topicCode: topicCode });
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value); // Update the selected option when the radio button is changed
  };

  const handleStartQuiz = () => {
    const dataToSend = {
      topicCode: selectedTopic.topicCode,
      difficulty: difficulty,
      subjectcode: selectedSubject.subCode,
      name: adminloginData?.userData?.name || name,
    };

    navigate("/Quiz", { state: dataToSend });
  };

  const handleSubmit = () => {
    const dataToSend = {
      topicCode: selectedTopic.topicCode,
      difficulty: difficulty,
      subjectcode: selectedSubject.subCode,
      name: adminloginData?.userData?.name || name || "GEST",
    };

    if (selectedOption === "option1") {
      navigate("/Quiz", { state: dataToSend });
    } else if (selectedOption === "option2") {
      navigate("/Quiz1", { state: dataToSend });
    }
  };

  return (
    <div className="quiz-setup-container">
      <h1>Quiz Setup</h1>
      <div className="input-container">
        <label>Name:</label>
        <input
          type="text"
          // value={name}
          value={adminloginData?.userData?.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="input-container">
        <label>Department:</label>
        <select
          className="form-select"
          name="deptt"
          value={depttcode}
          onChange={handleDepttChange}
        >
          <option value="">Please select Department</option>
          {/* <option value="1">Electrical</option> */}
          {subjectData &&
            subjectData.map((depttObject, index) => (
              <option key={index} value={depttObject.depttcode}>
                {depttObject.deptt}
              </option>
            ))}
        </select>
      </div>
      <div className="input-container">
        <label>Subject:</label>
        <select
          className="form-select"
          name="subject"
          value={subject}
          onChange={handleSubjectChange}
          disabled={!deptObj || !deptObj.subjects}
        >
          <option value="">Please select Subject</option>
          {deptObj?.subjects &&
            Object.entries(deptObj.subjects).map(
              ([subCode, subDetails], index) => {
                const sub = subDetails.sub;
                const value = sub + subCode;
                return (
                  <option key={index} value={value}>
                    {sub}
                  </option>
                );
              }
            )}
        </select>
      </div>
      <div className="input-container">
        <label>Topic:</label>
        <select
          className="form-select"
          name="topic"
          value={topic}
          onChange={handleTopicChange}
          disabled={!selectedSubject.subCode}
        >
          <option value="">Please select Topic</option>
          {deptObj?.subjects &&
            deptObj.subjects[selectedSubject.subCode]?.topics.map(
              (topics, index) => {
                const value =
                  "topicCode=" + topics.topcode + ", topic=" + topics.topic;
                return (
                  <option key={index} value={value}>
                    {topics.topic}
                  </option>
                );
              }
            )}
        </select>
      </div>
      <div className="input-container">
        <label>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="select-dropdown"
        >
          <option value="">Select difficulty</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
      </div>
      <div className="quiz-setup-container">
        <h1>Make a Decision</h1>
        <div className="option-bar">
          <div className="radio-option">
            <input
              type="radio"
              id="option1"
              name="decision"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option1">Exam Mode</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="option2"
              name="decision"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleOptionChange}
            />
            <label htmlFor="option2">Learning Mode</label>
          </div>
        </div>
        <button onClick={handleSubmit} className="submit-button">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizSetup;
