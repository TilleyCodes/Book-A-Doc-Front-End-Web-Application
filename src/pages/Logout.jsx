import React from "react";
import { NavLink } from "react-router";
import '../styles/logout.css'

export function Logout() {
    return (
        <div className="logout-container">
            <p>You have been successfully logged out</p>
            <NavLink to={'/'}>Return Home</NavLink>
        </div>
    )
}