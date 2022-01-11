import React, { FC } from "react";

interface ISelectProps {
  title: string;
  name: string;
  value: string | number | undefined;
  options: {
    id: string | number | undefined;
    value: string | undefined;
  }[];
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
}

export const Select: FC<ISelectProps> = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label fw-bold">
        {props.title}
      </label>
      <select
        className="form-select"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
      >
        <option className="form-select">{props.placeholder}</option>
        {props.options.map((option) => (
          <option
            className="form-select"
            key={option.id}
            value={option.id}
            label={option.value}
          >
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};
