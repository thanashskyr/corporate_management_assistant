import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
    {...rest}
   render={props => {
      
        const storedToken = localStorage.getItem('token');
        const storedExpirationTime = localStorage.getItem('expirationTime');
        const currentTime = new Date().getTime();
        
        if (storedToken && storedExpirationTime && currentTime < parseInt(storedExpirationTime)) {
            // User is authenticated, render the Component
            return <Component {...props} />;
          } else {
            // User is not authenticated, redirect to login page
            return <Redirect to="/" />;
          }
        
    }}
  />
);

export default PrivateRoute;
