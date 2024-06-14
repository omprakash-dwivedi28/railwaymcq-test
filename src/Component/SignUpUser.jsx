import React, { useState, useEffect } from "react";
import axios from "axios";
import { useInitialContext } from "../context/InitialContext";
import { useNavigate } from "react-router-dom";
import "./feedback.css"; // Import CSS file

// Axios Instance
const ai = axios.create({
  baseURL: "https://railwaymcq.com/student/SignUp_api.php",
});

export default function SignUpUser(props) {
  const [formData, setFormData] = useState({
    zone: "",
    division: "",
    deptt: "",
    name: "",
    userName: "",
    password: "",
    partener_flag: "0",
  });
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isPartener, setIsPartener] = useState(false);

  const navigate = useNavigate();
  const { SetZoneAndDivision, zoneAndDivisionData, departmentData } =
    useInitialContext();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate input
    if (value === "") {
      setErrors((prevState) => ({
        ...prevState,
        [name]: `Please select a ${name}`,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }

    // Check for username availability
    if (name === "userName") {
      setIsCheckingUsername(true);
      try {
        const response = await axios.get(
          `https://railwaymcq.com/student/checkUsernameAvailability.php?username=${value}`
        );
        setIsUsernameAvailable(response.data.isAvailable);
        setErrors((prevState) => ({
          ...prevState,
          userName: response.data.isAvailable
            ? ""
            : "Username is already taken",
        }));
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
      setIsCheckingUsername(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "zone",
      "division",
      "deptt",
      "name",
      "userName",
      "password",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrors((prevState) => ({
          ...prevState,
          [field]: `Please fill in the ${field} field`,
        }));
        return;
      }
    }

    try {
      if (
        Object.values(errors).some((error) => error !== "") ||
        !isUsernameAvailable
      ) {
        alert("Please fix the errors before submitting the form");
        return;
      }

      console.log("Form Data:", JSON.stringify(formData, null, 2));

      const response = await axios.post(
        "https://railwaymcq.com/student/SignUp_api.php",
        formData
      );
      console.log("User added successfully:", response.data);

      alert("User added successfully");
      navigate("/LoginForm");
      setFormData({
        zone: "",
        division: "",
        deptt: "",
        name: "",
        userName: "",
        password: "",
        partener_flag: "0",
      });
      setIsPartener(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleIsNewPartener = (e) => {
    const { checked } = e.target;
    setIsPartener(checked);
    setFormData((prevState) => ({
      ...prevState,
      partener_flag: checked ? "1" : "0",
    }));
  };

  useEffect(() => {
    SetZoneAndDivision();
  }, [SetZoneAndDivision]);

  return (
    <div className="feedback-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <h6>{props.heading}</h6>
        <label>
          <input
            type="checkbox"
            checked={isPartener}
            onChange={handleIsNewPartener}
          />
          Tick this to be a YouTube video Partner
        </label>
        {console.log("isPartener:::::::", isPartener)}
        <select
          className="form-select"
          name="zone"
          value={formData.zone}
          onChange={handleChange}
        >
          <option value="">Please select Zone</option>
          {zoneAndDivisionData &&
            zoneAndDivisionData.map((zones, index) =>
              Object.entries(zones).map(([zone]) => (
                <option key={index} value={zone}>
                  {zone}
                </option>
              ))
            )}
        </select>
        {errors.zone && <p className="error">{errors.zone}</p>}

        <select
          className="form-select"
          name="division"
          value={formData.division}
          onChange={handleChange}
        >
          <option value="">Please select Division</option>
          {zoneAndDivisionData?.map((zones) =>
            Object.entries(zones).map(([zone, divisions]) =>
              zone === formData.zone
                ? divisions.map((division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  ))
                : null
            )
          )}
        </select>
        {errors.division && <p className="error">{errors.division}</p>}

        <select
          className="form-select"
          name="deptt"
          value={formData.deptt}
          onChange={handleChange}
        >
          <option value="">Please select Department</option>
          {departmentData &&
            departmentData.map((depttObject, index) => (
              <option key={index} value={depttObject.dept_name}>
                {depttObject.dept_name}
              </option>
            ))}
        </select>
        {errors.deptt && <p className="error">{errors.deptt}</p>}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Please enter your name..."
          className="form-control"
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="text"
          className="form-control"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Enter your username"
        />
        {isCheckingUsername && <p>Checking username availability...</p>}
        {errors.userName && <p className="error">{errors.userName}</p>}

        <input
          type="password"
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="Enter your password"
          className="form-control"
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
