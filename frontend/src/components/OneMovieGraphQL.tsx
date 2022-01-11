import React, { Fragment, useEffect, useState } from "react";
import { IMovie } from "./interfaces/IMovie";
import { useParams } from "react-router-dom";

export const OneMovieGraphQL = () => {
  const [movie, setMovie] = useState<IMovie>();
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const { id } = useParams();

  useEffect(() => {
    const payload = `
    {
      movie(id: ${id}) {
        id
        title
        description
        year
        release_date   
        runtime
        rating
        mpaa_rating
      }
    }
    `;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const requestOptions = {
      method: "POST",
      body: payload,
      headers,
    };

    fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMovie(data.data.movie);
        setLoaded(true);
      })
      .catch((err) => {
        setLoaded(true);
        setError(err);
      });
  }, [id]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>
          Movie: {movie?.title} ({movie?.year})
        </h2>

        <div className="float-start">
          <small>{movie?.mpaa_rating}</small>
        </div>
        <div className="float-end">
          {Object.values(movie?.genres || []).map((genre, i) => {
            return (
              <span className="badge bg-secondary me-1" key={i}>
                {genre}
              </span>
            );
          })}
        </div>

        <div className="clearfix"></div>
        <hr />

        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>{movie?.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Description:</strong>
              </td>
              <td>{movie?.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Run time:</strong>
              </td>
              <td>{movie?.runtime} minutes</td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
};
