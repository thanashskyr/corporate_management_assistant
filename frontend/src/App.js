import React from "react";
import Login from "./login";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from "./Dashboard";
import PrivateRoute from './Auth';

function App() {
    
    
  return (
    <Router>
        <div className="App">
       
        <div className="content">
            <Switch>
                <Route exact path="/" component={Login}/>
                <PrivateRoute
                    exact
                    path="/dashboard"
                    component={Dashboard}
                />
            </Switch>
        </div>
        </div>
    </Router>
  );
}

export default App;