import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./feedback.css";
import { useInitialContext } from "../context/InitialContext";

const ai = axios.create({
  baseURL: "https://railwaymcq.com/student/dbfeedback_api.php",
});

export default function FeedBack_user(props) {
  const [formData, setFormData] = useState({
    zone: null,
    division: null,
    deptt: null,
    message: null,
    message_by: null,
    level: null,
  });
  const [errors, setErrors] = useState({});

  const {
    railwayInfo,
    zoneAndDivisionInfo,
    departmentInfo,
    SetZoneAndDivision,
  } = useInitialContext();
  const { zoneAndDivisionData } = useInitialContext();
  const { subjectData } = useInitialContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate input
    if (name === "zone" && value === "") {
      //alert("hi");
      setErrors({ ...errors, zone: "Please select a zone" });
    } else if (name === "division" && value === "") {
      setErrors({ ...errors, division: "Please select a division" });
    } else if (name === "deptt" && value === "") {
      setErrors({ ...errors, deptt: "Please select a department" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };
  console.log(typeof formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.zone === null &&
      formData.division === null &&
      formData.deptt === null &&
      formData.message === null &&
      formData.message_by === null
    ) {
      alert("Please fill data first");
    } else if (formData.zone === null) {
      alert("Please fill zone data first");
    } else if (formData.division === null) {
      alert("Please fill division data first");
    } else if (formData.deptt === null) {
      alert("Please fill Depot data first");
    } else if (formData.message === null) {
      alert("Please fill message data first");
    } else if (formData.message_by === null) {
      alert("Please Enter your name first");
    } else {
      try {
        // Check for validation errors before submitting
        if (Object.values(errors).some((error) => error !== "")) {
          alert("Please fix the errors before submitting the form");
          return false;
        }

        console.log("Form Data:", JSON.stringify(formData, null, 2));

        const response = await axios.post(
          "https://railwaymcq.com/student/dbfeedback_api.php",
          formData
        );
        console.log("Data added successfully:", response.data);
        alert("Data added successfully");

        setFormData({
          zone: "",
          division: "",
          deptt: "",
          message: "",
          message_by: "",
          level: "",
        });
      } catch (error) {
        console.error("Error adding data:", error);
      }
    }
  };

  useEffect(() => {
    SetZoneAndDivision();
  }, [SetZoneAndDivision]);

  return (
    <div className="feedback-container">
      <form onSubmit={handleSubmit}>
        <h6>{props.heading}</h6>
        <select
          className="form-select"
          name="zone"
          value={formData.zone}
          onChange={handleChange}
        >
          <option value="">Please select Zone</option>
          {zoneAndDivisionData &&
            zoneAndDivisionData.map((zones, index) =>
              Object.entries(zones).map(([zone], index) => {
                return (
                  <option key={index} value={zone}>
                    {zone}
                  </option>
                );
              })
            )}
        </select>
        {errors.zone && <p className="error">{errors.zone}</p>}

        <select
          className="form-select"
          name="division"
          value={formData.division}
          onChange={handleChange}
        >
          <option>Please select Division</option>
          {console.log(formData.zone)}
          {zoneAndDivisionData?.map((zones, zoneIndex) => {
            return Object.entries(zones)?.map(([zone, divisions]) => {
              if (zone === formData.zone) {
                return divisions.map((division, divisionIndex) => {
                  return (
                    <option key={divisionIndex} value={division}>
                      {division}
                    </option>
                  );
                });
              }
              return null; // Return value for map
            });
          })}
        </select>
        {errors.division && <p className="error">{errors.division}</p>}

        {/* Other form inputs */}

        <select
          className="form-select"
          name="deptt"
          value={formData.deptt}
          onChange={handleChange}
        >
          <option>Please select Department</option>
          {subjectData &&
            subjectData.map((depttObject, index) => (
              <option key={index} value={depttObject.depttcode}>
                {depttObject.deptt}
                {console.log("Deptt_code:::::" + depttObject.depttcode)}
              </option>
            ))}
        </select>
        {errors.deptt && <p className="error">{errors.deptt}</p>}

        <textarea
          type="text"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Please feel free to leave any Feedback here..."
          className="form-control"
          id="myBox"
          rows="4"
          col="8"
        ></textarea>

        <input
          type="text"
          className="custom-textbox" // Apply custom class for styling
          name="message_by"
          value={formData.message_by}
          onChange={handleChange}
          placeholder="Enter your good name please..."
          // placeholder={a.name}
        />
        <select
          value={formData.level || ""}
          name="level"
          onChange={handleChange}
          className="select-dropdown"
        >
          <option value="">Select Level</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="L4">L4</option>
          <option value="L5">L5</option>
          <option value="L6">L6</option>
          <option value="L7">L7</option>
          <option value="L8">L8</option>
          <option value="L9">L9</option>
          <option value="L10">L10</option>
          <option value="L11">L11</option>
          <option value="L12">L12</option>
          <option value="L13">L13</option>
          <option value="L14">L14</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Save Feedback
        </button>
      </form>
    </div>
  );
}
