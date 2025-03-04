import { NavLink } from "react-router"
import { useUserJwtContext } from "../hooks/useUserJwtData"

export function Navbar() {
    const { userJwtData } = useUserJwtContext()
    const isLoggedIn = Boolean(userJwtData && userJwtData.token)


    return (
        <nav>
            <NavLink to={'/'}id="nav-home">
                Home
            </NavLink>
            <NavLink to={'/about'} id="nav-about">
                About
            </NavLink>
            {/* Show login and sign up links when patient is not signed in */}
            {!isLoggedIn && (
                <>
                    <NavLink to={'/login'} id="nav-login">
                        Login
                    </NavLink>
                    <NavLink to={'/sign-up'} id="nav-sign-up">
                        Sign Up
                    </NavLink>            
                </>
            )}
            {/* Show logout link when patient is logged in */}
            {isLoggedIn && (
                <>
                    <NavLink to={'/logout'} id="nav-logout">
                        Logout
                    </NavLink>
                </>
            )}
        </nav>
    )
}