import { useState, useEffect } from 'react';
import '../styles/doctors.css';
import stethoscopeIcon from '../assets/stethoscope.png';
import searchIcon from '../assets/search-icon.png';
import { endpoints } from '../config/api';
import { DoctorAvailabilities } from './DoctorAvailabilities';

export function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [doctorCentres, setDoctorCentres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch doctors
        const doctorsRes = await fetch(endpoints.doctors);
        if (!doctorsRes.ok) {
          throw new Error(`HTTP error: ${doctorsRes.status}`);
        }
        const doctorsData = await doctorsRes.json();

        // Fetch doctor-centre
        const doctorCentresRes = await fetch(endpoints.doctorCentres);
        if (!doctorCentresRes.ok) {
          throw new Error(`HTTP error: ${doctorCentresRes.status}`);
        }
        const doctorCentresData = await doctorCentresRes.json();

        // mapping doctor IDs to their medical centers
        const doctorCentresMap = {};
        doctorCentresData.forEach((dc) => {
          if (dc.doctorId && dc.doctorId._id && dc.medicalCentreId) {
            if (!doctorCentresMap[dc.doctorId._id]) {
              doctorCentresMap[dc.doctorId._id] = [];
            }
            doctorCentresMap[dc.doctorId._id].push(dc.medicalCentreId);
          }
        });

        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setDoctorCentres(doctorCentresMap);

        // Extract unique specialties
        const uniqueSpecialties = [...new Set(
          doctorsData
            .filter((doc) => doc.specialtyId && doc.specialtyId.specialtyName)
            .map((doc) => doc.specialtyId.specialtyName),
        )];

        setSpecialties(uniqueSpecialties);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors;

    // Only apply search filter if there's an actual search query
    if (appliedSearchQuery.trim() !== '') {
      filtered = filtered.filter((doctor) =>
        doctor.doctorName &&
        doctor.doctorName.toLowerCase().includes(appliedSearchQuery.toLowerCase()),
      );
    }

    // Apply specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter((doctor) =>
        doctor.specialtyId &&
        doctor.specialtyId.specialtyName === selectedSpecialty,
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
    if (e.target.value === '') {
      setAppliedSearchQuery('');
    }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
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
          <label htmlFor="specialty-filter">
            {'Filter by specialty: '}
          </label>
          <select
            id="specialty-filter"
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
            className="specialty-filter"
          >
            <option value="all">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-container">
          {'Error: '}
          {error}
        </div>
      )}

      {filteredDoctors.length > 0 ? (
        <div className="doctors-list">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-header">
                <img src={stethoscopeIcon} alt="Doctor" className="doctor-icon" />
                <h3 className="doctor-name">{doctor.doctorName}</h3>
              </div>
              <p className="doctor-specialty">
                <span className="specialty-label">
                  Specialty:
                </span>
                {doctor.specialtyId?.specialtyName || 'General Practice'}
              </p>
              <button
                type="button"
                className="book-appointment-btn"
                onClick={() => handleBookAppointment(doctor)}
              >
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

      <div
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        back to top ↑
      </div>

      {showBooking && selectedDoctor && (
        <DoctorAvailabilities
          doctor={selectedDoctor}
          doctorCentres={doctorCentres[selectedDoctor._id] || []}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
