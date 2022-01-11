import React, { FC } from "react";

interface IAlertProps {
  alertType: string;
  alertMessage: string;
}

export const Alert: FC<IAlertProps> = (props) => {
  return (
    <div className={`alert ${props.alertType}`} role="alert">
      {props.alertMessage}
    </div>
  );
};
