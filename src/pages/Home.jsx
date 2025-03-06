import React from "react"
import "../styles/home.css"
import steth from "../assets/stethoscope.png"
import calendar from "../assets/calendar.svg"
import medical from "../assets/medical-clinic.png"
import { useUserJwtContext } from "../hooks/useUserJwtData"
import { SearchBar } from "../components/SearchBar"
import { NavLink } from "react-router"

export function Home() {
    const { userJwtData } = useUserJwtContext()
    const isLoggedIn = Boolean(userJwtData && userJwtData.token)

    return (
        <>
            <SearchBar />
            <div className="main-option-container">
                <NavLink className="feature-link" to={'/doctors'}>
                    <div className="main-option-feature" id="doctors">
                        <img className="feature-icon" src={steth} />
                        <h3>General Practitioners</h3>
                    </div>
                </NavLink>
                
                {isLoggedIn && (
                    <>
                        <NavLink className="feature-link" to={'/appointments'}>
                            <div className="main-option-feature" id="appointments">
                                <img className="feature-icon" src={calendar} />  
                                <h3>My Appointments</h3>
                            </div>
                        </NavLink>
                    </>
                )}
                <NavLink className="feature-link" to={'/medical-centres'}>
                    <div className="main-option-feature" id="centres">
                        <img className="feature-icon" src={medical} />
                        <h3>Medical Centres</h3>
                    </div>
                </NavLink>

            </div>
        </>
    )
}