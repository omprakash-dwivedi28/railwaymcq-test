import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import "../Component/css/VideoLearner.css";
import { useInitialContext } from "../context/InitialContext";
import { VscLoading } from "react-icons/vsc";

const VideoLearner = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopcode, setSelectedTopcode] = useState("");
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;
  const { adminloginData } = useInitialContext();

  useEffect(() => {
    fetch("https://railwaymcq.com/student/videolinks_api.php")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
        setFilteredVideos(data);
        setLoading(false);
        fetchSubjects();
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
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

  const handleSubjectChange = (e) => {
    const selectedSubcode = e.target.value;
    setSelectedSubject(selectedSubcode);
    fetchTopcodes(selectedSubcode);
  };

  const handleTopcodeChange = (e) => {
    setSelectedTopcode(e.target.value);
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

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event, type) => {
    const value = event.target.value;
    if (type === "from") {
      setSearchFromDate(value);
    } else if (type === "to") {
      setSearchToDate(value);
    }
  };

  useEffect(() => {
    const filtered = videos.filter((video) => {
      return (
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedSubject === "" ||
          video.subcode.toString() === selectedSubject) &&
        (selectedTopcode === "" ||
          video.topcode.toString() === selectedTopcode) &&
        (searchFromDate === "" ||
          new Date(video.created_date) >= new Date(searchFromDate)) &&
        (searchToDate === "" ||
          new Date(video.created_date) <= new Date(searchToDate))
      );
    });
    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    videos,
    selectedSubject,
    selectedTopcode,
    searchFromDate,
    searchToDate,
  ]);

  // Pagination logic
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="video-learner-container">
      <div className="video-list">
        <h4>Welcome!! {adminloginData?.userData?.name}</h4>{" "}
      </div>
      <h2 className="video-learner-heading">Video Learning Playlist</h2>
      <p className="total-videos">Total Videos: {filteredVideos.length}</p>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-box"
        />
        <select
          name="subcode"
          value={selectedSubject}
          onChange={handleSubjectChange}
          className="filter-select"
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
          value={selectedTopcode}
          onChange={handleTopcodeChange}
          className="filter-select"
        >
          <option value="">Select Topic</option>
          {topcodes.map((topcode, index) => (
            <option key={index} value={topcode.topcode}>
              {topcode.topic}
            </option>
          ))}
        </select>
        <div className="datepicker-container">
          <label>
            Start Date:
            <input
              type="date"
              value={searchFromDate}
              onChange={(e) => handleDateChange(e, "from")}
              className="date-box"
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={searchToDate}
              onChange={(e) => handleDateChange(e, "to")}
              className="date-box"
            />
          </label>
        </div>
      </div>
      {loading ? (
        <p>
          <VscLoading />
          Loading...
        </p>
      ) : (
        <div className="video-list">
          {currentVideos.map((video) => (
            <div key={video.id} className="video-item">
              <div
                className="video-wrapper"
                onClick={() => handleVideoSelect(video)}
              >
                <YouTube
                  videoId={video.link}
                  className="video-player"
                  opts={{ width: "100%", height: "200px" }}
                />
                <h3 className="video-title">{video.title}</h3>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-link"
              >
                Watch on YouTube
              </a>
            </div>
          ))}
        </div>
      )}
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      {selectedVideo && (
        <div className="modal" onClick={handleCloseVideo}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <YouTube
              videoId={selectedVideo.link}
              className="modal-video-player"
              opts={{ width: "100%", height: "400px" }}
            />
            <button className="close-button" onClick={handleCloseVideo}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLearner;
