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

  const value = {
    currentSource,
    setCurrentSource,
    streamingSources: { vidsrc: "#" },
    error,
    setError,
    isLoading,
    fetchSources,
  };

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};
