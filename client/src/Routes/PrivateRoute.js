import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(rest);
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <Redirect to="/" from={rest.path} />
  );
};

export default PrivateRoute;
