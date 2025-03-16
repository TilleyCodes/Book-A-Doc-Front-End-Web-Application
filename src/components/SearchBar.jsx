import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import magnifyingGlass from '../assets/search-icon.png';
import { endpoints } from '../config/api';
import '../styles/searchBar.css';

export function SearchBar() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [medicalCentres, setMedicalCentres] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      const res = await fetch(endpoints.doctors);
      const bodyData = await res.json();
      const doctorAndSpecialty = bodyData.map((doc) => (
        `${doc.doctorName} (${doc.specialtyId.specialtyName})`
      ));
      setDoctors(doctorAndSpecialty);
    }

    async function fetchMedicalCentres() {
      const res = await fetch(endpoints.medicalCentres);
      const bodyData = await res.json();
      const centreNames = bodyData.map((centre) => centre.medicalCentreName);
      setMedicalCentres(centreNames);
    }
    fetchDoctors();
    fetchMedicalCentres();
  }, []);

  useEffect(() => {
    if (doctors.includes(input) || medicalCentres.includes(input)) {
      setSuggestions([]);
      return;
    }
    if (!input) {
      setSuggestions([]);
      return;
    }

    const filteredDocs = doctors.filter((docString) => (
      docString.toLowerCase().includes(input.toLowerCase())
    ));
    const filteredCentres = medicalCentres.filter((docString) => (
      docString.toLowerCase().includes(input.toLowerCase())
    ));
    const filtered = [...filteredDocs, ...filteredCentres];
    setSuggestions(filtered);
  }, [input, doctors, medicalCentres]);

  const handleSelect = (data) => {
    setInput(data);
    setSelected(data);
    setSuggestions([]);

    if (data.includes(' (')) {
      const doctorName = data.split(' (')[0];
      navigate(`/doctors?search=${encodeURIComponent(doctorName)}&exact=true`);
    } else {
      navigate(`/medical-centres?search=${encodeURIComponent(data)}&exact=true`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
    // eslint-disable-next-line no-console
    console.log(selected);
  };

  return (
    <div className="search-container">
      <input
        id="searchBar"
        name="searchBar"
        type="text"
        placeholder="Search GP, Specialty or Medical Centre"
        className="input-field"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="search-button"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <img
          className="input-icon"
          alt="magnifying glass icon"
          src={magnifyingGlass}
        />
      </button>
      {suggestions.length > 0 && (
        <ul className="dropdown" role="listbox" aria-label="Search suggestions">
          {suggestions.map((data) => (
            <li
              key={data}
              onClick={() => handleSelect(data)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelect(data);
                }
              }}
              role="option"
              tabIndex={0}
              aria-selected={data === selected}
            >
              {data}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
