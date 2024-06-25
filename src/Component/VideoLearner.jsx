import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import "../Component/css/VideoLearner.css";
import { useInitialContext } from "../context/InitialContext";
import { VscLoading } from "react-icons/vsc";
import { AiOutlineLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { TbMessage2Down } from "react-icons/tb";

const VideoLearner = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topcodes, setTopcodes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopcode, setSelectedTopcode] = useState("");
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [videolikes, setVideolikes] = useState(null);
  const [active, setActive] = useState(false);
  const videosPerPage = 10;
  const { adminloginData } = useInitialContext();
  const [likedVideos, setLikedVideos] = useState(new Set());

  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

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
    setSearchQuery(event.target.value);
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
        (video.id.toString().includes(searchQuery) ||
          video.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
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
    searchQuery,
    videos,
    selectedSubject,
    selectedTopcode,
    searchFromDate,
    searchToDate,
  ]);

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

  const updateViews = async (videoId) => {
    try {
      const updateviewsflag = "1";
      const response = await axios.post(
        "https://railwaymcq.com/student/updatevideoviews.php",
        { videoId, updateviewsflag }
      );

      console.log("Update views Response:", response.data);
      if (response.data.success) {
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === videoId ? { ...video, views: video.views + 1 } : video
          )
        );
      }
    } catch (error) {
      console.error("Failed to update views", error);
    }
  };

  const updateLikes = async (videoId) => {
    try {
      const updatelikeflag = "1";
      const response = await axios.post(
        "https://railwaymcq.com/student/updatevideoviews.php",
        { videoId, updatelikeflag }
      );
      console.log("Update like Response:", response.data);
      if (response.data.success) {
        setLikedVideos(new Set(likedVideos.add(videoId)));
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video.id === videoId ? { ...video, likes: video.likes + 1 } : video
          )
        );
      }
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const handlelikebtn = (video) => {
    if (!likedVideos.has(video.id)) {
      updateLikes(video.id);
      setLikedVideos(new Set(likedVideos.add(video.id)));
      setVideolikes(video.likes + 1);
    }
  };

  const handleCommentChange = (videoId, event) => {
    setCommentInput({ ...commentInput, [videoId]: event.target.value });
  };

  const handleCommentSubmit = async (videoId) => {
    try {
      const response = await axios.post(
        "https://railwaymcq.com/student/videocomment_api.php",
        { videoId, comment: commentInput[videoId] }
      );

      if (response.data.success) {
        handleshowComment(videoId);
        setComments({
          ...comments,
          [videoId]: [
            ...(comments[videoId] || []),
            { text: commentInput[videoId] },
          ],
        });
        setCommentInput({ ...commentInput, [videoId]: "" });
      }
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const handleshowComment = async (videoId) => {
    try {
      const response = await axios.get(
        `https://railwaymcq.com/student/videocomment_api.php?videoId=${videoId}`
      );
      console.log(response.data.comments);
      setComments((prevComments) => ({
        ...prevComments,
        [videoId]: response.data.comments || [],
      }));
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  return (
    <div className="video-learner-container">
      <div className="video-list">
        <h4>Welcome!! {adminloginData?.userData?.name}</h4>
      </div>
      <h2 className="video-learner-heading">Video Learning Playlist</h2>
      <p className="total-videos">Total Videos: {filteredVideos.length}</p>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by video ID or title..."
          value={searchQuery}
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
              <div className="video-wrapper">
                <div className="video-id">VID: {video.id}</div>
                <YouTube
                  videoId={video.link}
                  onPlay={() => updateViews(video.id)}
                  className="video-player"
                  opts={{ width: "100%", height: "200px" }}
                />
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-stats">
                    <p className="views-count">Views: {video.views}</p>
                    <div>
                      <div
                        type="button"
                        className={`like-button ${
                          likedVideos.has(video.id) ? "liked" : ""
                        }`}
                        onClick={() => handlelikebtn(video)}
                        disabled={active || likedVideos.has(video.id)}
                      >
                        <AiOutlineLike
                          fontSize={30}
                          color={likedVideos.has(video.id) ? "green" : "red"}
                        />
                      </div>
                      <span className="like-count">{video.likes}</span>
                    </div>
                  </div>
                </div>
                <div className="comment-section1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[video.id] || ""}
                    onChange={(e) => handleCommentChange(video.id, e)}
                    className="comment-box"
                  />
                  <IoSend
                    fontSize={60}
                    color="green"
                    onClick={() => handleCommentSubmit(video.id)}
                    className="send-icon"
                  />
                </div>
                <div className="comment-section">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <TbMessage2Down
                      fontSize={30}
                      color="green"
                      onClick={() => handleshowComment(video.id)}
                    />
                  </div>
                  <div className="comments-list">
                    {comments[video.id] && comments[video.id].length > 0 ? (
                      comments[video.id].map((comment, index) => (
                        <p key={index} className="comment">
                          {/* {comment.comment}
                           */}
                          {comment.comment ? comment.comment : comment.text}
                          {/* {console.log(comment)} */}
                        </p>
                      ))
                    ) : (
                      <p></p>
                      // <p>No comments yet</p>
                    )}
                  </div>
                </div>
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
