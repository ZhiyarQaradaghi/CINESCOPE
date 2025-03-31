import React, { createContext, useContext, useState } from "react";
import { makeRequest } from "../services/apiUtils";

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
  const [availableSources, setAvailableSources] = useState([]);
  const [streamingSources, setStreamingSources] = useState({
    vidsrc: "VidSrc",
    superembed: "SuperEmbed",
    vidcloud: "VidCloud",
    fsapi: "FSAPI",
    curtstream: "CurtStream",
    moviewp: "MovieWP",
    apimdb: "ApiMDB",
    gomo: "GoMo",
  });

  // We don't need to fetch sources on mount anymore since we're using
  // specific endpoints for each movie/TV show
  // This prevents the 404 error for /api/servers/status
  const fetchSources = async (mediaType, id, season = null, episode = null) => {
    try {
      setIsLoading(true);
      setError(null);

      let endpoint;
      if (mediaType === "tv" && season && episode) {
        endpoint = `/tv/${id}/servers?season=${season}&episode=${episode}`;
      } else if (mediaType === "movie") {
        endpoint = `/movies/${id}/servers`;
      } else {
        // Default fallback - use hardcoded sources
        setIsLoading(false);
        return;
      }

      const response = await makeRequest(endpoint);

      if (response && response.data) {
        // Convert the array of server objects to the format expected by the UI
        const sourcesObj = {};
        response.data.forEach((server) => {
          if (server.status === "online") {
            sourcesObj[server.id] = server.name;
          }
        });

        setStreamingSources(sourcesObj);
        setAvailableSources(response.data);

        // If current source is not available, select the first available one
        if (
          response.data.length > 0 &&
          !response.data.find(
            (s) => s.id === currentSource && s.status === "online"
          )
        ) {
          const firstAvailable = response.data.find(
            (s) => s.status === "online"
          );
          if (firstAvailable) {
            setCurrentSource(firstAvailable.id);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching streaming sources:", error);
      setError("Video streaming sources unavailable");
      setIsLoading(false);
    }
  };

  const getStreamingUrl = async (
    source,
    mediaType,
    id,
    season = null,
    episode = null
  ) => {
    try {
      let endpoint;
      let queryParams = "";

      if (mediaType === "tv" && season && episode) {
        endpoint = `/tv/${id}/streaming-sources`;
        queryParams = `?season=${season}&episode=${episode}`;
      } else if (mediaType === "movie") {
        endpoint = `/movies/${id}/streaming-sources`;
      } else {
        return "";
      }

      const response = await makeRequest(endpoint + queryParams);

      if (response && response.data) {
        // Return the URL for the requested source
        return response.data[source] || "";
      }

      return "";
    } catch (error) {
      console.error("Error fetching streaming URL:", error);
      setError("Failed to get streaming URL");
      return "";
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
    availableSources,
  };

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};
