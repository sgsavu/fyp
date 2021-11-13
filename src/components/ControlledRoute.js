
import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { use } from 'chai';


const whitelistMint = ["ADMIN","MINTER","MINTER_ADMIN"]
const whitelistVerify = ["ADMIN", "AUTHORITY","AUTHORITY_ADMIN"]
const whitelistAdmin = ["ADMIN","MINTER_ADMIN","AUTHORITY_ADMIN"]

const checkIfMeetsPermission = (requiredPermission, userRole) => {

    switch (requiredPermission) {
        case "/admin":
            return whitelistAdmin.some(whitelistedRole => whitelistedRole==userRole)
        case "/mint":
            return whitelistMint.some(whitelistedRole => whitelistedRole==userRole)
        case "/verify":
            return whitelistVerify.some(whitelistedRole => whitelistedRole==userRole)
        default:
            return true
    }
}


const PrivateRoute = ({ component: Component, ...rest }) => {

    const data = useSelector((state) => state.data);

    return (
        <Route {...rest} render={props => (
            checkIfMeetsPermission(rest.path, data.role) ?
                <Component {...props} />
                : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;