import { useState, useEffect } from 'react';
import '../styles/doctorList.css';
import stethoscopeIcon from '../assets/stethoscope.png';
import { DoctorAvailabilities } from './DoctorAvailabilities';
import { endpoints } from '../config/api';

export function DoctorList({ medicalCentreId, onClose }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log('Fetching doctor-centre relationships for medicalCentreId:', medicalCentreId);

        if (!medicalCentreId) {
          throw new Error('Medical centre ID is missing');
        }

        // Fetch the doctor-centre relationships using the proxy
        const doctorCentreResponse = await fetch(endpoints.doctorCentres);

        console.log('Response received:', doctorCentreResponse.status);

        if (!doctorCentreResponse.ok) {
          throw new Error(`HTTP error! Status: ${doctorCentreResponse.status}`);
        }

        const doctorCentreData = await doctorCentreResponse.json();
        console.log('DoctorCentre data:', doctorCentreData);

        // Filter relationships for selected medical centre
        const relevantDoctorCentres = doctorCentreData.filter(
          (dc) => dc.medicalCentreId && dc.medicalCentreId._id === medicalCentreId,
        );

        console.log('Filtered doctor centres:', relevantDoctorCentres);

        // Get all doctor IDs associated with this centre
        const doctorIds = relevantDoctorCentres.map((dc) => {
          if (dc.doctorId && dc.doctorId._id) {
            return dc.doctorId._id;
          }
          return null;
        }).filter((id) => id !== null);

        console.log('Doctor IDs for this medical centre:', doctorIds);

        if (doctorIds.length === 0) {
          setDoctors([]);
          setLoading(false);
          return;
        }

        // Fetch all doctors
        console.log('Fetching doctors...');
        const doctorsResponse = await fetch(endpoints.doctors);

        console.log('Doctors response:', doctorsResponse.status);

        if (!doctorsResponse.ok) {
          throw new Error(`HTTP error! Status: ${doctorsResponse.status}`);
        }

        const allDoctors = await doctorsResponse.json();
        console.log('All doctors:', allDoctors);

        // Filter doctors based on the IDs
        const centreSpecificDoctors = allDoctors.filter((doctor) =>
          doctor._id && doctorIds.includes(doctor._id),
        );

        console.log('Doctors for this centre:', centreSpecificDoctors);

        setDoctors(centreSpecificDoctors);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (medicalCentreId) {
      fetchDoctors();
    } else {
      setLoading(false);
      setError('No medical centre selected');
    }
  }, [medicalCentreId]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
  };

  return (
    <div className="doctor-list-modal">
      <div className="doctor-list-content">
        <div className="doctor-list-header">
          <h2>Available Doctors</h2>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {loading && <div className="doctor-list-loading">Loading doctors...</div>}

        {error && (
          <div className="doctor-list-error">
            {'Error: '}
            {error}
          </div>
        )}

        {!loading && !error && (
          <div>
            {doctors.length > 0 ? (
              <div className="doctors-container">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-icon">
                      <img src={stethoscopeIcon} alt="Doctor" />
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.doctorName}</h3>
                      <p className="doctor-specialty">
                        <span className="specialty-label">
                          Specialty:
                        </span>
                        {' '}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-doctors-message">
                No doctors available at this medical centre.
              </div>
            )}
          </div>
        )}
      </div>

      {showBooking && selectedDoctor && (
        <DoctorAvailabilities
          doctor={selectedDoctor}
          medicalCentreId={medicalCentreId}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
