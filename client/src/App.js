import "./App.css";
import { useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Login/Signup";
import Verification from "./components/Verification";
import Resend from "./components/Verification/Resend";
import ChangePassword from "./components/Verification/ChangePassword";
import { useSelector } from "react-redux";
import PrivateRoute from "./Routes/PrivateRoute";
import Dashboard from "./components/Screens/Dashboard";
import Services from "./components/Screens/Services";
import Orders from "./components/Screens/Orders";
import Earnings from "./components/Screens/Earnings";
import { Layout } from "antd";
import CustomHeader from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

function App(props) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("token", token);
    } else if (!isAuthenticated) {
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);
  return (
    <Layout style={{ height: "100vh" }}>
      {isAuthenticated && <Sidebar />}
      <Layout style={{ backgroundColor: "#fff" }}>
        {isAuthenticated && <CustomHeader />}
        <Switch>
          {!isAuthenticated && (
            <>
              <Route exact path="/" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route
                exact
                path="/merchant/verify/:id/:token"
                component={Verification}
              />
              <Route
                exact
                path="/user/verify/:id/:token"
                component={Verification}
              />
              <Route exact path="/resend" component={Resend} />
              <Route exact path="/forgot-password" component={Resend} />
              <Route
                exact
                path="/merchant/reset/:id/:token"
                component={ChangePassword}
              />
              <Route
                exact
                path="/user/reset/:id/:token"
                component={ChangePassword}
              />
            </>
          )}
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/services" component={Services} />
          <PrivateRoute exact path="/orders" component={Orders} />
          <PrivateRoute exact path="/earnings" component={Earnings} />
          <Route
            exact
            path="*"
            render={() =>
              isAuthenticated === true ? (
                <Redirect to="/dashboard" />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </Switch>
      </Layout>
    </Layout>
  );
}

export default withRouter(App);
