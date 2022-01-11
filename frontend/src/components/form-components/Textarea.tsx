import React, { FC } from "react";

interface ITextareaProps {
  title: string;
  name: string;
  value: string | ReadonlyArray<string> | number | undefined;
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export const Textarea: FC<ITextareaProps> = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label fw-bold">
        {props.title}
      </label>
      <textarea
        className="form-control"
        id={props.name}
        name={props.name}
        rows={props.rows || 3}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
};
