import React, { useEffect, useState } from "react";
import stethoscopeIcon from "../assets/stethoscope.png";
import "../styles/doctors.css";

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        console.log("Fetching doctors data...");
        
        // proxy from vite.config.js
        const res = await fetch('https://book-a-doc-back-end-web-application.onrender.com/doctors');
        console.log("Response received:", res.status, res.statusText);
        
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        
        const bodyData = await res.json();
        console.log("Doctors data:", bodyData);
        setDoctors(bodyData);
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

  if (loading) {
    return <div className="loading-container">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="doctors-page-container">
      <h2 className="doctors-title">List of Doctors</h2>
      
      {doctors.length > 0 ? (
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-icon">
                <img src={stethoscopeIcon} alt="Doctor" />
              </div>
              <div className="doctor-info">
                <h3>{doctor.doctorName}</h3>
                <p className="doctor-specialty">
                  <span className="specialty-label">Specialty:</span>
                  {doctor.specialtyId?.specialtyName || "General Practice"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-doctors-message">
          No doctors found. Please try again later.
        </div>
      )}
    </div>
  );
}