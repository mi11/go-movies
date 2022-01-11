import React, { FC, Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMovies } from "./hooks/useMovies";

interface IAdminProps {
  jwt: string;
}

export const Admin: FC<IAdminProps> = ({ jwt }) => {
  const navigate = useNavigate();
  const { movies, isLoaded, error } = useMovies();

  useEffect(() => {
    if (jwt === "") {
      navigate("/login");
    }
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Manage Catalogue</h2>

        <hr />

        <div className="list-group">
          {movies.map((m) => (
            <Link
              to={`/admin/movie/${m.id}`}
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
