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
}

export const movieService = async (searchTerm: string): Promise<Movie[]> => {
  const response = await instance.get<HTTPResponse>("/search/movie", {
    params: {
      query: searchTerm,
    },
  });
  return response.data.results;
};
