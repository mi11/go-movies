import React, { useEffect, useState } from "react";
import { IMovie } from "../interfaces/IMovie";

export const useMovies = (): {
  movies: IMovie[];
  isLoaded: boolean;
  error: Error | undefined;
} => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid response code: " + response.status);
        }

        return response.json();
      })
      .then(
        (json) => {
          setMovies(json.movies);
          setLoaded(true);
        },
        (err) => {
          setLoaded(true);
          setError(err);
        }
      );
  }, []);

  return { movies, isLoaded, error };
};
