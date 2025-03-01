import { NavLink } from "react-router"

export function Navbar() {
    return (
        <nav>
            <NavLink to={'/'}id="nav-home">
                Home
            </NavLink>
            <NavLink to={'/about'} id="nav-about">
                About
            </NavLink>
            <NavLink to={'/login'} id="nav-login">
                Login
            </NavLink>
            <NavLink to={'/sign-up'} id="nav-sign-up">
                Sign Up
            </NavLink>
            <NavLink to={'/logout'} id="nav-logout">
                Logout
            </NavLink>
        </nav>
    )
}