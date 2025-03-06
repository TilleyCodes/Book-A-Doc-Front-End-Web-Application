import React, { useEffect, useState } from "react";
import magnifyingGlass from "../assets/search-icon.png"

export function SearchBar() {
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selected, setSelected] = useState('')
    const [doctors, setDoctors] = useState([])
    const [medicalCentres, setMedicalCentres] = useState([])

    useEffect(() => {
        async function fetchDoctors() {
            const res = await fetch('http://localhost:3000/doctors')
            const bodyData = await res.json()
            const doctorAndSpecialty = bodyData.map((doc) => {
                return `${doc.doctorName} (${doc.specialtyId.specialtyName})`
            })
            setDoctors(doctorAndSpecialty)
        }

        async function fetchMedicalCentres() {
            const res = await fetch('http://localhost:3000/medicalCentres')
            const bodyData = await res.json()
            const centreNames = bodyData.map((centre) => centre.medicalCentreName)
            setMedicalCentres(centreNames)
        }
        fetchDoctors()
        fetchMedicalCentres()
    }, [])

    useEffect(() => {
        if (doctors.includes(input) || medicalCentres.includes(input)) {
            setSuggestions([])
            return
        }
        if (!input) {
            setSuggestions([])
            return
        }

        const filteredDocs = doctors.filter((docString) => 
            docString.toLowerCase().includes(input.toLowerCase())
        )
        const filteredCentres = medicalCentres.filter((docString) =>
            docString.toLowerCase().includes(input.toLowerCase())
        )
        const filtered = [...filteredDocs, ...filteredCentres]
        setSuggestions(filtered)
    }, [input, doctors, medicalCentres])

    const handleSelect = (data) => {
        setInput(data)
        setSelected(data)
        setSuggestions([])
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && suggestions.length > 0) {
            handleSelect(suggestions[0])
        }
    }

    const handleSearchClick = () => {
        if (suggestions.length > 0) {
            handleSelect(suggestions[0])
        }
        console.log(selected)
    }

    return (
        <>
            <div className="search-container">
                <input
                    id="searchBar"
                    name="searchBar"
                    type="text"
                    placeholder=" "
                    className="input-field"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    />
                <label className="input-label" id="search-bar-label" htmlFor="search-bar">Search GP, Specialty or Medical Centre</label>
                <img
                    className="input-icon"
                    alt="magnifying glass icon"
                    title="Magnifying Glass"
                    src={magnifyingGlass}
                    style={{cursor: "pointer"}} 
                    onClick={handleSearchClick}
                    />
                {suggestions.length > 0 && (
                    <ul className="dropdown">
                        {suggestions.map((data) => (
                            <li key={data} onClick={() => handleSelect(data)}>
                                {data}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}