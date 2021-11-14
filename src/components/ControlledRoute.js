
import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { checkRoutePermissionFor } from '../pages/PermissionsAndRoles';


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