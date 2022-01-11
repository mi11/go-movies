import React, { FC, Fragment, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { IMovie } from "./interfaces/IMovie";

export const OneGenre: FC = () => {
  const { state } = useLocation();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movies/` + id)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid response code: " + response.status);
        }

        return response.json();
      })
      .then(
        (json) => {
          setLoaded(true);
          setMovies(json.movies);
        },
        (err) => {
          setLoaded(true);
          setError(err);
        }
      );
  }, [id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        {/*// @ts-ignore*/}
        <h2>Genre: {state.genreName}</h2>

        <div className="list-group">
          {movies?.map((m) => (
            <Link
              to={`/movies/${m.id}`}
              className="list-group-item list-group-item-action"
              key={m.id}
            >
              {m.title}
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
};
