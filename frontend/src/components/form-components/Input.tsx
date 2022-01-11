import React, { FC } from "react";

interface IInputProps {
  title: string;
  className?: string;
  type: string;
  name: string;
  value: string | ReadonlyArray<string> | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorDiv?: string;
  errorMsg?: string;
}

export const Input: FC<IInputProps> = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label fw-bold">
        {props.title}
      </label>
      <input
        type={props.type}
        className={`form-control ${props.className}`}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />

      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
};
