import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../Component/css/Quiz.css"; // Import CSS file for styling

function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const location = useLocation();
  const { state: receivedData } = location;

  // Fetch quiz data from the API
  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://railwaymcq.com/student/mcq_api.php?topicCode=${receivedData?.topicCode}&difficultyLevel=${receivedData?.difficulty}&subjectcode=${receivedData?.subjectcode}`
        );
        setQuizData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, [receivedData]);

  const handleOptionSelect = (selectedOption) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: selectedOption });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleGoBack = () => {
    // Check if there's a state object in the location
    if (location.state && location.state.from) {
      // Use the state object to navigate back
      window.location = location.state.from.pathname;
    } else {
      // If there's no state, go back to the previous page in history
      window.history.back();
    }
  };

  const handleSubmit = () => {
    // Calculate score based on user answers
    let totalScore = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.answer.trim()) {
        totalScore++;
      }
    });
    setScore(totalScore);
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-heading">Quiz attended by :- {receivedData?.name}</h1>
      {loading ? (
        <div class="loading-spinner"></div>
      ) : (
        <>
          {" "}
          {quizData.length ? (
            <>
              <div
                key={quizData[currentQuestionIndex].qcode}
                className="question-box"
              >
                <h3 className="question-number">
                  Q- {currentQuestionIndex + 1}
                </h3>
                <h3 className="question-text">
                  {quizData[currentQuestionIndex].question}
                </h3>
                <ul className="options-list">
                  {[
                    quizData[currentQuestionIndex].option1,
                    quizData[currentQuestionIndex].option2,
                    quizData[currentQuestionIndex].option3,
                    quizData[currentQuestionIndex].option4,
                  ].map((option, idx) => (
                    <li key={idx} className="option-item">
                      <input
                        type="radio"
                        id={`${quizData[currentQuestionIndex].qcode}_option${
                          idx + 1
                        }`}
                        name={quizData[currentQuestionIndex].qcode}
                        value={option}
                        checked={userAnswers[currentQuestionIndex] === option}
                        onChange={() => handleOptionSelect(option)}
                      />
                      <label
                        htmlFor={`${
                          quizData[currentQuestionIndex].qcode
                        }_option${idx + 1}`}
                        className="option-label"
                      >
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="button-container">
                <button
                  onClick={handleNextQuestion}
                  className="next-button"
                  disabled={currentQuestionIndex === quizData.length - 1}
                >
                  Next
                </button>
                <button onClick={handleSubmit} className="submit-button">
                  Submit
                </button>
              </div>
              <strong className="score-text">
                Your score is : {score}/{quizData.length}
              </strong>
            </>
          ) : (
            <div className="no-quiz-container">
              <h4 className="no-quiz-text">
                Sorry! Right now we don't have any quiz for this topic
              </h4>
              <button className="go-back-button" onClick={handleGoBack}>
                Go back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
