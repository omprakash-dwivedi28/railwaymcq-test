import React, { useState, useEffect } from "react";
import axios from "axios";
import { useInitialContext } from "../context/InitialContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./feedback.css";
import { MdDelete } from "react-icons/md";
import { SlNote } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa6";

const InspectionNote = ({ showAlert }) => {
  const { adminloginData } = useInitialContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userid: adminloginData?.userData?.id || "",
    username: adminloginData?.userData?.name || "",
    inspectionnote: "",
  });

  const [notes, setNotes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [editBtnClicked, editBtnNotclicked] = useState(false);

  useEffect(() => {
    if (adminloginData) {
      setFormData({
        userid: adminloginData.userData.id,
        username: adminloginData.userData.name,
        inspectionnote: "",
      });
    }
  }, [adminloginData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, inspectionnote: value });
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchKeyword") setSearchKeyword(value);
    if (name === "fromDate") setFromDate(value);
    if (name === "toDate") setToDate(value);
  };

  const handleDateFilter = (filter) => {
    const now = new Date();
    let startDate;
    let endDate = now.toISOString().split("T")[0];

    switch (filter) {
      case "today":
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDate = today.toISOString().split("T")[0];
        endDate = tomorrow.toISOString().split("T")[0];
        break;
      case "thisWeek":
        const firstDayOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay())
        );
        const lastDayOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 6)
        );
        startDate = firstDayOfWeek.toISOString().split("T")[0];
        endDate = lastDayOfWeek.toISOString().split("T")[0];
        break;
      case "lastWeek":
        const lastWeekStart = new Date();
        lastWeekStart.setDate(
          lastWeekStart.getDate() - lastWeekStart.getDay() - 7
        );
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);
        startDate = lastWeekStart.toISOString().split("T")[0];
        endDate = lastWeekEnd.toISOString().split("T")[0];
        break;
      case "lastMonth":
        const thisMonth = new Date();
        const firstDayOfLastMonth = new Date(
          thisMonth.getFullYear(),
          thisMonth.getMonth() - 1,
          1
        );
        const lastDayOfLastMonth = new Date(
          thisMonth.getFullYear(),
          thisMonth.getMonth(),
          0
        );
        startDate = firstDayOfLastMonth.toISOString().split("T")[0];
        endDate = lastDayOfLastMonth.toISOString().split("T")[0];
        break;
      case "lastQuarter":
        const startOfQuarter = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        const endOfLastQuarter = new Date(startOfQuarter);
        startOfQuarter.setMonth(startOfQuarter.getMonth() - 3);
        endOfLastQuarter.setDate(endOfLastQuarter.getDate() - 1);
        startDate = startOfQuarter.toISOString().split("T")[0];
        endDate = endOfLastQuarter.toISOString().split("T")[0];
        break;
      case "lastYear":
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(startOfLastYear);
        endOfLastYear.setDate(endOfLastYear.getDate() - 1);
        startDate = startOfLastYear.toISOString().split("T")[0];
        endDate = endOfLastYear.toISOString().split("T")[0];
        break;
      default:
        startDate = "";
        endDate = "";
    }
    setFromDate(startDate);
    setToDate(endDate);
  };

  const handleInsertOrUpdate = async () => {
    if (!formData.userid || !formData.username || !formData.inspectionnote) {
      alert("Please fill in all fields or check may be you are logout.");
      return;
    }

    if (editBtnClicked && selectedNote) {
      try {
        const response = await axios.put(
          "https://railwaymcq.com/student/UpdateInspectionNote_api.php",
          {
            ...formData,
            noteid: selectedNote.noteid,
          }
        );
        showAlert("Data updated successfully!", "success");
        resetForm();
        fetchNotes();
        editBtnNotclicked(false); // Reset the edit state
      } catch (error) {
        console.error(error);
        alert("Failed to update data!");
      }
    } else {
      try {
        const response = await axios.post(
          "https://railwaymcq.com/student/InspectionNote_api.php",
          formData
        );
        showAlert("Data inserted successfully!", "success");
        resetForm();
        fetchNotes();
      } catch (error) {
        console.error(error);
        alert("Failed to insert data!");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userid: adminloginData?.userData?.id,
      username: adminloginData?.userData?.name,
      inspectionnote: "",
    });
    setSelectedNote(null);
    editBtnNotclicked(false); // Reset the edit state
  };

  const fetchNotes = async () => {
    try {
      const params = {
        keyword: searchKeyword,
        fromDate: fromDate,
        toDate: toDate,
        userid: adminloginData?.userData?.id,
      };

      const response = await axios.get(
        "https://railwaymcq.com/student/GetInspectionNotes.php",
        { params }
      );

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchKeyword, fromDate, toDate]);

  const filterNotes = (notes) => {
    return notes.filter((note) => {
      const noteDate = new Date(note.created_date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const matchesKeyword = searchKeyword
        ? (note.note &&
            note.note.toLowerCase().includes(searchKeyword.toLowerCase())) ||
          (note.noteid && note.noteid.toString().includes(searchKeyword))
        : true;
      const matchesFromDate = from ? noteDate >= from : true;
      const matchesToDate = to ? noteDate <= to : true;

      return matchesKeyword && matchesFromDate && matchesToDate;
    });
  };

  const handleSelect = (event) => {
    handleDateFilter(event.target.value);
  };

  const fetchRecycleNotes = () => {
    const dataToSend = {
      userid: adminloginData?.userData?.id,
    };
    navigate("/DeletedInspectionNotes", { state: dataToSend });
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axios.put(
        "https://railwaymcq.com/student/NotesRecycleBin_api.php",
        {
          id: noteId,
        }
      );
      alert("Notes Deleted successfully");
      console.log("Deleted notes:", response.data);
      showAlert("Note deleted successfully!", "success");
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note!");
    }
  };

  const handleUpdate = (noteId) => {
    const noteToUpdate = notes.find((note) => note.noteid === noteId);
    if (noteToUpdate) {
      setSelectedNote({
        ...noteToUpdate,
        inspectionnote: noteToUpdate.note,
      });
      setFormData({
        ...formData,
        inspectionnote: noteToUpdate.note,
      });
      editBtnNotclicked(true);
    } else {
      console.error(`Note with ID ${noteId} not found.`);
    }
  };

  return (
    <div className="inspection-note-container">
      <h2>Hello, {adminloginData?.userData?.name} Sir!</h2>

      <form className="note-form">
        <input
          type="hidden"
          name="userid"
          value={formData.userid}
          onChange={handleInputChange}
        />

        <input
          type="hidden"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          disabled
        />
        <ReactQuill
          value={formData.inspectionnote}
          onChange={handleQuillChange}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image", "video"],
              ["clean"],
              [{ color: [] }, { background: [] }],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
            "color",
            "background",
          ]}
          className="note-textarea"
        />
        <button
          type="button"
          className="btn btn-primary save-note-button"
          onClick={handleInsertOrUpdate}
        >
          {editBtnClicked ? "Update Note" : "Save your Note"}
        </button>
      </form>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={fetchRecycleNotes}
      >
        <FaRecycle />
        Show Recycled Notes
      </button>
      <div className="search-filters">
        <input
          type="text"
          name="searchKeyword"
          placeholder="Search by keyword"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput1" className="form-label">
            Start Date:
          </label>
          <input
            type="date"
            name="fromDate"
            placeholder="From date"
            value={fromDate}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label">
            End Date:
          </label>
          <input
            type="date"
            name="toDate"
            placeholder="To date"
            value={toDate}
            onChange={handleSearchChange}
          />
        </div>
        <select onChange={handleSelect}>
          <option value="">Select Date Filter</option>
          <option value="today">Today</option>
          <option value="thisWeek">This Week</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastQuarter">Last Quarter</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <div className="notes-list">
        {filterNotes(notes).map((note) => (
          <div key={note.noteid} className="note-item">
            <div className="note-container">
              <div className="note-username">
                <strong>{note.username}:</strong>
              </div>

              <div className="note-noteid">
                <SlNote
                  className="edit-note-icon"
                  onClick={() => handleUpdate(note.noteid)}
                />
                <strong>{note.noteid}</strong>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: note.note }} />
            <p>
              <em>{new Date(note.created_date).toLocaleString()}</em>
            </p>
            <MdDelete
              className="delete-note-icon"
              onClick={() => handleDelete(note.noteid)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspectionNote;
