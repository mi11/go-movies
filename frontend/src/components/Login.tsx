import React, { FC, Fragment, useState } from "react";
import { Alert } from "./ui-components/Alert";
import { Input } from "./form-components/Input";
import { useNavigate } from "react-router-dom";

interface ILoginProps {
  handleJWTChange: (jwt: string) => void;
}

export const Login: FC<ILoginProps> = ({ handleJWTChange }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<Error | undefined>();
  const [errors, setErrors] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "d-none",
    message: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = [];
    if (email === "") {
      errors.push("email");
    }

    if (password === "") {
      errors.push("password");
    }

    setErrors(errors);

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(event.target as HTMLFormElement);
    const payload = Object.fromEntries(data.entries());

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
    };

    fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlert({ type: "alert-danger", message: data.error.message });
        } else {
          handleJWTChange(data.jwt);
          localStorage.setItem("jwt", data.jwt);
          navigate("/admin");
        }
      });
  };

  const hasError = (key: string) => {
    return errors.indexOf(key) !== -1;
  };

  return (
    <Fragment>
      <h2>Login</h2>
      <hr />
      <Alert alertType={alert.type} alertMessage={alert.message} />

      <form className="pt-3" onSubmit={handleSubmit}>
        <Input
          title="Email"
          type="email"
          name="email"
          value={email}
          className={hasError("email") ? "is-invalid" : ""}
          errorDiv={hasError("email") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a valid email address"}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <Input
          title="Password"
          type="password"
          name="password"
          value={password}
          className={hasError("password") ? "is-invalid" : ""}
          errorDiv={hasError("password") ? "text-danger" : "d-none"}
          errorMsg={"Please enter a password"}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <hr />

        <button className="btn btn-primary">Login</button>
      </form>
    </Fragment>
  );
};
