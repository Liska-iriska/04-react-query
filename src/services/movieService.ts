import axios from "axios";
import type { Movie } from "../types/movie";

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface HTTPResponse {
  results: Movie[];
  total_pages: number;
}

export const movieService = async (
  searchTerm: string,
  page: number,
): Promise<{ movies: Movie[]; totalPages: number }> => {
  const response = await instance.get<HTTPResponse>("/search/movie", {
    params: {
      query: searchTerm,
      page: page,
    },
  });
  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
};
