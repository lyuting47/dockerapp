import React from "react";
import { ApiError } from "../ApiError";

const ApiErrorProfile = (props: { data: ApiError }) => {
  return (
    <form>
      <hr style={{ width: "100%" }} />
      <div>
        <p style={{ color: "red" }}>
          <strong> Request Error </strong>
        </p>
        <p>
          <strong>Error Name: </strong> {props.data.name}
        </p>
        <p>
          <strong>Error Message: </strong> {props.data.message}
        </p>
      </div>
    </form>
  );
};

export default ApiErrorProfile;
