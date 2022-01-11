import React, { FC, Fragment, useEffect, useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Movies } from "./components/Movies";
import { Admin } from "./components/Admin";
import { Home } from "./components/Home/Home";
import { OneMovie } from "./components/OneMovie";
import { Genres } from "./components/Genres";
import { OneGenre } from "./components/OneGenre";
import { EditMovie } from "./components/EditMovie";
import { Login } from "./components/Login";
import { GraphQL } from "./components/GraphQL";
import { OneMovieGraphQL } from "./components/OneMovieGraphQL";

export const App: FC = () => {
  const [jwt, setJwt] = useState<string>("");

  useEffect(() => {
    const t = localStorage.getItem("jwt");
    if (t !== null && jwt === "") {
      setJwt(t);
    }
  }, []);

  const logout = () => {
    setJwt("");
    localStorage.removeItem("jwt");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="row">
          <div className="col mt-3">
            <h1 className="mt-3">Go Watch a Movie!</h1>
          </div>
          <div className="col mt-3 text-end">
            {jwt === "" && <Link to="/login">Login</Link>}
            {jwt !== "" && (
              <Link to="/logout" onClick={logout}>
                Logout
              </Link>
            )}
          </div>
        </div>

        <hr className="mb-3" />
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <ul className="list-group">
              <li className="list-group-item">
                <Link to="/">Home</Link>
              </li>
              <li className="list-group-item">
                <Link to="/movies">Movies</Link>
              </li>
              <li className="list-group-item">
                <Link to="/genres">Genres</Link>
              </li>

              {jwt !== "" && (
                <Fragment>
                  <li className="list-group-item">
                    <Link to="/admin/movie/0">Add movie</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/admin">Manage Catalogue</Link>
                  </li>
                </Fragment>
              )}

              <li className="list-group-item">
                <Link to="/graphql">GraphQL</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-md-10">
          <Routes>
            <Route path="/movies/:id" element={<OneMovie />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/genre/:id" element={<OneGenre />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/admin/movie/:id" element={<EditMovie jwt={jwt} />} />
            <Route path="/admin" element={<Admin jwt={jwt} />} />
            <Route path="/graphql" element={<GraphQL />} />
            <Route path="/graphql/movie/:id" element={<OneMovieGraphQL />} />
            <Route
              path="/login"
              element={<Login handleJWTChange={(jwt: string) => setJwt(jwt)} />}
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
