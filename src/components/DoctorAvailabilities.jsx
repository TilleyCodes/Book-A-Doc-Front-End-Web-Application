import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/doctorAvailabilities.css';
import { endpoints } from '../config/api';
import { useUserJwtContext } from '../hooks/useUserJwtData';

export function DoctorAvailabilities({ doctor, medicalCentreId, doctorCentres, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1); // Date/Time and Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicalCentres, setMedicalCentres] = useState([]);
  const [selectedMedicalCentre, setSelectedMedicalCentre] = useState(null);
  const { userJwtData } = useUserJwtContext();
  const navigate = useNavigate();

  // Get medical centre details
  useEffect(() => {
    const fetchMedicalCentres = async () => {
      try {
        // If a specific medical center is provided, use that
        if (medicalCentreId) {
          const response = await fetch(endpoints.medicalCentres);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const centres = await response.json();
          const centre = centres.find((c) => c._id === medicalCentreId);

          if (centre) {
            setMedicalCentres([centre]);
            setSelectedMedicalCentre(centre);
          }
          // Otherwise, fetch all the centers this doctor is associated with
        } else if (doctorCentres && doctorCentres.length > 0) {
          const response = await fetch(endpoints.medicalCentres);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const allCentres = await response.json();

          // Filter to get only the centers this doctor works at
          const relevantCentres = allCentres.filter((centre) =>
            doctorCentres.some((dc) =>
              (dc._id === centre._id) ||
              (dc.medicalCentreId?._id === centre._id),
            ),
          );

          setMedicalCentres(relevantCentres);
          if (relevantCentres.length > 0) {
            setSelectedMedicalCentre(relevantCentres[0]);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching medical centres:', err);
        setError('Unable to load medical centre details');
      }
    };

    fetchMedicalCentres();
  }, [medicalCentreId, doctorCentres]);

  // Fetch available times when a date is selected
  useEffect(() => {
    if (!selectedDate || !selectedMedicalCentre || !doctor) return;

    const fetchAvailableTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const availabilityEndpoint = endpoints.doctorAvailabilities(
          doctor._id,
          selectedDate,
        );

        const response = await fetch(availabilityEndpoint);

        if (!response.ok) {
          throw new Error(`Error fetching available times: ${response.status}`);
        }

        const data = await response.json();

        setAvailableTimes(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching availabilities:', err);
        setError('Unable to load available times. Please try again.');

        // Fallback to mock data if the API call fails
        const mockTimes = [];
        // Times from 9 AM to 5 PM with 30-minute intervals
        for (let hour = 9; hour < 17; hour += 1) {
          const hourFormatted = hour.toString().padStart(2, '0');
          mockTimes.push(`${hourFormatted}:00`);
          mockTimes.push(`${hourFormatted}:30`);
        }

        // Remove some random times to simulate unavailability
        setAvailableTimes(mockTimes.filter(() => Math.random() > 0.3));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, selectedMedicalCentre, doctor]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleMedicalCentreChange = (e) => {
    const centreId = e.target.value;
    const centre = medicalCentres.find((c) => c._id === centreId);
    setSelectedMedicalCentre(centre || null);
  };

  const handleContinue = () => {
    if (selectedTime && selectedMedicalCentre) {
      setStep(2);
    }
  };

  // Helper function to calculate end time (30 minutes later)
  function calculateEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours;
    let endMinutes = minutes + 30;

    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }

    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  }

  const handleConfirmBooking = async () => {
    if (!userJwtData.token) {
      // Redirect to login if not authenticated
      // eslint-disable-next-line no-alert
      alert('Please log in to book an appointment');
      onClose();
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // First, create an availability record
      const availabilityResponse = await fetch(endpoints.availabilities, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userJwtData.token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          startTime: selectedTime,
          endTime: calculateEndTime(selectedTime),
          isBooked: false,
        }),
      });

      if (!availabilityResponse.ok) {
        throw new Error('Failed to create availability');
      }

      const availabilityData = await availabilityResponse.json();

      // Create the booking with the availability ID
      const bookingData = {
        patientId: userJwtData.patientId,
        doctorId: doctor._id,
        medicalCentreId: selectedMedicalCentre._id,
        availabilityId: availabilityData._id,
        status: 'confirmed',
      };

      const bookingResponse = await fetch(endpoints.bookings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userJwtData.token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      // Process the response without assigning to an unused variable
      await bookingResponse.json();

      // Show success message and close modal
      // eslint-disable-next-line no-alert
      alert(`Appointment successfully booked with Dr. ${doctor.doctorName}`);
      onClose();

      // Redirect to appointments page
      navigate('/appointments');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error booking appointment:', err);
      setError(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="doctor-availabilities-modal">
      <div className="doctor-availabilities-content">
        <div className="doctor-availabilities-header">
          <h2>Book an Appointment</h2>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {step === 1 && (
          <div className="booking-flow">
            <div className="doctor-info-compact">
              <h3>{doctor.doctorName}</h3>
              <p className="doctor-specialty">
                {doctor.specialtyId?.specialtyName || 'General Practice'}
              </p>
            </div>

            {error && <div className="booking-error">{error}</div>}

            <div className="booking-form">
              {selectedMedicalCentre && (
                <div className="location-section">
                  <span className="location-label">
                    Location:
                  </span>
                  <div className="location-details">
                    <p className="medical-centre-name">
                      {selectedMedicalCentre.medicalCentreName}
                    </p>
                    <p className="medical-centre-address">
                      {selectedMedicalCentre.address.street}
                      {', '}
                      {selectedMedicalCentre.address.city}
                    </p>
                  </div>
                </div>
              )}

              {medicalCentres.length > 1 && (
                <div className="medical-centre-selection">
                  <label htmlFor="medical-centre-select">Select a Medical Centre:</label>
                  <select
                    id="medical-centre-select"
                    value={selectedMedicalCentre?._id || ''}
                    onChange={handleMedicalCentreChange}
                    required
                    className="medical-centre-select"
                  >
                    <option value="" disabled>Select a location</option>
                    {medicalCentres.map((centre) => (
                      <option key={centre._id} value={centre._id}>
                        {centre.medicalCentreName}
                        {' - '}
                        {centre.address.street}
                        {', '}
                        {centre.address.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="date-selection">
                <label htmlFor="appointment-date">Select a Date:</label>
                <input
                  type="date"
                  id="appointment-date"
                  min={today}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                  className="date-input"
                />
              </div>

              {selectedDate && !loading && (
                <div className="time-selection">
                  <h4>Available Times:</h4>
                  {availableTimes.length > 0 ? (
                    <div className="time-slots">
                      {availableTimes.map((time) => (
                        <button
                          type="button"
                          key={time}
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="no-times">No available times for the selected date.</p>
                  )}
                </div>
              )}

              {loading && (
                <div className="loading-times">Loading available times...</div>
              )}
            </div>

            <div className="booking-actions">
              <button
                type="button"
                className="btn cancel-btn"
                onClick={handleBack}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn continue-btn"
                onClick={handleContinue}
                disabled={!selectedTime || !selectedMedicalCentre}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="confirmation">
            <h3>Confirm Your Appointment</h3>

            <div className="appointment-summary">
              <div className="summary-item">
                <span className="summary-label">
                  Doctor:
                </span>
                <span>{doctor.doctorName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  Specialty:
                </span>
                <span>{doctor.specialtyId?.specialtyName || 'General Practice'}</span>
              </div>
              {selectedMedicalCentre && (
                <div className="summary-item">
                  <span className="summary-label">
                    Location:
                  </span>
                  <span>
                    {selectedMedicalCentre.medicalCentreName}
                    {', '}
                    {selectedMedicalCentre.address.city}
                  </span>
                </div>
              )}
              <div className="summary-item">
                <span className="summary-label">
                  Date:
                </span>
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  Time:
                </span>
                <span>{selectedTime}</span>
              </div>
            </div>

            <div className="booking-actions">
              <button
                type="button"
                className="btn cancel-btn"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                className="btn confirm-btn"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
