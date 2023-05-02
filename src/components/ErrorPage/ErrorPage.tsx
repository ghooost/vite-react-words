import { Link } from "react-router-dom";

export const ErrorPage = function () {
  return (
    <div>
      <h1>There is an Error</h1>
      <p>
        <Link to={`/`}>Come back to index</Link>
      </p>
    </div>
  );
};
