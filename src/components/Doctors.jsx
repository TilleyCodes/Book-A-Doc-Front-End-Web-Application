import { useState, useEffect } from "react";
import "../styles/doctors.css";
import stethoscopeIcon from "../assets/stethoscope.png";
import searchIcon from "../assets/search-icon.png";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        console.log("Fetching doctors data...");
        
        // Using the proxy from vite.config.js
        const res = await fetch('/api/doctors');
        console.log("Response received:", res.status, res.statusText);
        
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        
        const bodyData = await res.json();
        console.log("Doctors data:", bodyData);
        setDoctors(bodyData);
        setFilteredDoctors(bodyData); // Show all doctors by default
        
        // grab unique specialties
        const uniqueSpecialties = [...new Set(
          bodyData
            .filter(doc => doc.specialtyId && doc.specialtyId.specialtyName)
            .map(doc => doc.specialtyId.specialtyName)
        )];
        
        setSpecialties(uniqueSpecialties);
        setError(null);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDoctors();
  }, []);

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors;
    
    // Only apply search filter if there's an actual search query
    if (appliedSearchQuery.trim() !== "") {
      filtered = filtered.filter(doctor => 
        doctor.doctorName && 
        doctor.doctorName.toLowerCase().includes(appliedSearchQuery.toLowerCase())
      );
    }
    
    // Apply specialty filter
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter(doctor => 
        doctor.specialtyId && 
        doctor.specialtyId.specialtyName === selectedSpecialty
      );
    }
    
    setFilteredDoctors(filtered);
  }, [appliedSearchQuery, selectedSpecialty, doctors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    // If the search box cleared, clear the applied search
    if (e.target.value === "") {
      setAppliedSearchQuery("");
    }
  };

  if (loading) {
    return <div className="loading-container">Loading doctors...</div>;
  }

  return (
    <div className="doctors-page-container">      
      <div className="doctors-search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <img src={searchIcon} alt="Search-Icon" className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="search-button">→</button>
          </div>
        </form>
        
        <div className="filter-container">
          <label htmlFor="specialty-filter">Filter by specialty: </label>
          <select 
            id="specialty-filter"
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="specialty-filter"
          >
            <option value="all">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>
      
      {error && <div className="error-container">Error: {error}</div>}
      
      {filteredDoctors.length > 0 ? (
        <div className="doctors-list">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-header">
                <img src={stethoscopeIcon} alt="Doctor" className="doctor-icon" />
                <h3 className="doctor-name">{doctor.doctorName}</h3>
              </div>
              <p className="doctor-specialty">
                <span className="specialty-label">Specialty:</span>
                {doctor.specialtyId?.specialtyName || "General Practice"}
              </p>
              <button className="book-appointment-btn">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-doctors-message">
          No doctors found matching your criteria. Please try a different search or filter.
        </div>
      )}
      
      <div className="back-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        back to top ↑
      </div>
    </div>
  );
}