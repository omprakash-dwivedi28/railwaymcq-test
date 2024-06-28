import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import "../Component/css/VideoLearner.css";
import { AiOutlineLike } from "react-icons/ai";
import { RiLoader2Line } from "react-icons/ri";

const TrandingVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedVideos, setLikedVideos] = useState(new Set());

  useEffect(() => {
    const fetchTopVideos = async () => {
      try {
        const response = await axios.get(
          "https://railwaymcq.com/student/videolinks_api.php"
        );
        const filteredVideos = response.data.filter(
          (video) => video.partener_flag === null
        );

        // Sort videos by views and likes
        filteredVideos.sort((a, b) => b.views + b.likes - (a.views + a.likes));

        // Get top 5 videos
        const topVideos = filteredVideos.slice(0, 5);

        setVideos(topVideos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchTopVideos();
  }, []);

  const updateViews = async (videoId) => {
    try {
      const updateviewsflag = "1";
      await axios.post("https://railwaymcq.com/student/updatevideoviews.php", {
        videoId,
        updateviewsflag,
      });
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, views: video.views + 1 } : video
        )
      );
    } catch (error) {
      console.error("Failed to update views", error);
    }
  };

  const updateLikes = async (videoId) => {
    try {
      const updatelikeflag = "1";
      await axios.post("https://railwaymcq.com/student/updatevideoviews.php", {
        videoId,
        updatelikeflag,
      });
    } catch (error) {
      console.error("Failed to update likes", error);
    }
  };

  const handleLikeButton = (video) => {
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

  return (
    <div className="video-learner-container">
      <h1 className="text-center mb-4">Trending Videos </h1>
      {loading ? (
        <p>
          <RiLoader2Line fontSize="50" color="green" />
          {/* Loading... */}
        </p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (
            <div
              key={video.id}
              className="video-item"
              style={{ background: "white" }}
            >
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
                    type="button"
                    className={`like-button ${
                      likedVideos.has(video.id) ? "liked" : ""
                    }`}
                    onClick={() => handleLikeButton(video)}
                    disabled={likedVideos.has(video.id)}
                  >
                    <AiOutlineLike
                      fontSize={30}
                      color={likedVideos.has(video.id) ? "green" : "red"}
                    />
                  </div>
                  <span className="like-count">{video.likes}</span>
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
    </div>
  );
};

export default TrandingVideos;
