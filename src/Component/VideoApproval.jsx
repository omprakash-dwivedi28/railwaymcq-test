import React, { useState, useEffect } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const VideoApproval = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://railwaymcq.com/student/pendingVideos.php"
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (videoId) => {
    try {
      await axios.post(
        `https://railwaymcq.com/student/approveVideo.php?id=${videoId}`
      );
      setVideos(videos.filter((video) => video.id !== videoId));
      alert("Video approved successfully");
    } catch (error) {
      console.error("Error approving video:", error);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const openVideoInNewTab = (video) => {
    window.open(`https://www.youtube.com/watch?v=${video.link}`, "_blank");
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div>
      <h2>Video Approval</h2>
      {isLoading ? (
        <p>
          <AiOutlineLoading3Quarters />
          Loading.......
        </p>
      ) : (
        <div>
          {videos.length === 0 ? (
            <p>No videos pending approval</p>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="video-item">
                <p>
                  <strong>Title::::</strong>
                  {video.title}
                </p>

                <button onClick={() => handleSelectVideo(video)}>Watch</button>
                <button onClick={() => openVideoInNewTab(video)}>
                  Watch in New Tab
                </button>
                <button onClick={() => handleApprove(video.id)}>Approve</button>
              </div>
            ))
          )}
        </div>
      )}
      {selectedVideo && (
        <div className="video-modal">
          <h3>{selectedVideo.title}</h3>
          <div>
            <YouTube
              videoId={selectedVideo.link}
              opts={{
                width: "560",
                height: "315",
                playerVars: {
                  autoplay: 1,
                },
              }}
              onReady={(event) => event.target.playVideo()}
            />
          </div>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default VideoApproval;
