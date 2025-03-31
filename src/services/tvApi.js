import { makeRequest } from "./apiUtils";

export const fetchGenres = async (type = "tv") => {
  const response = await makeRequest(`/genres/${type}`);
  return response?.genres || [];
};

export const fetchPopularTVShows = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.first_air_date_year
      ? { first_air_date_year: params.first_air_date_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching popular TV shows with params: ${queryParams}`);
  const response = await makeRequest(`/tv/popular?${queryParams}`);
  return response;
};

export const fetchTopRatedTVShows = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.first_air_date_year
      ? { first_air_date_year: params.first_air_date_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching top rated TV shows with params: ${queryParams}`);
  const response = await makeRequest(`/tv/top-rated?${queryParams}`);
  return response;
};

export const fetchOnAirTVShows = async (page = 1, params = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...(params.with_genres
      ? { with_genres: params.with_genres.toString() }
      : {}),
    ...(params.first_air_date_year
      ? { first_air_date_year: params.first_air_date_year.toString() }
      : {}),
  }).toString();

  console.log(`Fetching on air TV shows with params: ${queryParams}`);
  const response = await makeRequest(`/tv/on-the-air?${queryParams}`);
  return response;
};

export const searchTVShows = async (query, page = 1) => {
  const queryParams = new URLSearchParams({
    query,
    page: page.toString(),
  }).toString();

  console.log(`Searching TV shows with query: ${query}`);
  const response = await makeRequest(`/search/tv?${queryParams}`);
  return response;
};

export const fetchTVShowDetails = async (id) => {
  console.log(`Fetching TV show details for ID: ${id}`);
  const response = await makeRequest(`/tv/${id}`);
  return response;
};

export const fetchTVShowSeason = async (id, seasonNumber) => {
  console.log(`Fetching season ${seasonNumber} for TV show ID: ${id}`);
  const response = await makeRequest(`/tv/${id}/season/${seasonNumber}`);
  return response;
};

export const fetchTVShowSeasons = fetchTVShowSeason;

export const fetchTVStreamingSources = async (id, season, episode) => {
  return makeRequest(
    `/tv/${id}/streaming-sources?season=${season}&episode=${episode}`
  );
};

export const fetchTVServers = async (id, season, episode) => {
  return makeRequest(`/tv/${id}/servers?season=${season}&episode=${episode}`);
};
