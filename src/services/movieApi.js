const API_BASE_URL = "http://localhost:5000/api";

const makeRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
};

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchPopularMovies = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.primary_release_year
      ? { primary_release_year: params.primary_release_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching popular movies with params: ${queryParams}`);
  const response = await makeRequest(`/movies/popular?${queryParams}`);
  return response;
};

export const fetchTopRatedMovies = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.primary_release_year
      ? { primary_release_year: params.primary_release_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching top rated movies with params: ${queryParams}`);
  const response = await makeRequest(`/movies/top-rated?${queryParams}`);
  return response;
};

export const fetchUpcomingMovies = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.primary_release_year
      ? { primary_release_year: params.primary_release_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching upcoming movies with params: ${queryParams}`);
  const response = await makeRequest(`/movies/upcoming?${queryParams}`);
  return response;
};

export const searchMovies = async (query, page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    query,
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
  }).toString();

  console.log(`Searching movies with params: ${queryParams}`);
  return makeRequest(`/movies/search?${queryParams}`);
};

export const fetchMovieDetails = async (movieId) => {
  return makeRequest(`/movies/${movieId}`);
};

export const fetchGenres = async () => {
  return makeRequest("/movies/genres");
};

export const registerUser = async (userData) => {
  return makeRequest("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return makeRequest("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

export const getUserProfile = async () => {
  return makeRequest("/auth/profile", {
    headers: getAuthHeaders(),
  });
};

export const getFavorites = async () => {
  return makeRequest("/favorites", {
    headers: getAuthHeaders(),
  });
};

export const addToFavorites = async (movieId) => {
  return makeRequest(`/favorites/${movieId}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
};

export const removeFromFavorites = async (movieId) => {
  return makeRequest(`/favorites/${movieId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    with_genres: genreId.toString(),
  }).toString();

  return makeRequest(`/movies/discover?${queryParams}`);
};

export const fetchTrendingMovies = async (timeWindow = "week", page = 1) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    time_window: timeWindow,
  }).toString();

  return makeRequest(`/movies/trending?${queryParams}`);
};

export const fetchStreamingSources = async (movieId) => {
  return makeRequest(`/movies/${movieId}/streaming-sources`);
};

export const fetchAvailableServers = async (movieId) => {
  return makeRequest(`/movies/${movieId}/servers`);
};
