import React, { createContext, useContext, useState } from "react";

const ServerContext = createContext();

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};

export const ServerProvider = ({ children }) => {
  const [currentSource, setCurrentSource] = useState("vidsrc");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const streamingSources = {
    vidsrc: "https://vidsrc.me/embed",
    superembed: "https://multiembed.mov/directstream.php",
    vidcloud: "https://vidsrc.xyz/embed",
  };

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Video streaming has been disabled");
      setIsLoading(false);
    }
  };

  const getStreamingUrl = (
    source,
    mediaType,
    id,
    season = null,
    episode = null
  ) => {
    if (mediaType === "tv" && season && episode) {
      switch (source) {
        case "vidsrc":
          return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
        case "superembed":
          return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
        case "vidcloud":
          return `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
        default:
          return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
      }
    } else {
      // Movie URLs
      switch (source) {
        case "vidsrc":
          return `https://vidsrc.me/embed/movie?tmdb=${id}`;
        case "superembed":
          return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`;
        case "vidcloud":
          return `https://vidsrc.xyz/embed/movie?tmdb=${id}`;
        default:
          return `https://vidsrc.me/embed/movie?tmdb=${id}`;
      }
    }
  };

  const value = {
    currentSource,
    setCurrentSource,
    streamingSources,
    getStreamingUrl,
    error,
    setError,
    isLoading,
    fetchSources,
  };

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};
