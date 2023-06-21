
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { checkRoutePermissionFor } from '../utils/Roles';

/**
  * Authenticates user access to certain pages/components throughout the app 
  * based on their role in the ecosystem.
  */
const PrivateRoute = ({ component: Component, ...rest }) => {
    const data = useSelector((state) => state.data);

    return (
        <Route {...rest} render={props => (
            checkRoutePermissionFor(rest.path, data.myRole) ?
                <Component {...props} />
                : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;