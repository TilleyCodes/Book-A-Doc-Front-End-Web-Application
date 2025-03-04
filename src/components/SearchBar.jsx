import React, { useEffect, useState } from "react";
import magnifyingGlass from "../assets/magnifying-glass.svg"

export function SearchBar() {
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selected, setSelected] = useState('')
    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        async function fetchDoctors() {
            const res = await fetch('http://localhost:3000/doctors')
            const bodyData = await res.json()
            const doctorAndSpecialty = bodyData.map((doc) => {
                return `${doc.doctorName} (${doc.specialtyId.specialtyName})`
            })
            setDoctors(doctorAndSpecialty)
        }
        fetchDoctors()
    }, [])

    useEffect(() => {
        if (doctors.includes(input)) {
            setSuggestions([])
            return
        }
        if (!input) {
            setSuggestions([])
            return
        }

        const filtered = doctors.filter((docString) => 
            docString.toLowerCase().includes(input.toLowerCase())
        )
        setSuggestions(filtered)
    }, [input, doctors])

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
                <label className="input-label" htmlFor="search-bar">Search GP or Medical Centre</label>
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
                        {suggestions.map((doctor) => (
                            <li key={doctor} onClick={() => handleSelect(doctor)}>
                                {doctor}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}