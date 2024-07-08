import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { RiLoader2Line } from "react-icons/ri";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { TbMessage2Down } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import "../Component/css/VideoLearner.css"; // Import your CSS file
import { useInitialContext } from "../context/InitialContext";
import StarRating from "./StarRating.jsx";

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
  const videosPerPage = 5;
  const { adminloginData } = useInitialContext();
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [dislikedVideos, setdisLikedVideos] = useState(new Set());
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [paginationDisabled, setPaginationDisabled] = useState(true);

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
      console.log("featch subject", response.data);
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
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const updateViews = async (videoId) => {
    try {
      const updateviewsflag = "1";
      const response = await axios.post(
        "https://railwaymcq.com/student/updatevideoviews.php",
        { videoId, updateviewsflag }
      );

      console.log("Update views Response:");
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
      console.log("Update like Response:");
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const updatedisLikes = async (videoId) => {
    try {
      const updatedislikeflag = "1";
      const response = await axios.post(
        "https://railwaymcq.com/student/updatevideoviews.php",
        { videoId, updatedislikeflag }
      );
      console.log("Update dislike Response:", response.data);
    } catch (error) {
      console.error("Failed to update dislikes", error);
    }
  };

  const handlelikebtn = (video) => {
    if (!likedVideos.has(video.id)) {
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v.id === video.id ? { ...v, likes: v.likes + 1 } : v
        )
      );
      setLikedVideos(new Set(likedVideos.add(video.id)));

      updateLikes(video.id).catch((error) => {
        console.error("Failed to update likes", error);

        setVideos((prevVideos) =>
          prevVideos.map((v) =>
            v.id === video.id ? { ...v, likes: v.likes - 1 } : v
          )
        );
        setLikedVideos((prevLikedVideos) => {
          const newLikedVideos = new Set(prevLikedVideos);
          newLikedVideos.delete(video.id);
          return newLikedVideos;
        });
      });
    }
  };

  const handledislikebtn = (video) => {
    if (!dislikedVideos.has(video.id)) {
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v.id === video.id ? { ...v, dislikes: v.dislikes + 1 } : v
        )
      );
      setdisLikedVideos(new Set(dislikedVideos.add(video.id)));

      updatedisLikes(video.id).catch((error) => {
        console.error("Failed to update dislikes", error);
        setVideos((prevVideos) =>
          prevVideos.map((v) =>
            v.id === video.id ? { ...v, dislikes: v.dislikes - 1 } : v
          )
        );
        setdisLikedVideos((prevdisLikedVideos) => {
          const newdisLikedVideos = new Set(prevdisLikedVideos);
          newdisLikedVideos.delete(video.id);
          return newdisLikedVideos;
        });
      });
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

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  // const handleVideoSelect = (video) => {
  //   setSelectedVideo(video);
  //   updateViews(video.id);
  // };
  useEffect(() => {
    setPaginationDisabled(loading); // Disable pagination buttons when loading
  }, [loading]);
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
          {subjects.map((subject) => (
            <option key={subject.subcode} value={subject.subcode}>
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
          {topcodes.map((topcode) => (
            <option key={topcode.topcode} value={topcode.topcode}>
              {topcode.topic}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>
          <RiLoader2Line fontSize="50" color="green" />
        </p>
      ) : (
        <div className="video-list">
          {currentVideos.map((video) => (
            <div
              key={video.id}
              className="video-item"
              style={{ background: "white" }}
            >
              <div className="video-wrapper">
                <div className="badge text-bg-secondary">
                  subject: {video.sub}
                </div>
                <div className="badge text-bg-secondary">
                  topic: {video.topic}
                </div>
                <div className="video-id">Video id: {video.id}</div>
                <YouTube
                  videoId={video.link}
                  onPlay={() => updateViews(video.id)}
                  className="video-player"
                  opts={{ width: "100%", height: "200px" }}
                />
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-stats">
                    <div className="views-count">Views: {video.views}</div>
                    <div
                      className={`like-button ${
                        likedVideos.has(video.id) ? "liked" : ""
                      }`}
                      onClick={() => handlelikebtn(video)}
                      disabled={likedVideos.has(video.id)}
                    >
                      <AiOutlineLike
                        fontSize={30}
                        color={likedVideos.has(video.id) ? "green" : "gray"}
                      />
                      <span className="like-count">{video.likes}</span>
                    </div>
                    <div
                      className={`dislike-button ${
                        dislikedVideos.has(video.id) ? "disliked" : ""
                      }`}
                      onClick={() => handledislikebtn(video)}
                      disabled={dislikedVideos.has(video.id)}
                    >
                      <AiOutlineDislike
                        fontSize={30}
                        color={dislikedVideos.has(video.id) ? "red" : "gray"}
                      />
                      <span className="like-count">{video.dislikes}</span>
                    </div>
                  </div>
                </div>
                <div className="comment-section">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[video.id] || ""}
                    onChange={(e) => handleCommentChange(video.id, e)}
                    className="comment-box"
                  />
                  <div className="comment-buttons">
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() => handleCommentSubmit(video.id)}
                    >
                      <IoSend fontSize={20} className="send-icon" />
                      Comment
                    </button>
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
                          {comment.comment ? comment.comment : comment.text}
                        </p>
                      ))
                    ) : (
                      <p>Click the fetch button to show previous comments.</p>
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
              <div className="rating-container">
                <div className="centered-item">
                  <StarRating videoId={video.id} />
                </div>
              </div>
              <div className="video-list"></div>
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
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || paginationDisabled}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const shouldDisplay =
            index + 1 === 1 ||
            index + 1 === currentPage ||
            index + 1 === totalPages ||
            index + 1 === currentPage - 1 ||
            index + 1 === currentPage - 2 ||
            index + 1 === currentPage + 1 ||
            index + 1 === currentPage + 2;

          if (shouldDisplay) {
            return (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => handlePageClick(index + 1)}
                disabled={paginationDisabled}
              >
                {index + 1}
              </button>
            );
          } else if (
            (index === 3 && totalPages > 5) ||
            (index === totalPages - 3 && totalPages > 5)
          ) {
            return <span key={index}>...</span>;
          }

          return null;
        })}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || paginationDisabled}
        >
          Next
        </button>
      </div>{" "}
    </div>
  );
};

export default VideoLearner;
