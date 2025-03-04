import React, { useEffect, useState } from "react";
import magnifyingGlass from "../assets/magnifying-glass.svg"

export function SearchBar() {
    const [input, setInput] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selected, setSelected] = useState('')
    const medicalCentres = ['Brisbane', 'Sydney', 'Melbourne', 'Hobart', 'Adelaide', 'Perth']

    useEffect(() => {
        if (medicalCentres.includes(input)) {
            setSuggestions([])
            return
        }
        if (!input) {
            setSuggestions([])
            return
        }

        const filtered = medicalCentres.filter((centre) => 
            centre.toLowerCase().includes(input.toLocaleLowerCase())
        )
        setSuggestions(filtered)
    }, [input])

    const handleSelect = (centre) => {
        setInput(centre)
        setSelected(centre)
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
                        {suggestions.map((centre) => (
                            <li key={centre} onClick={() => handleSelect(centre)}>
                                {centre}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}