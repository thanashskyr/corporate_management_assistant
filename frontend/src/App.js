import React from "react";
import Login from "./login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Employees from "./Employee";
import PrivateRoute from "./Auth";
import Departments from "./Department";
import "./theme.css";

function App() {
  return (
    <Router>
      <div className="body-background">
        <div className="App">
          <div className="content">
            <Switch>
              <Route exact path="/" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/Employee"
                component={Employees}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path="/Department"
                component={Departments}
              ></PrivateRoute>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
