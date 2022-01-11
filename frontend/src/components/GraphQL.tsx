import React, { FC, Fragment, useEffect, useState } from "react";
import { IMovie } from "./interfaces/IMovie";
import { Input } from "./form-components/Input";
import { Link } from "react-router-dom";

export const GraphQL: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "d-none",
    message: "",
  });

  useEffect(() => {
    const payload = `
    {
      list {
        id
        title
        runtime
        year   
        description   
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
        return Object.values(data.data.list) as IMovie[];
      })
      .then(
        (list) => {
          setMovies(list);
          setLoaded(true);
        },
        (err) => {
          setLoaded(true);
          setError(err);
        }
      );
  }, []);

  const performSearch = () => {
    setLoaded(false);

    const payload = `
    {
      search(titleContains: "${searchTerm}") {
        id
        title
        runtime
        year   
        description   
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
        return Object.values(data.data.search) as IMovie[];
      })
      .then(
        (list) => {
          console.log(list);
          if (list.length > 0) {
            setMovies(list);
          } else {
            setMovies([]);
          }

          setLoaded(true);
        },
        (err) => {
          setLoaded(true);
          setError(err);
        }
      );
  };

  useEffect(() => {
    performSearch();
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>GraphQL</h2>
        <hr />

        <Input
          title="Search"
          type="text"
          name="search"
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="list-group">
          {movies.map((m) => (
            <Link
              key={m.id}
              className="list-group-item list-group-item-action"
              to={`/graphql/movie/${m.id}`}
            >
              <strong>{m.title}</strong>
              <br />
              <small className="text-muted">
                ({m.year} - {m.runtime} minutes)
              </small>
              <br />
              {m.description.slice(0, 100)}...
            </Link>
          ))}
        </div>
      </Fragment>
    );
  }
};
