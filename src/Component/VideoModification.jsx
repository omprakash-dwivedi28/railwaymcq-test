import React, { useState, useEffect } from "react";
import axios from "axios";

const VideoModification = ({ videoId }) => {
  const [video, setVideo] = useState({
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `https://railwaymcq.com/student/videolinks_api/${videoId}`
        );
        setVideo({
          title: response.data.title,
          description: response.data.description,
        });
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideo((prevVideo) => ({
      ...prevVideo,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://yourapi.com/videos/${videoId}`, video);
      setMessage("Video updated successfully!");
    } catch (error) {
      console.error("Error updating video:", error);
      setMessage("Failed to update video.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://yourapi.com/videos/${videoId}`);
      setMessage("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      setMessage("Failed to delete video.");
    }
  };

  return (
    <div>
      <h2>Modify Video</h2>
      <form>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={video.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={video.description}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Update Video
        </button>
        <button type="button" onClick={handleDelete}>
          Delete Video
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VideoModification;
