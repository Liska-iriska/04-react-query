import { useState } from "react";
import css from "./App.module.css";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { movieService } from "../../services/movieService";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");

  const openModal = (movieObj: Movie) => setSelectedMovie(movieObj);
  const closeModal = () => setSelectedMovie(null);

  const fetchMovies = async (searchTerm: string, page: number) => {
    setIsLoading(true);
    setIsError(false);

    try {
      const { movies, totalPages } = await movieService(searchTerm, page);
      if (movies.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
        return;
      }
      setMovies(movies);
      setTotalPages(totalPages);
    } catch {
      setIsError(true);
      setMovies([]);
      toast.error("Whoops, something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setCurrentPage(1);
    fetchMovies(searchTerm, 1);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    const nextPage = selected + 1;
    setCurrentPage(nextPage);
    fetchMovies(query, nextPage);
  };

  return (
    <div className="app">
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
