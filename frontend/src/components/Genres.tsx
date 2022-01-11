import React, { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface IGenre {
  id: number;
  genre_name: string;
}

export const Genres: FC = () => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid response code: " + response.status);
        }

        return response.json();
      })
      .then(
        (json) => {
          setGenres(json.genres);
          setLoaded(true);
        },
        (err) => {
          setLoaded(true);
          setError(err);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Genres</h2>

        <div className="list-group">
          {genres.map((genre) => (
            <Link
              to={`/genre/${genre.id}`}
              state={{ genreName: genre.genre_name }}
              className="list-group-item list-group-item-action"
              key={genre.id}
            >
              {genre.genre_name}
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
};
