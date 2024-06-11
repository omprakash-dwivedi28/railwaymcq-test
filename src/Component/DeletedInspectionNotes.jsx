import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Component/css/Recycle.css";
import { useLocation } from "react-router-dom";

const DeletedInspectionNotes = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);

  useEffect(() => {
    fetchDeletedNotes();
  }, []);
  const location = useLocation();
  const { state: receivedData } = location;
  const fetchDeletedNotes = async () => {
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          params: { userid: receivedData?.userid },
        }
      );
      console.log("loginid:::::", receivedData?.userid);
      setDeletedNotes(response.data);
    } catch (error) {
      console.error("Error fetching deleted notes", error);
    }
  };
  const restoreNote = async (id) => {
    try {
      await axios.post(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          id,
          action: "restore",
        }
      );
      fetchDeletedNotes();
    } catch (error) {
      console.error("Error restoring note", error);
    }
  };

  const permanentlyDeleteNote = async (id) => {
    try {
      await axios.delete(
        "https://railwaymcq.com/student/deleted-inspection-notes.php",
        {
          data: { id },
        }
      );
      fetchDeletedNotes();
    } catch (error) {
      console.error("Error permanently deleting note", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Deleted Notes</h1>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Note</th>
            <th>Deleted On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deletedNotes.map((note) => (
            <tr key={note.noteid}>
              <td>{note.noteid}</td>
              {/* <td>{note.note}</td> */}
              <td>
                {" "}
                <div dangerouslySetInnerHTML={{ __html: note.note }} />
              </td>
              <td>{note.deleted_on}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mr-2"
                  onClick={() => restoreNote(note.noteid)}
                >
                  Restore
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => permanentlyDeleteNote(note.noteid)}
                >
                  Permanently Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeletedInspectionNotes;
