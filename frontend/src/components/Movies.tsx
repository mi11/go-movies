import React, { FC, Fragment } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "./hooks/useMovies";

export const Movies: FC = () => {
  const { movies, isLoaded, error } = useMovies();

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Choose a movie</h2>

        <div className="list-group">
          {movies.map((m) => (
            <Link
              to={`/movies/${m.id}`}
              key={m.id}
              className="list-group-item list-group-item-action"
            >
              {m.title}
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
};
