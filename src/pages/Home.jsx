import React from "react"
import "../styles/home.css"
import magnifyingGlass from "../assets/magnifying-glass.svg"
import steth from "../assets/stethoscope.svg"
import calendar from "../assets/calendar.svg"
import medical from "../assets/medical.svg"
import { useUserJwtContext } from "../hooks/useUserJwtData"

export function Home() {
    const { userJwtData } = useUserJwtContext()
    const isLoggedIn = Boolean(userJwtData && userJwtData.token)

    return (
        <>
            <div className="search-container">
                <input
                    id="searchBar"
                    name="searchBar"
                    type="text"
                    placeholder=" "
                    className="input-field"
                />
                <label className="input-label" htmlFor="search-bar">Search</label>
                <img
                    className="input-icon"
                    alt="magnifying glass icon"
                    title="Magnifying Glass"
                    src={magnifyingGlass}
                    style={{cursor: "pointer"}} 
                />
            </div>
            <div className="main-option-container">

                <div className="main-option-feature" id="gen-prac">
                    <img className="feature-icon" src={steth} />
                    <h3>General Practitioners</h3>
                </div>
                {isLoggedIn && (
                    <>
                        <div className="main-option-feature" id="my-app">
                            <img className="feature-icon" src={calendar} />  
                            <h3>My Appointments</h3>
                        </div>
                    </>
                )}

                <div className="main-option-feature" id="med-cent">
                    <img className="feature-icon" src={medical} />
                    <h3>Medical Centres</h3>
                </div>

            </div>
        </>
    )
}