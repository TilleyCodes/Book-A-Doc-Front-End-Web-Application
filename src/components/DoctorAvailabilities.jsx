import { useState, useEffect } from "react";
import "../styles/doctorAvailabilities.css";

export function DoctorAvailabilities({ doctor, medicalCentreId, onClose }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState(1); // Date/Time and Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [medicalCentre, setMedicalCentre] = useState(null);

  // Get medical centre details
  useEffect(() => {
    const fetchMedicalCentre = async () => {
      try {
        if (!medicalCentreId) return;
        
        const response = await fetch(`/api/medicalCentres`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const centres = await response.json();
        const centre = centres.find(c => c._id === medicalCentreId);
        
        if (centre) {
          setMedicalCentre(centre);
        }
      } catch (err) {
        console.error("Error fetching medical centre:", err);
        setError("Unable to load medical centre details");
      }
    };
    
    fetchMedicalCentre();
  }, [medicalCentreId]);

  // Generate available times when a date is selected
  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      // In a real app, this would be an API call to check availability
      // For now, we'll generate mock data after a short delay
      setTimeout(() => {
        const mockTimes = generateMockAvailability();
        setAvailableTimes(mockTimes);
        setLoading(false);
      }, 500);
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);

  // Mock availability data need to update later!!!!!!!
  const generateMockAvailability = () => {
    const times = [];
    // Timeimes from 9 AM to 5 PM with 30-minute intervals
    for (let hour = 9; hour < 17; hour++) {
      const hourFormatted = hour.toString().padStart(2, '0');
      times.push(`${hourFormatted}:00`);
      times.push(`${hourFormatted}:30`);
    }
    
    // Remove times to show unavailability
    return times.filter(() => Math.random() > 0.3);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedTime) {
      setStep(2);
    }
  };

  const handleConfirmBooking = () => {
    // API call to book the appointment
    alert(`Appointment booked with Dr. ${doctor.doctorName} on ${selectedDate} at ${selectedTime}`);
    onClose();
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
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="doctor-details">
          <h3>{doctor.doctorName}</h3>
          <p className="doctor-specialty">
            {doctor.specialtyId?.specialtyName || "General Practice"}
          </p>
          {medicalCentre && (
            <p className="medical-centre">{medicalCentre.medicalCentreName}</p>
          )}
        </div>
        
        {error && <div className="booking-error">{error}</div>}
        
        {step === 1 && (
          <div className="date-time-selection">
            <div className="date-selection">
              <label htmlFor="appointment-date">Select a Date:</label>
              <input 
                type="date" 
                id="appointment-date"
                min={today}
                value={selectedDate}
                onChange={handleDateChange}
                required
              />
            </div>
            
            {selectedDate && (
              <>
                {loading ? (
                  <div className="loading-times">Loading available times...</div>
                ) : (
                  <div className="time-selection">
                    <h4>Available Times:</h4>
                    {availableTimes.length > 0 ? (
                      <div className="time-slots">
                        {availableTimes.map((time) => (
                          <div 
                            key={time} 
                            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-times">No available times for the selected date.</p>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="booking-actions">
              <button className="btn cancel-btn" onClick={handleBack}>Cancel</button>
              <button 
                className="btn continue-btn" 
                onClick={handleContinue}
                disabled={!selectedTime}
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
                <span className="summary-label">Doctor:</span>
                <span>{doctor.doctorName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Specialty:</span>
                <span>{doctor.specialtyId?.specialtyName || "General Practice"}</span>
              </div>
              {medicalCentre && (
                <div className="summary-item">
                  <span className="summary-label">Location:</span>
                  <span>{medicalCentre.medicalCentreName}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="summary-label">Date:</span>
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Time:</span>
                <span>{selectedTime}</span>
              </div>
            </div>
            
            <div className="booking-actions">
              <button className="btn cancel-btn" onClick={handleBack}>Back</button>
              <button className="btn confirm-btn" onClick={handleConfirmBooking}>
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}