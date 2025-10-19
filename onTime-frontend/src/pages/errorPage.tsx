import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Navbar />
      <div className="">
        <h1>Oops...</h1>
        <p>
          {isRouteErrorResponse(error)
            ? "This page does not exist"
            : "An unexpected error occured"}
        </p>
      </div>
    </>
  );
};

export default ErrorPage;
