import { makeRequest } from "../services/apiUtils";

export const testBackendConnection = async () => {
  try {
    const startTime = performance.now();
    const response = await makeRequest("/test/ping");
    const endTime = performance.now();

    console.log("Backend connection successful:", response);

    return {
      success: true,
      responseTime: Math.round(endTime - startTime),
      serverTime: response.timestamp,
      message: response.message,
      environment: response.environment,
    };
  } catch (error) {
    console.error("Backend connection failed:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to connect to the backend",
    };
  }
};
