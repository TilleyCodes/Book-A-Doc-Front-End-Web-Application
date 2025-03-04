import React from "react"
import "../styles/home.css"
import steth from "../assets/stethoscope.svg"
import calendar from "../assets/calendar.svg"
import medical from "../assets/medical.svg"
import { useUserJwtContext } from "../hooks/useUserJwtData"
import { SearchBar } from "../components/SearchBar"

export function Home() {
    const { userJwtData } = useUserJwtContext()
    const isLoggedIn = Boolean(userJwtData && userJwtData.token)

    return (
        <>
            <SearchBar />
            <div className="main-option-container">

                <div className="main-option-feature" id="doctors">
                    <img className="feature-icon" src={steth} />
                    <h3>General Practitioners</h3>
                </div>
                
                {isLoggedIn && (
                    <>
                        <div className="main-option-feature" id="appointments">
                            <img className="feature-icon" src={calendar} />  
                            <h3>My Appointments</h3>
                        </div>
                    </>
                )}

                <div className="main-option-feature" id="centres">
                    <img className="feature-icon" src={medical} />
                    <h3>Medical Centres</h3>
                </div>

            </div>
        </>
    )
}