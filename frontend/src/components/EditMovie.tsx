import React, { FC, Fragment, useEffect, useState } from "react";
import { IMovie } from "./interfaces/IMovie";
import { Input } from "./form-components/Input";
import { Textarea } from "./form-components/Textarea";
import { Select } from "./form-components/Select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert } from "./ui-components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface IEditMovieProps {
  jwt: string;
}

export const EditMovie: FC<IEditMovieProps> = ({ jwt }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [movie, setMovie] = useState<IMovie>({
    id: "0",
    title: "",
    description: "",
    year: null,
    release_date: null,
    runtime: null,
    rating: null,
    mpaa_rating: "",
    genres: {},
  });
  const [mpaaOptions] = useState([
    { id: "G", value: "G" },
    { id: "PG", value: "PG" },
    { id: "PG13", value: "PG13" },
    { id: "R", value: "R" },
    { id: "NC17", value: "NC17" },
  ]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [errors, setErrors] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "d-none",
    message: "",
  });

  useEffect(() => {
    if (jwt === "") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (parseInt(id || "0") > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/movie/${id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error("Invalid response code: " + response.status);
          }

          return response.json();
        })
        .then(
          (json) => {
            setMovie({
              ...json.movie,
              release_date: json.movie.release_date.split("T")[0],
            });
            setLoaded(true);
          },
          (err) => {
            setLoaded(true);
            setError(err);
          }
        );
    } else {
      setLoaded(true);
    }
  }, [id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // client side validation
    const errors = [];
    if (movie.title === "") {
      errors.push("title");
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(data.entries());
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwt}`);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    };

    fetch(
      `${process.env.REACT_APP_API_URL}/v1/admin/edit_movie`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({ type: "alert-danger", message: data.error.message });
        } else {
          navigate("/admin");
        }
      });
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value, name } = event.target;

    setMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const hasError = (key: string) => {
    return errors.indexOf(key) !== -1;
  };

  const confirmDelete = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();

    confirmAlert({
      title: "Delete movie?",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", `Bearer ${jwt}`);

            fetch(
              `${process.env.REACT_APP_API_URL}/v1/admin/delete_movie/${movie.id}`,
              {
                method: "GET",
                headers,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  setAlert({
                    type: "alert-danger",
                    message: data.error.message,
                  });
                } else {
                  navigate("/admin");
                }
              });
          },
        },
        {
          label: "No",
          onClick: () => console.log("Click No"),
        },
      ],
    });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  } else {
    return (
      <Fragment>
        <h2>Add/Edit Movie</h2>

        <Alert alertType={alert.type} alertMessage={alert.message} />

        <hr />

        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            name="id"
            id="id"
            value={movie.id}
            onChange={handleChange}
          />

          <Input
            title="Title"
            className={hasError("title") ? "is-invalid" : ""}
            type="text"
            name="title"
            value={movie.title}
            onChange={handleChange}
            errorDiv={hasError("title") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a title"}
          />

          <Input
            title="Release date"
            type="date"
            name="release_date"
            value={
              movie.release_date === null ? "" : movie.release_date.toString()
            }
            onChange={handleChange}
          />

          <Input
            title="Runtime"
            type="text"
            name="runtime"
            value={movie.runtime === null ? "" : movie.runtime}
            onChange={handleChange}
          />

          <Select
            title="MPPA Rating"
            name="mpaa_rating"
            value={movie.mpaa_rating}
            options={mpaaOptions}
            handleChange={handleChange}
            placeholder="Choose..."
          />
          <Input
            title="Rating"
            type="text"
            name="rating"
            value={movie.rating === null ? "" : movie.rating}
            onChange={handleChange}
          />

          <Textarea
            title="Description"
            name="description"
            value={movie.description}
            handleChange={handleChange}
          />

          <hr />

          <button className="btn btn-primary">Save</button>
          <Link to="/admin" className="btn btn-warning ms-1">
            Cancel
          </Link>
          {parseInt(movie.id) > 0 && (
            <a
              href="#!"
              onClick={confirmDelete}
              className="btn btn-danger ms-1"
            >
              Delete
            </a>
          )}
        </form>
      </Fragment>
    );
  }
};
